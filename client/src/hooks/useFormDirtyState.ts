import { useEffect, useMemo, useRef, useState } from "react";

// Basline and normalizer types
type Baseline = Record<string, string | null | undefined>;
type Normalizers = Partial<Record<string, (v: string) => string>>;

// Options available for components using this hook
type Options = {
  baseline: Baseline;
  onDirtyChange?: (dirty: boolean) => void;
  normalize?: Normalizers;
  resetKey?: number | string;
};

// The hook itself
export function useFormDirtyState({
  baseline,
  onDirtyChange,
  normalize = {},
  resetKey,
}: Options) {
  // Save the ref to the form and create state for dirty
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Ensure that if the callback changes, its updated here as well
  const onDirtyRef = useRef(onDirtyChange);
  useEffect(() => {
    onDirtyRef.current = onDirtyChange;
  }, [onDirtyChange]);

  // Normalize my baseline
  const norm = (key: string, raw: FormDataEntryValue | string | null | undefined) => {
    const str = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
    const f = normalize[key];
    return f ? f(str) : str;
  };

  // Stable signature of baseline values
  const baselineKey = useMemo(() => {
    const keys = Object.keys(baseline).sort();
    const normalized: Record<string, string> = {};
    for (const k of keys) normalized[k] = norm(k, baseline[k]);
    return JSON.stringify(normalized);
  }, [baseline, normalize]);

  // Check all of my keys and see if we have changes
  const differsFromBaseline = (fd: FormData) => {
    for (const key of Object.keys(baseline)) {
      if (norm(key, fd.get(key)) !== norm(key, baseline[key])) return true;
    }
    return false;
  };

  // Set dirty on first divergence
  useEffect(() => {
    // Grab the form
    const el = formRef.current;
    if (!el) return;

    // If we're already dirty change nothing, otherwise check if it differs and set dirty
    const onInput = () => {
      if (isDirty) return;
      const fd = new FormData(el);
      if (differsFromBaseline(fd)) {
        setIsDirty(true);
        onDirtyRef.current?.(true);
      }
    };

    // Listen to my form ref, if there's input mark as dirty
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [isDirty, baselineKey]);

  // Reset to clean when baseline VALUES change (server data/loader)
  useEffect(() => {
    if (isDirty) {
      setIsDirty(false);
      onDirtyRef.current?.(false);
    }
  }, [baselineKey]); // ← only when values actually changed

  // Force clean when parent bumps resetKey
  useEffect(() => {
    if (resetKey === undefined) return;
    setIsDirty(prev => {
      if (!prev) return prev;
      onDirtyRef.current?.(false);
      return false;
    });
  }, [resetKey]);

  // Simple function to let the hook know that non text form fields (like lists or images) have changed
  const childDirty = (dirty: boolean) => {
    if (!dirty) return; // We only ever set dirty to true, not false
    setIsDirty(prev => {
      if (prev) return prev;
      onDirtyRef.current?.(true);
      return true;
    });
  };
  return { formRef, isDirty, childDirty };
}

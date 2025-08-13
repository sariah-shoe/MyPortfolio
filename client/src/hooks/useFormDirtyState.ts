import { useEffect, useMemo, useRef, useState } from "react";

type Baseline = Record<string, string | null | undefined>;
type Normalizers = Partial<Record<string, (v: string) => string>>;

type Options = {
  baseline: Baseline;
  onDirtyChange?: (dirty: boolean) => void;
  normalize?: Normalizers;
  resetKey?: number | string;
};

export function useFormDirtyState({
  baseline,
  onDirtyChange,
  normalize = {},
  resetKey,
}: Options) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // keep callback stable
  const onDirtyRef = useRef(onDirtyChange);
  useEffect(() => {
    onDirtyRef.current = onDirtyChange;
  }, [onDirtyChange]);

  const norm = (key: string, raw: FormDataEntryValue | string | null | undefined) => {
    const str = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
    const f = normalize[key];
    return f ? f(str) : str;
  };

  // stable signature of baseline values
  const baselineKey = useMemo(() => {
    const keys = Object.keys(baseline).sort();
    const normalized: Record<string, string> = {};
    for (const k of keys) normalized[k] = norm(k, baseline[k]);
    return JSON.stringify(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseline, normalize]);

  const differsFromBaseline = (fd: FormData) => {
    for (const key of Object.keys(baseline)) {
      if (norm(key, fd.get(key)) !== norm(key, baseline[key])) return true;
    }
    return false;
  };

  // Set dirty on first divergence; never clear here
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const onInput = () => {
      if (isDirty) return;
      const fd = new FormData(el);
      if (differsFromBaseline(fd)) {
        setIsDirty(true);
        onDirtyRef.current?.(true);
      }
    };

    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [isDirty, baselineKey]); // ← no onDirtyChange here

  // Reset to clean when baseline VALUES change (server data/loader)
  useEffect(() => {
    if (isDirty) {
      setIsDirty(false);
      onDirtyRef.current?.(false);
    }
  }, [baselineKey]); // ← only when values actually changed

  // Force clean when parent bumps resetKey (e.g., “saved with no diff”)
  useEffect(() => {
    if (resetKey === undefined) return;
    setIsDirty(prev => {
      if (!prev) return prev;
      onDirtyRef.current?.(false);
      return false;
    });
  }, [resetKey]); // ← no onDirtyChange dep

  const childDirty = (dirty: boolean) => {
    if (!dirty) return; // children never clear
    setIsDirty(prev => {
      if (prev) return prev;
      onDirtyRef.current?.(true);
      return true;
    });
  };

  return { formRef, isDirty, childDirty };
}

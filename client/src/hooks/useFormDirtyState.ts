import { useEffect, useMemo, useRef, useState } from "react";

type Baseline = Record<string, string | null | undefined>;
type Normalizers = Partial<Record<string, (v: string) => string>>;

type Options = {
  baseline: Baseline;
  onDirtyChange?: (dirty: boolean) => void;
  normalize?: Normalizers;
};

export function useFormDirtyState({ baseline, onDirtyChange, normalize = {} }: Options) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const norm = (key: string, raw: FormDataEntryValue | string | null | undefined) => {
    const str = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
    const f = normalize[key];
    return f ? f(str) : str;
  };

  // 🔑 Stable signature of baseline VALUES (order-independent, normalized)
  const baselineKey = useMemo(() => {
    const keys = Object.keys(baseline).sort();
    const normalized: Record<string, string> = {};
    for (const k of keys) normalized[k] = norm(k, baseline[k]);
    return JSON.stringify(normalized);
    // we want to recompute if caller provides a new baseline object OR new normalizers
  }, [baseline, normalize]);

  const differsFromBaseline = (fd: FormData) => {
    for (const key of Object.keys(baseline)) {
      if (norm(key, fd.get(key)) !== norm(key, baseline[key])) return true;
    }
    return false;
  };

  // Set dirty on any input edit; never clear here
  useEffect(() => {
    const handleInput = () => {
      if (!formRef.current || isDirty) return;
      const fd = new FormData(formRef.current);
      if (differsFromBaseline(fd)) {
        setIsDirty(true);
        onDirtyChange?.(true);
      }
    };
    const el = formRef.current;
    el?.addEventListener("input", handleInput);
    return () => el?.removeEventListener("input", handleInput);
    // ✅ depend on baselineKey (not baseline object)
  }, [isDirty, baselineKey, onDirtyChange]);

  // Reset to clean ONLY when baseline VALUES change (after save/loader)
  useEffect(() => {
    if (isDirty) {
      setIsDirty(false);
      onDirtyChange?.(false);
    }
  }, [baselineKey]);

  const childDirty = (dirty: boolean) => {
    if (!dirty) return; // only escalate to true; resets via baseline change
    setIsDirty(prev => {
      if (prev) return prev;
      onDirtyChange?.(true);
      return true;
    });
  };

  return { formRef, isDirty, childDirty };
}

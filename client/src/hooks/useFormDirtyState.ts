import { useEffect, useRef, useState } from "react";

type Baseline = Record<string, string | null | undefined>;
type Normalizers = Partial<Record<string, (v: string) => string>>;

type Options = {
  /** Canonical values from loader; when this object changes, we auto-reset to clean */
  baseline: Baseline;
  /** Called when dirty flips */
  onDirtyChange?: (dirty: boolean) => void;
  /** Optional per-field normalizers (e.g., dates to YYYY-MM-DD) */
  normalize?: Normalizers;
};

/**
 * Form-level dirty tracking for uncontrolled forms.
 * - Flips dirty -> true on any input edit diverging from baseline.
 * - Flips dirty -> false when baseline changes (after save/loader).
 * - Exposes childDirty() so subcomponents (List, FileListEditor) can mark dirty.
 */
export function useFormDirtyState({ baseline, onDirtyChange, normalize = {} }: Options) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const norm = (key: string, raw: FormDataEntryValue | string | null | undefined) => {
    const str = raw == null ? "" : typeof raw === "string" ? raw : String(raw);
    const f = normalize[key];
    return f ? f(str) : str;
  };

  const differsFromBaseline = (fd: FormData) => {
    for (const key of Object.keys(baseline)) {
      const current = norm(key, fd.get(key));
      const base = norm(key, baseline[key]);
      if (current !== base) return true;
    }
    return false;
  };

  // Set dirty on any input change if diverged; never clear here
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
  }, [isDirty, baseline, normalize, onDirtyChange]);

  // Reset to clean when baseline changes (after successful save/loader)
  useEffect(() => {
    if (isDirty) {
      setIsDirty(false);
      onDirtyChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseline]); // only when canonical values object changes

  // For children to mark the form dirty; we don't flip back to false here
  const childDirty = (dirty: boolean) => {
    if (!dirty) return; // we only escalate to true; reset happens via baseline change
    setIsDirty(prev => {
      if (prev) return prev;
      onDirtyChange?.(true);
      return true;
    });
  };

  return { formRef, isDirty, childDirty };
}

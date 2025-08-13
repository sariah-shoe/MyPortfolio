// useUnsavedChangesGuard.ts
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useBlocker } from "react-router";

type GuardOptions = {
  when: boolean;
  names?: string[];
  suppress?: boolean;
  /** If provided, called when user confirms leaving. Caller can navigate & suppress. */
  onConfirm?: () => void;
  /** Alternatively, let the hook redirect on confirm (see Option B) */
  redirectOnConfirm?: string;
  buildMessage?: (names: string[]) => string;
};

export function useUnsavedChangesGuard({
  when,
  names = [],
  suppress = false,
  onConfirm,
  redirectOnConfirm,
  buildMessage,
}: GuardOptions) {
  const navigate = useNavigate();
  const blocker = useBlocker(when);

  // prevents calling proceed() multiple times while suppressed
  const proceededRef = useRef(false);

  useEffect(() => {
    if (blocker.state !== "blocked"){
      proceededRef.current = false; 
      return;
    }

    if (suppress) {
      if (!proceededRef.current){
        proceededRef.current = true;
        blocker.proceed();
      }
      return;
    }

    const list = names.filter(Boolean);
    const defaultMsg =
      list.length > 0
        ? `You have unsaved changes to: ${list.join(", ")}.\nAre you sure you want to leave?`
        : `You have unsaved changes.\nAre you sure you want to leave?`;
    const msg = buildMessage ? buildMessage(list) : defaultMsg;

    const confirmed = window.confirm(msg);

    if (confirmed) {
      if (onConfirm) {
        // Caller will handle suppression + navigation
        blocker.reset();
        onConfirm();
      } else if (redirectOnConfirm) {
        // Fallback: internal redirect (Option B behavior)
        blocker.reset();
        navigate(redirectOnConfirm, { replace: true });
      } else {
        blocker.proceed(); // continue original nav
      }
    } else {
      blocker.reset(); // stay put
    }
  }, [blocker.state, suppress, names, buildMessage, onConfirm, redirectOnConfirm, navigate, blocker]);

  // Hard reload / tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (when && !suppress) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when, suppress]);
}

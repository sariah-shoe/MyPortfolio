import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useBlocker } from "react-router";

// Options for components using the hook
type GuardOptions = {
  when: boolean;
  names?: string[];
  suppress?: boolean;
  // Called when user confirms leaving. Caller can navigate & suppress.
  onConfirm: (proceed: () => void) => void;
};

export function useUnsavedChangesGuard({
  when,
  names = [],
  suppress = false,
  onConfirm,
}: GuardOptions) {
  // Navigate and blocker
  const navigate = useNavigate();
  const blocker = useBlocker(when);

  // Prevents calling proceed() multiple times while suppressed
  const proceededRef = useRef(false);

  // Guard for unsaved changes
  useEffect(() => {
    // If we aren't blocked, we don't need to do anything
    if (blocker.state !== "blocked"){
      proceededRef.current = false; 
      return;
    }

    const proceed = () => blocker.proceed();

    // Supression logic so we can get past guard
    if (suppress) {
      if (!proceededRef.current){
        proceededRef.current = true;
        blocker.proceed();
      }
      return;
    }

    // Make a list of fields with changes
    const list = names.filter(Boolean);

    // Make a message
    const msg =
      list.length > 0
        ? `You have unsaved changes to: ${list.join(", ")}.\nAre you sure you want to leave?`
        : `You have unsaved changes.\nAre you sure you want to leave?`;

    // Show the confirmation dialog and capture the user's response
    const confirmed = window.confirm(msg);

    // If the user confirms they want to leave
    if (confirmed) {
        // blocker.reset();
        onConfirm(proceed);
    } else {
      blocker.reset(); // Otherwise, don't leave
    }
  }, [blocker.state, suppress, names, onConfirm, navigate, blocker]);

  // If there's a hard reload / tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (when && !suppress) {
        e.preventDefault();
      }
    };
    // Listen for a before unload and handle it by showing the supression
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when, suppress]);
}

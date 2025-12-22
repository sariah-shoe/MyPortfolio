import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../apiHandling/authActions";
import { useAuth } from "../Shared/AuthContext";

export default function LogIn() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  // Reset dialog state when opening
  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password );
      setAuth(true);
      setOpen(false);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    const confirmed = window.confirm("Log out of admin?");
    if (!confirmed) return;

    await logout();
    setAuth(false);
    navigate("/");
  }

  return (
    <>
      {auth ? (
        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
        >
          Log out
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-green-600 px-3 py-1 text-sm text-white"
        >
          Admin Login
        </button>
      )}

      <Dialog
        open={open}
        onClose={setOpen}
        initialFocus={emailRef}
        className="relative z-50"
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40"
          aria-hidden="true"
        />

        {/* Centered panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
            <DialogTitle className="text-lg font-semibold">
              Admin Login
            </DialogTitle>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-1 text-sm text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-gray-800 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  {submitting ? "Logging in…" : "Log in"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

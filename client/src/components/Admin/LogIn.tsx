import Popup from "reactjs-popup"
import { useAuth } from "../Shared/AuthContext";
import { useState } from "react";
import { login, logout } from "../../apiHandling/authActions";

export default function LogIn() {
    const { auth, setAuth } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.ok) {
                setAuth(false)
            } else {
                setError("Something went wrong");
            }
        } catch (err: any) {
            setAuth(false);
            setError(err?.message || "Login failed. Please try again.");
        } 
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const result = await login(email, password);
            if (result.ok) {
                setAuth(true);
            } else {
                setAuth(false);
                setError("Invalid email or password.");
            }
        } catch (err: any) {
            setAuth(false);
            setError(err?.message || "Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Popup
                trigger={auth ?
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                    >
                        Log out
                    </button>
                    : <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                    >
                        Log in
                    </button>
                }
                modal
                nested
            >
                {!auth ? (((close: () => void) => (
                    <div className="modal rounded-lg bg-gray-100 p-6">
                        <button className="close inline-block rounded-full border border-red-400 bg-red-400 p-3 text-white hover:bg-transparent hover:text-red-400" onClick={close}>
                            <span className="sr-only"> Close </span>

                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd" />
                            </svg>

                        </button>
                        <div className="header text-2xl font-bold text-gray-900 sm:text-3xl p-2"> Log In </div>
                        <div className="content">
                            {' '}
                            <form
                                onSubmit={handleLogin}
                                className="mx-auto max-w-md space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-900" htmlFor="email">Email</label>

                                    <input
                                        className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        id="email"
                                        type="email"
                                        placeholder="admin@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900" htmlFor="password">Password</label>

                                    <input
                                        className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        id="password"
                                        type="password"
                                        placeholder="SuperSecretPass1"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">{error}</p>
                                )}

                                <button
                                    className="block w-full rounded-lg border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-green-600 disabled:bg-gray-700"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? "Logging in..." : "Log In"}
                                </button>
                            </form>
                        </div>
                    </div>
                )
                ) as unknown as React.ReactNode)
                    : (((close: () => void) => {
                        return (
                            <div className="modal rounded-lg bg-gray-100 p-6">
                                <button className="close inline-block rounded-full border border-red-400 bg-red-400 p-3 text-white hover:bg-transparent hover:text-red-400" onClick={close}>
                                    <span className="sr-only"> Close </span>

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd" />
                                    </svg>

                                </button>
                                <div className="header text-2xl font-bold text-gray-900 sm:text-3xl p-2"> Log Out </div>
                                <div className="content">
                                    {' '}
                                    <p className="p-2">Do you want to log out?</p>
                                    <button className="block w-full rounded-lg border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-red-600" type="button" onClick={handleLogout}>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )
                    }) as unknown as React.ReactNode)}
            </Popup>
        </>
    )
}
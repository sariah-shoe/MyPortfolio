import { Form } from "react-router-dom"
import Popup from "reactjs-popup"
import { useAuth } from "../Shared/AuthContext";

export default function LogIn() {
    const { auth, setAuth } = useAuth();
    
    const handleLogin = () => {
        setAuth(true);
    }

    const handleLogout = () => {
        setAuth(false);
    }

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
                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd" />
                            </svg>

                        </button>
                        <div className="header text-2xl font-bold text-gray-900 sm:text-3xl p-2"> Log In </div>
                        <div className="content">
                            {' '}
                            <Form action="#" className="mx-auto max-w-md space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900" htmlFor="email">Email</label>

                                    <input className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none" id="email" type="email" placeholder="admin@email.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900" htmlFor="password">Password</label>

                                    <input className="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none" id="password" type="password" placeholder="SuperSecretPass1" />
                                </div>

                                <button className="block w-full rounded-lg border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-green-600" type="submit" onClick={handleLogin}>
                                    Log In
                                </button>
                            </Form>
                        </div>
                    </div>
                )) as unknown as React.ReactNode)
                    : (((close: () => void) => (
                        <div className="modal rounded-lg bg-gray-100 p-6">
                            <button className="close inline-block rounded-full border border-red-400 bg-red-400 p-3 text-white hover:bg-transparent hover:text-red-400" onClick={close}>
                                <span className="sr-only"> Close </span>

                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd" />
                                </svg>

                            </button>
                            <div className="header text-2xl font-bold text-gray-900 sm:text-3xl p-2"> Log Out </div>
                            <div className="content">
                                {' '}
                                <p className="p-2">Do you want to log out?</p>
                                <button className="block w-full rounded-lg border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-red-600" type="submit" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )) as unknown as React.ReactNode)}
            </Popup>
        </>
    )
}
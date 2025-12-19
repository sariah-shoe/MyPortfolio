import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom"
import LogIn from "./LogIn"

export default function Admin() {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate("/");
    };

    return (
        <>
            {/* Banner to display on all the admin pages */}
            <header className="bg-gray-100 flex items-center flex-col p-4 mb-2">
                {/* Title of admin pages */}
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl m-2">Portfolio Admin</h1>
                {/* Options to login/logout and exit admin */}
                <div className="flex gap-4">
                    <LogIn />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:border-gray-200 disabled:bg-gray-500"
                        onClick={handleReturnHome}
                    >
                        Return to Home Page
                    </button>
                </div>
            </header>
            {/* Outlet for all my admin pages */}
            <main>
                <Outlet />
            </main>
        </>
    )
}
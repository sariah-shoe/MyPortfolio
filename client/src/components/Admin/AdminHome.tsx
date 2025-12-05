import { Link } from "react-router-dom"
export default function AdminHome() {

    return (
        // Simple navigation to each of the admin pages
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                <Link to={"/admin/about"} className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl">About Me</Link>
                <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
                <Link to={"/admin/experiences"} className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl">Experiences</Link>
                <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
                <Link to={"/admin/projects"} className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl">Projects</Link>
            </div>
        </div>
    )
}
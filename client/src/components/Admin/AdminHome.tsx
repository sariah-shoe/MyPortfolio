import { Link } from "react-router-dom"

export default function AdminHome() {
    return (
        <div className="flex flex-col items-center">
            <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Admin Page
            </h2>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
                This is where I make updates to my portfolio
            </p>
            <div className="flex flex-col items-center block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                <Link to={"/admin/about"} className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">About Me</Link>
                <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
                <Link to={"/admin/experiences"} className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">Experiences</Link>
                <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
                <Link to={"/admin/projects"} className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">Projects</Link>
            </div>
        </div>
    )
}
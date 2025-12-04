import { Outlet } from "react-router-dom"
import LogIn from "./LogIn"

export default function Admin(){
    return(
        <>
            <div className="bg-gray-100 flex items-center flex-col p-4 mb-2">
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl m-2">Admin for Sariah Shoemaker's Portfolio</h1>
                <LogIn />
            </div>
            <Outlet/>
        </>
    )
}
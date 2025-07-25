import { Link } from "react-router-dom"

export default function ProjectChange(){
    return(
        <div>
            <h2>Projects</h2>
            <Link to={"/admin"}>Back to Admin</Link>
        </div>
    )
}
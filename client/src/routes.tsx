import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root/root.tsx";
import Contact from "./components/ContactMe/contact.tsx";
import Experiences from "./components/Experiences/experiences.tsx";
import ExperiencePage from "./components/Experiences/experiencePage.tsx";
import Projects from "./components/Projects/projects.tsx";
import ProjectPage from "./components/Projects/projectPage.tsx";
import Resume from "./components/Resume/resume.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/experiences",
        element: <Experiences />
    },
    {
        path: "/experiences/:id",
        element: <ExperiencePage />
    },
    {
        path: "/projects",
        element: <Projects />
    },
    {
        path: "/projects/:id",
        element: <ProjectPage />
    },
    {
        path: "/resume",
        element: <Resume />
    }
]);

export default router;
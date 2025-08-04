import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root/root.tsx";
import Contact from "./components/ContactMe/contact.tsx";
import Experiences from "./components/Experiences/experiences.tsx";
import ExperiencePage from "./components/Experiences/experiencePage.tsx";
import Projects from "./components/Projects/projects.tsx";
import ProjectPage from "./components/Projects/projectPage.tsx";
import Resume from "./components/Resume/resume.tsx";
import Admin from "./components/Admin/Admin.tsx";
import AboutChange from "./components/Admin/AboutChange.tsx";
import ProjectCards from "./components/Admin/ProjectCards.tsx";
import ExperienceCards from "./components/Admin/ExperienceCards.tsx";
import * as aboutMeActions from "./loaders/aboutMe-loader.ts";
import * as experienceActions from "./loaders/experiences-loader.ts";
import * as projectActions from "./loaders/project-loader.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        loader: aboutMeActions.load_all
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/experiences",
        element: <Experiences />,
        loader: experienceActions.load_all
    },
    {
        path: "/experiences/:id",
        element: <ExperiencePage />,
        loader: experienceActions.load_one
    },
    {
        path: "/projects",
        element: <Projects />,
        loader: projectActions.load_all
    },
    {
        path: "/projects/:id",
        element: <ProjectPage />,
        loader: projectActions.load_one
    },
    {
        path: "/resume",
        element: <Resume />,
        loader: aboutMeActions.load_all
    },
    {
        path: "/admin",
        element: <Admin />
    },
    {
        path: "/admin/about",
        element: <AboutChange />
    },
    {
        path: "/admin/experiences",
        element: <ExperienceCards />
    },
    {
        path: "/admin/projects",
        element: <ProjectCards />
    }
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root/root.tsx";
import AboutMe from "./components/AboutMe/AboutMe.tsx";
import Contact from "./components/ContactMe/contact.tsx";
import Experiences from "./components/Experiences/experiences.tsx";
import ExperiencePage from "./components/Experiences/experiencePage.tsx";
import Projects from "./components/Projects/projects.tsx";
import ProjectPage from "./components/Projects/projectPage.tsx";
import Resume from "./components/Resume/resume.tsx";
import Admin from "./components/Admin/Admin.tsx";
import AdminHome from "./components/Admin/AdminHome.tsx";
import AboutChange from "./components/Admin/AboutChange.tsx";
import ProjectCards from "./components/Admin/ProjectCards.tsx";
import ExperienceCards from "./components/Admin/ExperienceCards.tsx";
import PublicErrorPage from "./components/Errors/PublicErrorPage.tsx";
import AdminErrorPage from "./components/Errors/AdminErrorPage.tsx";
import * as aboutMeActions from "./apiHandling/aboutMeActions.ts";
import * as experienceActions from "./apiHandling/experiencesActions.ts";
import * as projectActions from "./apiHandling/projectsActions.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        loader: aboutMeActions.load_all,
        errorElement: <PublicErrorPage />,
        children: [
            { index: true, element: <AboutMe />, loader: aboutMeActions.load_all },
            { path: "contact", element: <Contact /> },
            { path: "experiences", element: <Experiences />, loader: experienceActions.load_all },
            { path: "experiences/:id", element: <ExperiencePage />, loader: experienceActions.load_one },
            { path: "projects", element: <Projects />, loader: projectActions.load_all },
            { path: "projects/:id", element: <ProjectPage />, loader: projectActions.load_one },
            { path: "resume", element: <Resume />, loader: aboutMeActions.load_all },
            // Public 404 for any unknown public route
            { path: "*", element: <PublicErrorPage /> },
        ]
    },
    {
        path: "/admin",
        element: <Admin />,
        errorElement: <AdminErrorPage />,
        children: [
            { index: true, element: <AdminHome /> },
            { path: "about", element: <AboutChange />, loader: aboutMeActions.load_all, action: aboutMeActions.update },
            {
                path: "experiences", element: <ExperienceCards />, loader: experienceActions.load_all, action: experienceActions.create, children: [{
                    path: ":id",
                    action: experienceActions.modify,
                }]
            },
            {
                path: "projects", element: <ProjectCards />, loader: projectActions.load_all, action: projectActions.create, children: [{
                    path: ":id",
                    action: projectActions.modify,
                }]
            },
            { path: "*", element: <AdminErrorPage />}
        ]
    },

    // Absolute catch-all
    { path: "*", element: <PublicErrorPage />}
]);

export default router;
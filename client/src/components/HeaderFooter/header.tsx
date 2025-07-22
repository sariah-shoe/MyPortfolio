// Used the icon on the left, links in the middle and call to actions on the right template from https://www.hyperui.dev/components/marketing/headers

import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavDropdown from './navDropdown';

export default function Header() {
    // State management of the hamburger menu opening and closing
    const [hamburger, setHamburger] = useState(false);

    return (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-center">
                    {/* My nav links */}
                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" to={'/'}> Home </Link>
                                </li>

                                {/* The experiences nav link has a drop down with professional and personal */}
                                <NavDropdown
                                    label='Experiences'
                                    defaultHref='/experiences'
                                    items={[
                                        { name: "Professional", href: "/experiences?type=professional" },
                                        { name: "Personal", href: "/experiences?type=personal" }
                                    ]}
                                />

                                {/* As does the projects nav link */}
                                <NavDropdown
                                    label='Projects'
                                    defaultHref='/projects'
                                    items={[
                                        { name: "Professional", href: "/projects" },
                                        { name: "Personal", href: "/projects" }
                                    ]}
                                />

                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" to={'/resume'}> Resume </Link>
                                </li>

                                <li>
                                    <Link className="text-gray-500 transition hover:text-gray-500/75" to={'/contact'}> Contact Me </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* My hidden hamburger button for mobile */}
                    <div className="flex items-center gap-4">
                        <div className="block md:hidden">
                            <button
                                className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                                onClick={() => setHamburger(!hamburger)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* My hidden hamburger menu for mobile */}
                {hamburger && (
                    <nav className="md:hidden mt-2" aria-label="Mobile">
                        <ul className="space-y-2 text-sm">
                            <li><Link className="block text-gray-700 px-4 py-2 hover:bg-gray-100" to="/">Home</Link></li>
                            <li><Link className="block text-gray-700 px-4 py-2 hover:bg-gray-100" to="/experiences">Experiences</Link></li>
                            <li><Link className="block text-gray-700 px-4 py-2 hover:bg-gray-100" to="/projects">Projects</Link></li>
                            <li><Link className="block text-gray-700 px-4 py-2 hover:bg-gray-100" to="/resume">Resume</Link></li>
                            <li><Link className="block text-gray-700 px-4 py-2 hover:bg-gray-100" to="/contact">Contact Me</Link></li>
                        </ul>
                    </nav>
                )}

            </div>
        </header>
    );
}
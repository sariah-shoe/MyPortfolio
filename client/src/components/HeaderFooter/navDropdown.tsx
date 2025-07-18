import { useState, useRef } from "react";
import { Link } from 'react-router-dom';

// Interface for a NavItem in the dropdown
interface NavItem {
    name: string;
    href: string;
}

// Properties that will passed into my NavDropdown
interface NavDropdownProps {
    label: string;
    defaultHref: string;
    items: NavItem[];
}

export default function NavDropdown({ label, defaultHref, items} : NavDropdownProps){
    // My state and ref variables to manage whether or not the popup is open and how long it will be open
    const [ isOpen, setIsOpen ] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    // Handle hover or focus
    const handleOpen = () => {
        // If a timeout is already going, cancel that one, then open the dropdown
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    }

    // Handle mouse leave or blur with a delay
    const handleClose = () => {
        // Set a timeout to 150 milliseconds so the pop up closes after a delay and not immediately
        timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    }

    // The nav link and dropdown itself are returned
    return (
    <li
      className="relative"
    //   When the mouse or keyboard is in or out of this area, open and close accordingly
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      <Link
        to={defaultHref}
        className="block text-gray-500 transition hover:text-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : "false"}
      >
        {label}
      </Link>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg z-50"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <ul className="py-1 text-sm text-gray-700">
            {items.map((item) => 
            <li>
                <Link to={item.href} className="block px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">{item.name}</Link>
            </li>
            )}
          </ul>
        </div>
      )}
    </li>
  );
};
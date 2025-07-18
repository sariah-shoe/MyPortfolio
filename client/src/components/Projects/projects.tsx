import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import ProffToggle from '../Shared/ProffToggle';
import { useState } from 'react';

export default function Projects() {
    // State for whether I am showing personal or professional experiences
    const [proff, setProff] = useState(false);

    return (
        <div>
            <Header />
            <h1>{proff ? "Personal" : "Professional"} Projects</h1>
            <ProffToggle
                value={proff}
                onChange={setProff}
            />
            <Footer />
        </div>
    );
}
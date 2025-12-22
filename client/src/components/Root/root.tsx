import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import { Outlet } from 'react-router-dom';

export default function Root() {
    // Root layout shared across all public routes
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
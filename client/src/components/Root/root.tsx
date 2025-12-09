import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import { Outlet } from 'react-router-dom';

export default function Root() {

    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}
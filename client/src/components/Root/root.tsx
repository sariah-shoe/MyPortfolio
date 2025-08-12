import Header from '../HeaderFooter/header';
import Footer from '../HeaderFooter/footer';
import { Outlet } from 'react-router-dom';

export default function Root() {
    
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
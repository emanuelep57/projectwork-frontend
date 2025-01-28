import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import CinemaHomepage from '@/pages/Homepage.tsx';
import Dettagli from "@/pages/Dettagli.tsx";
import Prenota from "@/pages/Prenota.tsx";
import { ProviderAutenticazione } from '@/context/AuthContext';
import UserTicketPage from "@/pages/Utente.tsx";

const App = () => {
    return (
        <ProviderAutenticazione>
            <Router>
                <Routes>
                    <Route
                    path="/my-tickets"
                    element={
                        <UserTicketPage />
                    }
                    />
                    <Route path="/select-seats" element={<Prenota/>}/>
                    <Route path="/" element={<CinemaHomepage/>}/>
                    <Route path="/movie/:id" element={<Dettagli/>}/>
                </Routes>
            </Router>
        </ProviderAutenticazione>
    );
};

export default App;
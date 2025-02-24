import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { useSeats } from '../hooks/usePosti.ts';
import { GrigliaPosti } from '../components/posto/GrigliaPosti';
import { Riepilogo } from '@/components/acquisto/Riepilogo.tsx';
import { MovieInfo } from '@/components/acquisto/InfoAcquisto.tsx';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {ShoppingCart} from 'lucide-react';
import Header from "@/components/layout/Header/Header.tsx";
import AuthModal from "@/components/autenticazione/ModalAutenticazione.tsx";
import Checkout from "@/components/acquisto/Checkout.tsx";
import LegendaPosti from "@/components/posto/LegendaPosti.tsx";

// Pagina che gestisce la selezione dei posti, l'autenticazione e il processo di checkout
const Prenota = () => {
    const { autenticato } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Destrutturazione dei dati della proiezione passati tramite state
    const state = location.state as {
        titoloFilm: string;
        data_ora: string;
        filmId: string;
        proiezioneId: number;
        costo: number;
        sala: string;
    };

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isProcessing] = useState(false);

    // Stato per memorizzare i dettagli degli ospiti per i posti selezionati
    const [guestDetails, setGuestDetails] = useState<{[key: string]: {nome: string, cognome: string}}>({});

    // Hook personalizzato per la gestione dei posti
    const {
        postiOccupati,
        postiSelezionati,
        caricamento,
        errore,
        gestisciSelezionePosto
    } = useSeats(state?.proiezioneId);

    // Configurazione del layout della sala
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 12;


    // Verifica l'autenticazione dell'utente prima di procedere al checkout
    const handleCheckoutClick = (details?: {[key: string]: {nome: string, cognome: string}}) => {
        if (!autenticato) {
            setShowLoginModal(true);
            return;
        }

        if (details) {
            setGuestDetails(details);
        }

        setShowCheckout(true);
    };

    // Gestione degli stati di caricamento ed errore
    if (caricamento) return <Skeleton className="h-screen w-full" />;
    if (errore) return <div className="text-destructive p-4">{errore}</div>;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Contenitore principale con layout responsive */}
            <div className="flex-1 flex flex-col">
                <Header/>

                {/* Informazioni della proiezione */}
                <MovieInfo
                    titolo={state?.titoloFilm}
                    sala={state?.sala}
                    data_ora={state?.data_ora}
                />

                <div className="flex-1 flex flex-col">
                    {/* Visualizzazione della sala con lo schermo */}
                    <div className="w-full max-w-3xl mx-auto px-4 py-8">
                        {/* Realizzazione del "componente" che rappresenta lo schermo */}
                        <div className="relative mb-12">
                            <div className="w-full h-1 bg-foreground rounded-full shadow-[0_0_15px_rgba(var(--foreground),0.5)]"/>
                            <div className="w-full h-12 bg-gradient-to-b from-foreground/10 to-transparent"/>
                            <p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground uppercase">
                                Schermo
                            </p>
                        </div>

                        {/* Griglia dei posti */}
                        <GrigliaPosti
                            file={rows}
                            postiPerFila={seatsPerRow}
                            postiOccupati={postiOccupati}
                            postiSelezionati={postiSelezionati}
                            onPostoClick={gestisciSelezionePosto}
                        />

                        <LegendaPosti />
                    </div>

                    {/* Barra mobile per il checkoutt */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    className="w-full"
                                    disabled={postiSelezionati.length === 0 || isProcessing}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2"/>
                                    {isProcessing ? 'Processando...' : `Checkout (${postiSelezionati.length} Posti)`}
                                </Button>
                            </SheetTrigger>

                            {/* Sheet con riepilogo per vista mobile */}
                            <SheetContent
                                side="bottom"
                                className="h-[80vh] bg-background border-t border-border rounded-t-xl"
                            >
                                <div className="h-full overflow-y-auto p-6">
                                    <Riepilogo
                                        vistaMobile={true}
                                        postiSelezionati={postiSelezionati}
                                        onIndietro={() => setIsSheetOpen(false)}
                                        onConferma={handleCheckoutClick}
                                        isProcessing={isProcessing}
                                        costo={state.costo}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Sidebar di riepilogo (su desktop) */}
            <div className="hidden lg:block w-96 bg-background border-l border-border">
                <div className="p-6">
                    <Riepilogo
                        postiSelezionati={postiSelezionati}
                        onIndietro={() => navigate(-1)}
                        onConferma={handleCheckoutClick}
                        isProcessing={isProcessing}
                        costo={state.costo}
                    />
                </div>
            </div>

            {/* Modal per autenticazione per andare al checkout*/}
            <AuthModal
                aperto={showLoginModal}
                onCambioStato={setShowLoginModal}
                onSuccess={() => {
                    setShowLoginModal(false);
                    setShowCheckout(true);
                }}
            />

            <Checkout
                aperto={showCheckout}
                onStatoChange={setShowCheckout}
                postiSelezionati={postiSelezionati}
                idProiezione={state?.proiezioneId}
                dettagliOspite={guestDetails}
                onSuccess={() => navigate('/')}
                costo={state.costo}
            />
        </div>
    );
};

export default Prenota;
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
import {ChevronLeft, ShoppingCart} from 'lucide-react';
import { Logo, UserSection } from "@/components/layout/Header.tsx";
import AuthModal from "@/components/autenticazione/ModalAutenticazione.tsx";
import Checkout from "@/components/acquisto/Checkout.tsx";
import LegendaPosti from "@/components/posto/LegendaPosti.tsx";

const Prenota = () => {
    const { autenticato } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as {
        movieTitle: string;
        showtime: string;
        movieId: string;
        projectionId: number;
        sala: string;
        costo : number;
    };

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isProcessing] = useState(false);
    const [guestDetails, setGuestDetails] = useState<{[key: string]: {nome: string, cognome: string}}>({});

    const {
        postiOccupati,
        postiSelezionati,
        caricamento,
        errore,
        gestisciSelezionePosto
    } = useSeats(state?.projectionId);

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 12;

    //quando l'utente vuole aprire lo sheet del checkout deve essere autenticato, altrimenti si apre il modal che chiede di fare il login
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

    if (caricamento) return <Skeleton className="h-screen w-full" />;
    if (errore) return <div className="text-destructive p-4">{errore}</div>;

    return (
        <div className="min-h-screen bg-background flex">
            <div className="flex-1 flex flex-col">
                <header className="w-full bg-background border-b border-border py-4 px-6">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="hover:text-primary"
                        >
                            <ChevronLeft className="h-6 w-6"/>
                        </Button>
                        <Logo/>
                        <UserSection isMobile={false}/>
                    </div>
                </header>

                <MovieInfo
                    title={state?.movieTitle}
                    sala={state?.sala}
                    showtime={state?.showtime}
                />

                <div className="flex-1 flex flex-col">
                    <div className="w-full max-w-3xl mx-auto px-4 py-8">
                        <div className="relative mb-12">
                            <div className="w-full h-1 bg-foreground rounded-full shadow-[0_0_15px_rgba(var(--foreground),0.5)]"/>
                            <div className="w-full h-12 bg-gradient-to-b from-foreground/10 to-transparent"/>
                            <p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground uppercase">
                                Screen
                            </p>
                        </div>

                        <GrigliaPosti
                            file={rows}
                            postiPerFila={seatsPerRow}
                            postiOccupati={postiOccupati}
                            postiSelezionati={postiSelezionati}
                            onPostoClick={gestisciSelezionePosto}
                        />

                        <LegendaPosti />
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    className="w-full"
                                    disabled={postiSelezionati.length === 0 || isProcessing}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2"/>
                                    {isProcessing ? 'Processing...' : `Checkout (${postiSelezionati.length} seats)`}
                                </Button>
                            </SheetTrigger>
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

            <div className="hidden lg:block w-96 bg-background border-l border-border">
                <div className="p-6">
                    <Riepilogo
                        postiSelezionati={postiSelezionati}  // Changed from selectedSeats
                        onIndietro={() => navigate(-1)}   // Changed from onBack
                        onConferma={handleCheckoutClick}  // Changed from onCheckout
                        isProcessing={isProcessing}
                        costo={state.costo}
                    />
                </div>
            </div>

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
                idProiezione={state?.projectionId}
                dettagliOspite={guestDetails}
                onSuccess={() => navigate('/')}
                costo={state.costo}
            />
        </div>
    );
};

export default Prenota;
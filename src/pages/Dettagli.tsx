import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useDettagli} from '@/hooks/useDettagli.ts';
import {Skeleton} from "@/components/ui/skeleton";
import Header from "@/components/layout/Header/Header.tsx";
import {Hero} from '@/components/film/DettagliFilm/HeroDettagli.tsx';
import {Sinossi} from "@/components/film/DettagliFilm/Sinossi";
import {SidebarMobile} from '@/components/film/DettagliFilm/SidebarMobile';
import {Sidebar} from '@/components/film/DettagliFilm/Sidebar.tsx';
import {Proiezione} from '@/types/proiezione';
import {format, parseISO} from 'date-fns';
import {it} from 'date-fns/locale';

// Pagina dove si vedono tutti i dettagli sul film e si possono vedere i vari orari nei diversi giorni
const Dettagli = () => {
    const {id} = useParams<{ id: string }>(); // Prendo l'id del film dai parametri della pagina
    const navigate = useNavigate();
    const [sheetOpen, setSheetOpen] = useState(false); // Stato per gestire l'apertura dello sheet mobile

    // Uso il custom hook per ottenere i dettagli del film
    const {
        film,
        caricamento,
        errore,
        dataSelezionata,
        setDataSelezionata,
        getProiezioniPerData,
        dateDisponibili
    } = useDettagli(Number(id!)); // Conversione dell'id da stringa a numero

    // Funzione chiamata quando un utente seleziona un orario di proiezione che porta alla pagina di selezione dei posti
    const handleShowtimeSelect = (proiezione: Proiezione) => {
        navigate('/select-seats', {
            state: {
                titoloFilm: film?.titolo,
                data_ora: format(parseISO(proiezione.data_ora), 'PPpp', {locale: it}),
                filmId: id,
                proiezioneId: proiezione.id,
                costo: proiezione.costo,
                sala: proiezione.sala
            }
        });
    };

    // Mostra un caricamento se sto facendo il fetch
    if (caricamento) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <Skeleton className="w-full h-[400px] bg-secondary"/>
            </div>
        );
    }

    // Mostra un messaggio di errore se non ci sono film o si verifica un altro errore
    if (errore || !film) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <div className="container mx-auto px-4 py-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Errore nel caricamento</h2>
                    <p className="text-muted-foreground">{errore}</p>
                </div>
            </div>
        );
    }

    // orari delle proiezioni per la data selezionata
    const proiezioni = dataSelezionata ? getProiezioniPerData(dataSelezionata) : [];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Intestazione della pagina */}
            <Header/>

            <div className="flex-1 flex">
                {/* Contenuto principale */}
                <div className="flex-1 overflow-y-auto">
                    {/* immagine del film */}
                    <Hero
                        film={film}
                        onAcquista={() => setSheetOpen(true)} // Mostra il foglio mobile per l'acquisto dei biglietti
                    />
                    {/* descrizione del film */}
                    <Sinossi descrizione={film.descrizione || ''}/>
                </div>

                {/* Barra laterale con le date e gli orari delle proiezioni */}
                <Sidebar
                    dateDisponibili={dateDisponibili}
                    dataSelezionata={dataSelezionata}
                    proiezioni={proiezioni}
                    onSelezionaData={setDataSelezionata}
                    onSelezionaOrario={handleShowtimeSelect}
                />
            </div>

            {/*la sidebar mobile in realtà non è al lato ma sotto, ma l'ho chiamata così per convenzione*/}
            <SidebarMobile
                aperto={sheetOpen}
                onCambiaStatoAperto={setSheetOpen}
                dateDisponibili={dateDisponibili}
                dataSelezionata={dataSelezionata}
                proiezioni={proiezioni}
                onSelezionaData={setDataSelezionata}
                onSelezionaOrario={handleShowtimeSelect}
            />
        </div>
    );
};

export default Dettagli;

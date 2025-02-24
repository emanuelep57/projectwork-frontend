import React from 'react';
import {format, parseISO} from 'date-fns';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Clock, CalendarDays, Users, MoreVertical, Trash2} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {it} from 'date-fns/locale';
import {useAuth} from "@/context/AuthContext";
import {BigliettoOrdine} from "@/types/ordine";
import {PostoUtente} from "@/types/posto";

interface Proiezione {
    data_ora: string;
    film_titolo: string;
}

interface Ordine {
    id: number;
    data_acquisto: string;
    proiezione: Proiezione;
    biglietti: BigliettoOrdine[];
    pdf_url?: string;
}

// Componente che gestisce la visualizzazione delle informazioni
// dell'ordine e fornisce funzionalità di modifica per gli ordini futuri
export interface SchedaOrdineProps {
    ordine: Ordine;
    isOrdineFuturo: boolean;
    onModificaPosti: (ordine: Ordine) => void;
    onModificaOrdine: (ordine: Ordine) => void;
    onEliminaOrdine: (id: number) => void;
}

export const SchedaOrdine = ({
                                 ordine,
                                 isOrdineFuturo,
                                 onModificaPosti,
                                 onModificaOrdine,
                                 onEliminaOrdine
                             }: SchedaOrdineProps) => {

    const [dialogoEliminaAperto, setDialogoEliminaAperto] = React.useState(false);
    const {utente} = useAuth();

    // Formattazione delle date usando il locale italiano
    const dataSpettacolo = format(parseISO(ordine.proiezione.data_ora), 'EEEE d MMMM yyyy', {locale: it});
    const oraSpettacolo = format(parseISO(ordine.proiezione.data_ora), 'HH:mm');
    const dataAcquisto = format(parseISO(ordine.data_acquisto), 'd MMMM yyyy', {locale: it});

    // Calcolo del numero totale dei posti prenotati nell'ordine
    const numeroTotalePosti = ordine.biglietti.reduce((acc, biglietto) => acc + biglietto.posti.length, 0);

    //Siccome il titolare non ha un nome nome_ospite associato, lo riconosco da quello
    // e posso scrivere Titolare: invece che Ospite:
    const postoTitolare = ordine.biglietti[0]?.posti.find(
        (posto): posto is PostoUtente => 'nome_ospite' in posto && posto.nome_ospite === null
    );

    return (
        // Card principale che contiene tutti i dettagli dell'ordine
        // Aggiunge un'ombra al passaggio del mouse
        <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                {/* Layout principale con header e contenuto */}
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        {/* Sezione titolo film e dettagli temporali */}
                        <div>
                            <h3 className="text-2xl font-bold">{ordine.proiezione.film_titolo}</h3>
                            {/* Visualizzazione data e ora dello spettacolo con icone */}
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <CalendarDays className="h-4 w-4"/>
                                <span className="capitalize">{dataSpettacolo}</span>
                                <Clock className="h-4 w-4 ml-2"/>
                                <span>{oraSpettacolo}</span>
                            </div>
                        </div>

                        {/* Sezione info sull'ordine : numero dei posti, data acquisto e link PDF */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground"/>
                                <span>{numeroTotalePosti} {numeroTotalePosti === 1 ? 'posto' : 'posti'}</span>
                            </div>
                            <Badge variant="secondary">
                                Acquistato il {dataAcquisto}
                            </Badge>
                            {/* Link condizionale per il download del PDF */}
                            {ordine.pdf_url && (
                                <a
                                    href={ordine.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Scarica PDF
                                </a>
                            )}
                        </div>

                        {/* Sezione dettaglio posti*/}
                        <div className="space-y-2">
                            <h4 className="font-medium">Dettaglio posti:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* Visualizzazione posto del titolare se presente */}
                                {postoTitolare && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground font-medium">
                                            Titolare:
                                        </span>
                                        <span>
                                            {utente
                                                ? `${utente.nome} ${utente.cognome}`
                                                : 'Non specificato'}
                                        </span>
                                        <span className="text-muted-foreground">
                                            (Posto {postoTitolare.fila}{postoTitolare.numero})
                                        </span>
                                    </div>
                                )}

                                {/* Mappatura e visualizzazione dei posti degli ospiti */}
                                {ordine.biglietti.map((biglietto) => (
                                    biglietto.posti
                                        .filter((posto): posto is PostoUtente => 'nome_ospite' in posto && posto.nome_ospite !== null)
                                        .map((posto) => (
                                            <div key={`${biglietto.id_biglietto}-${posto.id}`}
                                                 className="flex items-center gap-2">
                                                <span className="text-muted-foreground">
                                                    Ospite:
                                                </span>
                                                <span>
                                                    {posto.nome_ospite && posto.cognome_ospite
                                                        ? `${posto.nome_ospite} ${posto.cognome_ospite}`
                                                        : 'Non specificato'}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    (Posto {posto.fila}{posto.numero})
                                                </span>
                                            </div>
                                        ))
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Menu a tendina per le azioni di modifica*/}
                    {isOrdineFuturo && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-background border rounded-md shadow-md">
                                <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={() => onModificaPosti(ordine)}>
                                    Modifica posti
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onModificaOrdine(ordine)}>
                                    Cambia orario spettacolo
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDialogoEliminaAperto(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2"/>
                                    Elimina prenotazione
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardContent>

            {/* Dialog modale di conferma per l'eliminazione dell'ordine */}
            {dialogoEliminaAperto && (
                <dialog
                    open
                    className="fixed inset-0 z-50 bg-transparent"
                    onClick={() => setDialogoEliminaAperto(false)}
                >
                    <div
                        className="fixed inset-0 bg-black/50"
                        aria-hidden="true"
                    />
                    <div
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white p-6 rounded-lg max-w-md shadow-xl border-2 border-gray-600"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Conferma eliminazione</h2>
                        <p className="mb-6 text-gray-300">
                            Sei sicuro di voler eliminare questa prenotazione?
                            L'azione non può essere annullata e verrà emesso un rimborso.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
                                onClick={() => setDialogoEliminaAperto(false)}
                            >
                                Annulla
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                onClick={() => {
                                    onEliminaOrdine(ordine.id);
                                    setDialogoEliminaAperto(false);
                                }}
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </Card>
    );
};
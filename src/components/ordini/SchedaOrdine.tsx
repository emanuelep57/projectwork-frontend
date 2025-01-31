import {format, parseISO} from 'date-fns';
import {Download, Edit, Grid, Trash2} from 'lucide-react';
import {SchedaOrdineProps} from '@/types/ordine';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {bigliettoAPI} from '@/services/biglietti';
import {toast} from '@/hooks/use-toast';
/*
 card che mostra gli ordini effettuati e permette di
 - Scaricare il PDF del biglietto
 - Modificare i posti selezionati
 - Modificare la data della prenotazione
 - Eliminare l'ordine
 */

export const SchedaOrdine
    = ({
           ordine,
           isOrdineFuturo,
           onModificaPosti,
           onModificaOrdine,
           onEliminaOrdine
       } : SchedaOrdineProps) => {

    console.log(ordine.biglietti)

    // Gestisce il download del PDF del biglietto
    const gestisciDownloadPdf = async (urlPdf?: string) => {
        if (!urlPdf) {
            toast({
                title: "Errore",
                description: "PDF non disponibile",
                variant: "destructive"
            });
            return;
        }

        try {
            await bigliettoAPI.downloadPdf(urlPdf);
        } catch (error) {
            console.log("test errore" + error)
            toast({
                title: "Errore",
                description: "Download del PDF fallito",
                variant: "destructive"
            });
        }
    };

    const dataSpettacolo = parseISO(ordine.proiezione.data_ora);

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{ordine.proiezione.film_titolo}</CardTitle>
                <div className="flex space-x-2">
                    {/* Pulsante download PDF se disponibile */}
                    {ordine.pdf_url && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => gestisciDownloadPdf(ordine.pdf_url)}
                        >
                            <Download className="h-4 w-4"/>
                        </Button>
                    )}
                    {/* Pulsanti di modifica mostrati solo per ordini futuri */}
                    {isOrdineFuturo && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onModificaPosti(ordine)}
                            >
                                <Grid className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onModificaOrdine(ordine)}
                            >
                                <Edit className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => onEliminaOrdine(ordine.id)}
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <p><strong>Data Acquisto:</strong> {format(parseISO(ordine.data_acquisto), 'dd MMMM yyyy HH:mm')}
                    </p>
                    <p><strong>Data Spettacolo:</strong> {format(dataSpettacolo, 'dd MMMM yyyy HH:mm')}</p>
                    <p><strong>Posti:</strong> {
                        ordine.biglietti
                            .flatMap(b => b.posti.map(p => `${p.fila}${p.numero}`)) // Esempio: "E2"
                            .join(', ')
                    }</p>

                    <p><strong>Totale:</strong> € {(ordine.proiezione.costo * ordine.biglietti.length).toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
    );
};
import {ModalSelezionePostiProps } from '@/types/ordine';
import {PostoSelezionato} from '@/types/posto';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {GrigliaPosti} from '@/components/posto/GrigliaPosti';
import {LegendaPosti} from '@/components/posto/LegendaPosti';


//praticamente riutilizzo la griglia dei posti mettendola in un modal, calcolando le dimensioni per farla rientrare
//e dal modal l'utente può cambiare i propri posti.
export const ModalSelezionePosti = ({
                                          isAperto,
                                          onChiudi,
                                          ordineSelezionato,
                                          postiDisponibili,
                                          postiOccupati,
                                          postiSelezionati,
                                          errore,
                                          onTogglePosto,
                                          onConferma,
                                          isCambioProiezione
                                      }: ModalSelezionePostiProps) => {
    // Calcolo dimensioni della griglia
    const filaMax = Math.max(...postiDisponibili.map(posto => posto.fila.charCodeAt(0) - 65));
    const postoMax = Math.max(...postiDisponibili.map(posto => posto.numero));

    // Genera array delle file
    const file = Array.from({length: filaMax + 1}, (
        _, i
    ) =>
        String.fromCharCode(65 + i));

    // Prepara etichette per i posti occupati
    const etichettePostiOccupati = postiOccupati
        .filter(posto =>
            !ordineSelezionato?.biglietti.some(t =>
                t.posti.some(p => p.id === posto.id)
            )
        )
        .map(posto => `${posto.fila}${posto.numero}`);

    //creazione delle etichette per i posti selezionati
    const etichettePostiSelezionati = postiSelezionati.map(idPosto => {
        const posto = postiDisponibili.find(p => p.id === idPosto);
        if (!posto) return null;

        return {
            etichetta: `${posto.fila}${posto.numero}`,
            id: posto.id,
            fila: posto.fila,
            numero: posto.numero
        };
    }).filter((posto): posto is PostoSelezionato => posto !== null);

    //quando clicca sul posto allora si seleziona
    const handleClickPosto = (fila: string, numeroPosto: number) => {
        const posto = postiDisponibili.find(
            p => p.fila === fila && p.numero === numeroPosto
        );
        if (posto) {
            onTogglePosto(posto.id);
        }
    };

    return (
        <Dialog open={isAperto} onOpenChange={onChiudi}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Seleziona Nuovi Posti</DialogTitle>
                    <DialogDescription>
                        Seleziona {ordineSelezionato?.biglietti.length} nuovi posti
                        per {ordineSelezionato?.proiezione.film_titolo}
                    </DialogDescription>
                </DialogHeader>

                {errore && (
                    <Alert variant="destructive">
                        <AlertDescription>{errore}</AlertDescription>
                    </Alert>
                )}

                <div className="py-4">
                    <LegendaPosti/>

                    <div className="mt-6">
                        <GrigliaPosti
                            file={file}
                            postiPerFila={postoMax}
                            postiOccupati={etichettePostiOccupati}
                            postiSelezionati={etichettePostiSelezionati}
                            onPostoClick={handleClickPosto}
                        />
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                        Posti selezionati: {postiSelezionati.length} di {ordineSelezionato?.biglietti.length}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onChiudi}>
                        Annulla
                    </Button>
                    <Button
                        onClick={() => ordineSelezionato && onConferma(ordineSelezionato)}
                        disabled={postiSelezionati.length !== ordineSelezionato?.biglietti.length}
                    >
                        {isCambioProiezione ? 'Conferma Modifiche' : 'Aggiorna Posti'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
import { format, parseISO } from 'date-fns';
import {PropsDialogoProiezione} from '@/types/ordine';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

//modal di modifica della data e dei posti.
export const ModalModifica = ({
                                      isOpen,
                                      onClose,
                                      ordineSelezionato,
                                      proiezioniDisponibili,
                                      proiezioneTemporanea,
                                      onCambioProiezione,
                                      onConferma
}: PropsDialogoProiezione) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambia Orario Spettacolo</DialogTitle>
                    <DialogDescription>
                        Seleziona un nuovo orario per {ordineSelezionato?.proiezione.film_titolo}
                    </DialogDescription>
                </DialogHeader>
                {/* Area selezione nuova proiezione */}
                <div className="py-4">
                    <Select value={proiezioneTemporanea} onValueChange={onCambioProiezione}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleziona nuovo orario" />
                        </SelectTrigger>
                        <SelectContent>
                            {proiezioniDisponibili.map((proiezione) => (
                                <SelectItem
                                    key={proiezione.id}
                                    value={proiezione.id.toString()}
                                >
                                    {format(parseISO(proiezione.data_ora), 'dd/MM/yyyy HH:mm')} - {proiezione.sala}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annulla
                    </Button>
                    <Button onClick={onConferma} disabled={!proiezioneTemporanea}>
                        Continua alla Selezione Posti
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
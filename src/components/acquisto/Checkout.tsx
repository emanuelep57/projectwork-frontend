import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { AlertCircle, CreditCard } from "lucide-react";
import { FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { bigliettoAPI } from "@/services/biglietti";
import { PostoSelezionato } from "@/types/posto.ts";

//TODO FIXARE I FILE DEI TIPI IN MODO DA RENDERLO ORDINATO.
interface CheckoutSheetProps {
    aperto: boolean; // Stato per determinare se lo sheet è visibile
    onStatoChange: (aperto: boolean) => void; // funzione per aggiornare lo stato dello sheet
    postiSelezionati: PostoSelezionato[]; // elenco dei posti selezionati
    idProiezione: number; // ID della proiezione
    dettagliOspite?: { [numeroPosto: string]: { nome: string; cognome: string } }; // nome e cognome degli ospiti per ogni posto
    onSuccess: () => void; //Funzione che reindirizza e scarica il pdf in caso vada a buon fine
    costo: number; // Costo per posto
}

// Sheet laterale che si apre, mostra un piccolo riepilogo dell'acquisto e dove si conclude l'acquisto appunto.
const Checkout = ({
                      aperto, // Stato che controlla se il foglio è aperto
                      onStatoChange, // Funzione per chiudere o aprire il foglio
                      postiSelezionati, // Lista dei posti selezionati
                      idProiezione, // ID della proiezione corrente
                      dettagliOspite = {}, // Dettagli opzionali degli ospiti
                      onSuccess, // Callback da eseguire dopo un acquisto di successo
                      costo, // Costo di ogni posto
                  }: CheckoutSheetProps) => {


    const [processando, setProcessando] = useState(false); // Indica se il pagamento è in corso
    const [error, setError] = useState<string | null>(null);
    const [dataScadenza, setDataScadenza] = useState('');
    const [cvc, setCvc] = useState('');
    const { toast } = useToast(); // Hook per mostrare notifiche

    // Funzione per gestire il completamento del checkout
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Evita il comportamento predefinito del form
        setProcessando(true); // Imposta lo stato di elaborazione
        setError(null); // Resetta eventuali errori precedenti

        try {
            const { pdf_urls } = await bigliettoAPI.acquistaBiglietti(
                idProiezione,
                postiSelezionati.map(seat => ({
                    id: seat.id, // ID del posto selezionato
                    dettagliOspite: dettagliOspite[seat.etichetta],
                }))
            );

            // Scarica automaticamente il PDF del biglietto
            if (pdf_urls && pdf_urls.length > 0) {
                await bigliettoAPI.downloadPdf(pdf_urls[0]);
            }

            // Mostra una notifica di successo
            toast({
                title: "Successo!",
                description: "Il tuo biglietto è stato creato con successo",
            });
            onSuccess(); // Esegue la callback di successo
            onStatoChange(false); // Chiude il foglio di checkout
        } catch (err) {
            // Gestione degli errori
            setError(err instanceof Error ? err.message : 'OOPS...SI È VERIFICATO UN IMPREVISTO');
        } finally {
            setProcessando(false); // Resetta lo stato di elaborazione
        }
    };

    // Render dello sheet
    return (
        <Sheet open={aperto} onOpenChange={onStatoChange}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Completa il tuo ordine</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                    {/* Mostra un eventuale errore con l'alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Riepilogo dei posti selezionati */}
                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                            {/* Mostra i posti selezionati */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Posti selezionati </span>
                                <span>{postiSelezionati.map(posto => posto.etichetta).join(', ')}</span>
                            </div>
                            {/* Mostra il prezzo per posto */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prezzo per biglietto</span>
                                <span>{costo} € </span>
                            </div>
                            {/* totale */}
                            <div className="flex justify-between font-medium pt-2 border-t border-border">
                                <span>Totale</span>
                                <span>€ {(postiSelezionati.length * costo)}</span>
                            </div>

                            <h3 className="text-md font-semibold pt-4 border-b border-border pb-4">Dettagli Ospiti:</h3>
                            {/* Mostra i dettagli degli ospiti (se ci sono più posti) */}
                            {postiSelezionati.slice(1).map((seat) => (
                                <div key={seat.etichetta} className="space-y-2 pt-4">

                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <Label>Nome</Label>
                                            <p className="text-sm mt-1">
                                                {dettagliOspite[seat.etichetta]?.nome || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Cognome</Label>
                                            <p className="text-sm mt-1">
                                                {dettagliOspite[seat.etichetta]?.cognome || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Posto</Label>
                                            <p className="text-sm mt-1">
                                                {seat.etichetta || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form per i dettagli di pagamento */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campo per il numero della carta */}
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Numero della carta</Label>
                                <div className="relative">
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                    />
                                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>

                            {/* Campi per la scadenza e il CVC */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Data di scadenza</Label>
                                    <Input
                                        id="expiry"
                                        value={dataScadenza}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 4) {
                                                setDataScadenza(value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value);
                                            }
                                        }}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                        id="cvc"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="123"
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            {/* Pulsante per submittare il form */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processando}
                            >
                                {processando ? 'Processando il pagamento...' : 'Paga ora'}
                            </Button>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Checkout;

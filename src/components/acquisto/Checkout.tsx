import {useState, useEffect} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {AlertCircle, CreditCard} from "lucide-react";
import {FormEvent} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {bigliettoAPI} from "@/services/biglietti";
import {ordineAPI} from "@/services/ordini";
import {useAuth} from "@/context/AuthContext";
import {CheckoutSheetProps} from "@/types/acquisto.ts";

const Checkout = ({
                      aperto,
                      onStatoChange,
                      postiSelezionati,
                      idProiezione,
                      dettagliOspite = {},
                      onSuccess,
                      costo,
                      isModificaOrdine,
                      idOrdineEsistente
                  }: CheckoutSheetProps) => {

    const [processando, setProcessando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dataScadenza, setDataScadenza] = useState('');
    const [cvc, setCvc] = useState('');
    const {toast} = useToast();
    const {utente} = useAuth();

    useEffect(() => {
        if (postiSelezionati.length > 0 && !isModificaOrdine && utente?.nome && utente?.cognome) {
            // Solo se NON è una modifica ordine, usa i dati dell'utente loggato
            const firstSeatLabel = postiSelezionati[0].etichetta;
            if (!dettagliOspite[firstSeatLabel]) {
                dettagliOspite[firstSeatLabel] = {
                    nome: utente.nome,
                    cognome: utente.cognome
                };
            }
        }
        // Non facciamo nulla se è una modifica ordine, poiché i dettagli
        // vengono già gestiti dal componente ModificaOrdine
    }, [postiSelezionati, utente, isModificaOrdine, dettagliOspite]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setProcessando(true);
        setError(null);

        try {
            if (isModificaOrdine && idOrdineEsistente) {
                const biglietti = postiSelezionati.map(seat => ({
                    id_posto: seat.id,
                    nome_ospite: dettagliOspite[seat.etichetta]?.nome,
                    cognome_ospite: dettagliOspite[seat.etichetta]?.cognome
                }));

                const response = await ordineAPI.aggiungiBigliettiAOrdine(
                    idOrdineEsistente,
                    biglietti
                );

                if (response.pdf_url) {
                    await bigliettoAPI.downloadPdf(response.pdf_url);
                }
            } else {
                const {pdf_urls} = await bigliettoAPI.acquistaBiglietti(
                    idProiezione,
                    postiSelezionati.map(seat => ({
                        id_posto: seat.id,
                        nome_ospite: dettagliOspite[seat.etichetta]?.nome,
                        cognome_ospite: dettagliOspite[seat.etichetta]?.cognome
                    }))
                );

                if (pdf_urls && pdf_urls.length > 0) {
                    await bigliettoAPI.downloadPdf(pdf_urls[0]);
                }
            }

            toast({
                title: "Successo!",
                description: isModificaOrdine
                    ? "I biglietti sono stati aggiunti all'ordine con successo"
                    : "Il tuo ordine è stato creato con successo",
            });
            onSuccess();
            onStatoChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'OOPS...SI È VERIFICATO UN IMPREVISTO');
        } finally {
            setProcessando(false);
        }
    };

    return (
        <Sheet open={aperto} onOpenChange={onStatoChange}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Completa il tuo ordine</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Posti selezionati </span>
                                <span>{postiSelezionati.map(posto => posto.etichetta).join(', ')}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prezzo per biglietto</span>
                                <span>{costo} € </span>
                            </div>

                            <div className="flex justify-between font-medium pt-2 border-t border-border">
                                <span>Totale</span>
                                <span>€ {(postiSelezionati.length * costo)}</span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-md font-semibold border-b border-border pb-4">Riepilogo Posti:</h3>
                                {postiSelezionati.map((seat, index) => (
                                    <div key={seat.id} className="py-4 border-b border-border">
                                        <div className="font-medium mb-2">
                                            Posto {seat.etichetta}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Nome</Label>
                                                <p className="text-sm mt-1">
                                                    {index === 0 && utente && !isModificaOrdine
                                                        ? utente.nome
                                                        : (dettagliOspite[seat.etichetta]?.nome || 'Non specificato')}
                                                </p>
                                            </div>
                                            <div>
                                                <Label>Cognome</Label>
                                                <p className="text-sm mt-1">
                                                    {index === 0 && utente && !isModificaOrdine
                                                        ? utente.cognome
                                                        : (dettagliOspite[seat.etichetta]?.cognome || 'Non specificato')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Numero della carta</Label>
                                <div className="relative">
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        required
                                    />
                                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"/>
                                </div>
                            </div>

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
                                        required
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
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processando}
                            >
                                {processando ? 'Processando il pagamento...' : `Paga ${(postiSelezionati.length * costo)}€`}
                            </Button>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Checkout;
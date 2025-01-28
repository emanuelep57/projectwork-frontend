import { useState } from 'react';
import { ShoppingCart } from "lucide-react";
import { RiepilogoOrdineProps } from "@/types/posto.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { calcolaCosto } from '@/utils/calcoloCosto';

export const Riepilogo = ({
                                    postiSelezionati,
                                    costo,
                                    vistaMobile,
                                    isProcessing,
                                    onIndietro,
                                    onConferma,
                                }: RiepilogoOrdineProps) => {

    //per ospiti intendo persone non registrate per cui l'utente registrato sta acquistando i biglietti
    const [dettagliOspiti, setDettagliOspiti] = useState<{ [chiavePosto: string]: { nome: string, cognome: string } }>({});
    const { costoProiezione, totale } = calcolaCosto(postiSelezionati, costo);

    // Funzione per aggiornare i dettagli degli ospiti
    const aggiornaDettagliOspiti = (etichettaPosto: string, campo: 'nome' | 'cognome', valore: string) => {
        setDettagliOspiti(prev => ({
            ...prev,
            [etichettaPosto]: {
                ...prev[etichettaPosto],
                [campo]: valore
            }
        }));
    };

    // Disabilita il checkout se i dettagli sono incompleti o se l'elaborazione è in corso
    const isCheckoutDisabilitato = () => {
        if (postiSelezionati.length > 1) {
            return postiSelezionati.slice(1).some(posto =>
                !dettagliOspiti[posto.etichetta]?.nome ||
                !dettagliOspiti[posto.etichetta]?.cognome
            );
        }
        return postiSelezionati.length === 0 || isProcessing;
    };

    return (
        <div className={`space-y-6 ${vistaMobile ? "pb-safe-area-bottom" : ""}`}>
            {/* Titolo del riepilogo */}
            <h2 className="text-xl font-bold text-foreground mb-6">Riepilogo Ordine</h2>

            {/* Lista dei posti selezionati */}
            <div className="space-y-3">
                {postiSelezionati.map((posto, indice) => (
                    <div key={posto.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                            {/* Etichetta e costo del singolo posto */}
                            <span className="text-muted-foreground">Posto {posto.etichetta}</span>
                            <span className="text-foreground">€ {costoProiezione}</span>
                        </div>

                        {/* Campi per nome e cognome se ci sono più posti */}
                        {indice > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`nome-${posto.etichetta}`}>Nome Ospite</Label>
                                    <Input
                                        id={`nome-${posto.etichetta}`}
                                        placeholder="Nome"
                                        value={dettagliOspiti[posto.etichetta]?.nome || ''}
                                        onChange={(e) => aggiornaDettagliOspiti(posto.etichetta, 'nome', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`cognome-${posto.etichetta}`}>Cognome Ospite</Label>
                                    <Input
                                        id={`cognome-${posto.etichetta}`}
                                        placeholder="Cognome"
                                        value={dettagliOspiti[posto.etichetta]?.cognome || ''}
                                        onChange={(e) => aggiornaDettagliOspiti(posto.etichetta, 'cognome', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Totale del riepilogo */}
            <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Prezzo Totale</span>
                    <span>€ {totale}</span>
                </div>

                <div className="flex justify-between items-center mt-2 font-bold">
                    <span className="text-foreground">Totale Complessivo</span>
                    <span className="text-primary">€ {totale}</span>
                </div>
            </div>

            {/* Pulsanti per indietro e conferma */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onIndietro}
                >
                    Indietro
                </Button>
                <Button
                    className="flex-1"
                    disabled={isCheckoutDisabilitato()}
                    onClick={() => onConferma(dettagliOspiti)}
                >
                    <ShoppingCart className="w-5 h-5 mr-2"/>
                    Conferma ({postiSelezionati.length} posti)
                </Button>
            </div>
        </div>
    );
};

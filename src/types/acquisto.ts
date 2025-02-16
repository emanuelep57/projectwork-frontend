export interface CheckoutSheetProps {
    aperto: boolean;
    onStatoChange: (stato: boolean) => void;
    postiSelezionati: Array<{
        id: number;
        etichetta: string;
        fila: string;
        numero: number;
    }>;
    idProiezione: number;
    dettagliOspite: {
        [etichettaPosto: string]: {
            nome: string;
            cognome: string;
        };
    };
    onSuccess: () => void;
    costo: number;
    isModificaOrdine?: boolean;
    idOrdineEsistente?: number;
}

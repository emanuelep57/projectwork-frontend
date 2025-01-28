// types/seat.ts
export interface Posto {
    id: number;
    fila: string;
    numero: number;
}

export interface PostoSelezionato extends Posto {
    etichetta: string;
}

export interface IconaPostoProps {
    selezionato?: boolean;
    occupato?: boolean;
}


export interface RiepilogoOrdineProps {
    vistaMobile?: boolean;
    postiSelezionati: PostoSelezionato[];
    onIndietro: () => void;
    onConferma: (dettagliOspiti: {[chiave: string]: { nome: string; cognome: string }}) => void
    isProcessing: boolean;
    costo: number;
}


export interface GrigliaPostiProps {
    file: string[];
    postiPerFila: number;
    postiOccupati: string[];
    postiSelezionati: PostoSelezionato[];
    onPostoClick: (row: string, seatNum: number) => void;
}

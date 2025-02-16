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

export interface PostoUtente extends Posto {
    nome_ospite: string | null;
    cognome_ospite: string | null;
}

export interface GrigliaPostiProps {
    file: string[];
    postiPerFila: number;
    postiOccupati: string[];
    postiSelezionati: PostoSelezionato[];
    onPostoClick: (row: string, seatNum: number) => void;
}

import {Posto, PostoUtente} from "@/types/posto.ts";

export interface Biglietto {
    id_biglietto: number;
    posti: PostoUtente[];
    film_titolo: string;
    data_ora: string;
    sala_nome: string;
    pdf_url: string;
    nome_titolare?: string;
    cognome_titolare?: string;
}

export interface BigliettoOrdine {
    id: number;
    posti:Array<Posto>;
    nome_ospite?: string;
    cognome_ospite?: string;
}

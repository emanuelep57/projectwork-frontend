// types/auth.ts

/**
 * Interfaccia che definisce la struttura di un utente
 */

export interface base{
    id: number;
}

export interface Utente extends base{
    email: string;
    nome: string;
}

export interface DatiRegistrazione extends Utente {
    password: string;
    cognome: string;
}

export interface ContestoAutenticazioneTipo {
    utente: Utente | null;
    autenticato: boolean;
    inCaricamento: boolean;
    accedi: (email: string, password: string) => Promise<void>;
    registra: (datiUtente: DatiRegistrazione) => Promise<void>;
    disconnetti: () => Promise<void>;
    verificaAutenticazione: () => Promise<void>;
}
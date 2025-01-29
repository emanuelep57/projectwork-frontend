export interface base {
    id: number;
}

export interface Utente extends base {
    email: string;
    nome: string;
}

// Interfaccia per la registrazione nel modal
export interface DatiRegistrazioneRequest {
    email: string;
    password: string;
    nome: string;
    cognome: string;
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
    registra: (datiUtente: DatiRegistrazioneRequest) => Promise<void>;
    disconnetti: () => Promise<void>;
    verificaAutenticazione: () => Promise<void>;
}
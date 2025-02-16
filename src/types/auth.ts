import {FormEvent, ReactNode} from "react";
import {FieldErrors, UseFormGetValues, UseFormRegister} from "react-hook-form";

export interface base {
    email: string;
    nome: string
}

export interface Utente extends base {
    id: number;
    cognome: string;
}

// Interfaccia per la registrazione nel modal
export interface DatiRegistrazioneRequest extends base{
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

export interface LoginFormInputs {
    email: string;
    password: string;
}

export interface LoginFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void; //funzione che accetta un evento di tipo FormEvent generato da un <form>.
    errori: FieldErrors<LoginFormInputs>; //errori dei campi
    registra: UseFormRegister<LoginFormInputs>; //registra i campi con react-hook-form
}

export interface SignupFormInputs {
    nome: string;
    cognome: string;
    email: string;
    password: string;
    confermaPassword: string;
}

export interface RegistrazioneProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    errori: FieldErrors<SignupFormInputs>;
    registra: UseFormRegister<SignupFormInputs>;
    getValori: UseFormGetValues<SignupFormInputs>;
}

export interface ModalProps {
    children?: ReactNode; //Il modal può avere children, esempio un bottone che se cliccato apre il modal, oppure si può aprire in automatico se è richiesto il login
    tabIniziale?: "login" | "signup";
    aperto?: boolean;
    onCambioStato?: (aperto: boolean) => void;
    onSuccess?: () => void;
}


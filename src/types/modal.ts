import React from "react";

export interface LoginFormInputs {
    email: string;      // Email dell'utente
    password: string;   // Password dell'utente
}

/**
 * Interfaccia per i dati del form di registrazione
 * Estende i dati base con informazioni aggiuntive necessarie per la registrazione
 */
export interface SignupFormInputs {
    nome: string;              // Nome dell'utente
    cognome: string;          // Cognome dell'utente
    email: string;            // Email dell'utente
    password: string;         // Password scelta
    confermaPassword: string; // Conferma della password
}

/**
 * Interfaccia per le props del modale di autenticazione
 * Definisce le proprietà configurabili del componente modale
 */
export interface ModalProps {
    children?: React.ReactNode;                // Contenuto opzionale del trigger
    tabIniziale?: "login" | "signup";         // Tab iniziale da mostrare
    isOpen?: boolean;                         // Stato di apertura del modale
    onOpenChange?: (open: boolean) => void;   // Handler cambio stato
    onSuccess?: () => void;                   // Callback per autenticazione riuscita
}
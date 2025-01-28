import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContestoAutenticazioneTipo, DatiRegistrazione, Utente } from "@/types/auth.ts";

const ContestoAutenticazione = createContext<ContestoAutenticazioneTipo | null>(null);

//Nel provider sono definite le funzionalità per login, logout, registrazione e verifica se l'utente è loggato
export const ProviderAutenticazione = ({ children }: { children: ReactNode }) => {
    const [utente, setUtente] = useState<Utente | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);

    //check se l'utente è loggato
    const verificaAutenticazione = async () => {
        try {
            const risposta = await fetch('http://localhost:5000/api/auth/status', {
                credentials: 'include'
            });
            if (risposta.ok) {
                const dati = await risposta.json();
                setUtente(dati.utente);
            } else {
                setUtente(null);
            }
        } catch (errore) {
            console.error('Errore verifica autenticazione:', errore);
            setUtente(null);
        } finally {
            setInCaricamento(false);
        }
    };

    //funzione per il login
    const accedi = async (email: string, password: string) => {
        const risposta = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!risposta.ok) {
            const errore = await risposta.json();
            throw new Error(errore.error);
        }

        const dati = await risposta.json();
        if (dati.utente) {
            setUtente(dati.utente);
        } else {
            // Se il login è riuscito ma non abbiamo i dati utente, verifichiamo lo stato
            await verificaAutenticazione();
        }
    };

    //funzione per la registrazione
    const registra = async (datiUtente: DatiRegistrazione) => {
        const risposta = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(datiUtente),
        });

        if (!risposta.ok) {
            const errore = await risposta.json();
            throw new Error(errore.error);
        }

        const dati = await risposta.json();
        setUtente(dati.utente);
    };

    //funzione per il logout
    const disconnetti = async () => {
        await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUtente(null);
    };

    // Verifica lo stato appena si avvia il sito
    useEffect(() => {
        verificaAutenticazione();
    }, []);

    return (
        <ContestoAutenticazione.Provider
            value={{
                utente,
                autenticato: !!utente,
                inCaricamento,
                accedi,
                registra,
                disconnetti,
                verificaAutenticazione
            }}
        >
            {children}
        </ContestoAutenticazione.Provider>
    );
};

//fornisce il contesto e verifica che esista
export const useAuth = () => {
    const contesto = useContext(ContestoAutenticazione);
    if (!contesto) {
        throw new Error('useAuth deve essere utilizzato all\'interno di un ProviderAutenticazione');
    }
    return contesto;
};
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {ContestoAutenticazioneTipo, DatiRegistrazioneRequest, Utente} from "@/types/auth.ts";

const ContestoAutenticazione = createContext<ContestoAutenticazioneTipo | null>(null);
const URL_BASE = `${import.meta.env.VITE_API_URL}/auth`;

export const ProviderAutenticazione = ({ children }: { children: ReactNode }) => {
    const [utente, setUtente] = useState<Utente | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);

    const verificaAutenticazione = async () => {
        try {
            const risposta = await fetch(`${URL_BASE}/status`, {
                credentials: 'include'
            });
            if (risposta.ok) {
                const dati = await risposta.json();
                setUtente(dati.user);
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

    const accedi = async (email: string, password: string) => {
        const risposta = await fetch(`${URL_BASE}/login`, {
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
        if (dati.user) {
            setUtente(dati.user);
        } else {
            await verificaAutenticazione();
        }
    };

    const registra = async (datiUtente: DatiRegistrazioneRequest) => {
        const risposta = await fetch(`${URL_BASE}/registrazione`, {
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

        await accedi(datiUtente.email, datiUtente.password);
    };

    const disconnetti = async () => {
        await fetch(`${URL_BASE}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUtente(null);
    };

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

export const useAuth = () => {
    const contesto = useContext(ContestoAutenticazione);
    if (!contesto) {
        throw new Error('useAuth deve essere utilizzato all\'interno di un ProviderAutenticazione');
    }
    return contesto;
};
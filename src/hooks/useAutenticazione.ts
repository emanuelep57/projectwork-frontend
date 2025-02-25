import {useState} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import {useForm} from "react-hook-form";
import {LoginFormInputs, SignupFormInputs} from "@/types/auth.ts";

//hook che gestisce l'autenticazione
export const useAutenticazione = (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
    // Stati e hooks necessari
    const [erroreApi, setErroreApi] = useState<string | null>(null);
    const {accedi, registra: authRegister} = useAuth();
    const {toast} = useToast();

    // Inizializzazione dei form con react-hook-form
    const loginForm = useForm<LoginFormInputs>();
    const signupForm = useForm<SignupFormInputs>();


     //Mostra un toast di successo
    const showSuccessToast = (message: string) => {
        toast({
            title: "Successo!",
            description: message,
            duration: 3000,
            variant: "default",
        });
    };

    //getisce il login, con un messaggio di successo o di errore
    const handleLogin = async (data: LoginFormInputs) => {
        try {
            setErroreApi(null);
            await accedi(data.email, data.password);
            showSuccessToast("Successfully logged in!");
            onSuccess?.();
            onOpenChange?.(false);
        } catch (error) {
            setErroreApi(error instanceof Error ? error.message : 'Si è verificato un errore durante il login');
        }
    };

    //idem per la registrazione come il login
    const handleRegistrazione = async (data: SignupFormInputs) => {
        try {
            setErroreApi(null);
            await authRegister({
                nome: data.nome,
                cognome: data.cognome,
                email: data.email,
                password: data.password
            });
            showSuccessToast("Account creato con successo!");
            onSuccess?.();
            onOpenChange?.(false);
        } catch (error) {
            setErroreApi(error instanceof Error ? error.message : 'Si è verificato un errore durante la registrazione');
        }
    };

    return {
        loginForm,
        signupForm,
        erroreApi,
        setErroreApi,
        handleLogin,
        handleRegistrazione
    };
};
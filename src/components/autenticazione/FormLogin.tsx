import { Button } from "@/components/ui/button";
import FormError from "@/components/autenticazione/FormError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {FormEvent} from "react";


interface LoginFormInputs {
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void; //funzione che accetta un evento di tipo FormEvent generato da un <form>.
    errori: FieldErrors<LoginFormInputs>; //errori dei campi
    registra: UseFormRegister<LoginFormInputs>; //registra i campi con react-hook-form
}

//componente che gestisce il form del login
const FormLogin = ({ onSubmit, errori, registra }: LoginFormProps) => (
    <form onSubmit={onSubmit} className="grid gap-4">
        <FormError errori={errori} />

        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                {...registra("email", {
                    required: "l'Email è obbligatoria",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //regex per il controllo dell'email
                        message: "Email non valida",
                    },
                })}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                {...registra("password", {
                    required: "La password è obbligatoria",
                    minLength: {
                        value: 8,
                        message: "La password deve essere lunga almeno 8 caratteri",
                    },
                })}
            />
        </div>

        <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            size="lg"
            type="submit"
        >
            ACCEDI
        </Button>
    </form>
);

export default FormLogin;
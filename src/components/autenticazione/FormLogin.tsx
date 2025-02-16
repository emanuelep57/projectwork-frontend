import { Button } from "@/components/ui/button";
import FormError from "@/components/autenticazione/FormError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {LoginFormProps} from "@/types/auth.ts";



//componente che gestisce il form del login, la validazione sui campi viene fatta con react-hook-form
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
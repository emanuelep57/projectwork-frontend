import { Button } from "@/components/ui/button";
import FormError from "@/components/autenticazione/FormError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {RegistrazioneProps} from "@/types/auth.ts";

//componente che gestisce il form del signup, la validazione sui campi viene fatta con react-hook-form
const FormRegistrazione = ({ onSubmit, errori, registra, getValori }: RegistrazioneProps) => (
    <form onSubmit={onSubmit} className="grid gap-4">
        <FormError errori={errori} />

        <div className="grid gap-2">
            <Label htmlFor="nome">First Name</Label>
            <Input
                id="nome"
                type="text"
                {...registra("nome", {
                    required: "Il nome è obbligatorio"
                })}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="cognome">Last Name</Label>
            <Input
                id="cognome"
                type="text"
                {...registra("cognome", {
                    required: "Il cognome è obbligatorio"
                })}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="signupEmail">Email</Label>
            <Input
                id="signupEmail"
                type="email"
                placeholder="name@example.com"
                {...registra("email", {
                    required: "l'email è obbligatoria",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Indirizzo email non valido"
                    }
                })}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="signupPassword">Password</Label>
            <Input
                id="signupPassword"
                type="password"
                {...registra("password", {
                    required: "La password è obbligatoria",
                    minLength: {
                        value: 8,
                        message: "La password deve essere lunga almeno 8 caratteri"
                    }
                })}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="confermaPassword">Confirm Password</Label>
            <Input
                id="confermaPassword"
                type="password"
                {...registra("confermaPassword", {
                    required: "La password di conferma è obbligatoria",
                    validate: value =>
                        value === getValori("password") || "Le password non coincidono"
                })}
            />
        </div>

        <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            size="lg"
            type="submit"
        >
            CREA ACCOUNT
        </Button>
    </form>
);

export default FormRegistrazione;
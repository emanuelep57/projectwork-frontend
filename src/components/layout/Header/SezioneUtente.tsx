import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/autenticazione/ModalAutenticazione";
import { NavLink } from './NavLink';

export const SezioneUtente = ({ vistaMobile }: { vistaMobile?: boolean }) => {
    const { utente, autenticato, disconnetti } = useAuth();

    // Se l'utente è autenticato
    if (autenticato && utente) {
        return (
            <div className={`flex ${vistaMobile ? 'flex-col w-full' : 'items-center space-x-4'}`}>
                <NavLink href="/my-tickets" vistaMobile={vistaMobile}>{utente.nome}</NavLink>
                <Button
                    onClick={disconnetti}
                    className={`${vistaMobile ? 'w-full mt-2' : ''} bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground`}
                    size={vistaMobile ? "sm" : "default"}
                >
                    LOGOUT
                </Button>
            </div>
        );
    }

    // Per utenti non autenticati su mobile, mostra solo l'icona
    if (vistaMobile) {
        return (
            <AuthModal>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                >
                    <User className="h-5 w-5" />
                </Button>
            </AuthModal>
        );
    }

    // Per desktop, sempre per utenti non autenticati, mostra il pulsante completo
    return (
        <AuthModal>
            <Button
                className="flex items-center space-x-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            >
                <User className="h-4 w-4" />
                <span>LOGIN</span>
            </Button>
        </AuthModal>
    );
};
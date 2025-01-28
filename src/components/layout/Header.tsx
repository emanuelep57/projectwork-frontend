import {Button} from "@/components/ui/button.tsx";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Menu, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import AuthModal from "@/components/autenticazione/ModalAutenticazione.tsx";
import { useAuth } from "@/context/AuthContext.tsx";


//TODO SEPARARE I DIVERSI COMPONENTI DELL'HEADER IN FILE SEPARATI PER MODULARITÀ MIGLIORE.
//TODO PROVA A RIMUOVERE IL FRAMMENTO A RIGA 144 E VEDI COSA CAMBIA.

interface NavLinkProps {
    href: string;
    isMobile: boolean;
    children: string; //il child in questo caso è il testo del link nella navlinksection
}

{/*questa è la sezione dove mostro il logo con il componente Avatar ed il titolo */}
export const Logo = () => (
    <div className="flex items-center space-x-3 group cursor-pointer">
        <Avatar>
            <AvatarImage src="images/logo_pegasus.webp"/>
            <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <span className="text-xl lg:text-2xl font-bold">
            CINEMA PEGASUS
        </span>
    </div>
);

{/*Sezione della navbar con i diversi link */}
const NavLinkSection = ({isMobile}: { isMobile: boolean }) => {
    return (
        <>
            <NavLink href="/" isMobile={isMobile}>Home</NavLink>
            <NavLink href="/movies" isMobile={isMobile}>Movies</NavLink>
            <NavLink href="/showtimes" isMobile={isMobile}>Showtimes</NavLink>
            <NavLink href="/menu" isMobile={isMobile}>Menu</NavLink>
            <NavLink href="/evento-privato" isMobile={isMobile}>Private Parties</NavLink>
            <NavLink href="/my-tickets" isMobile={isMobile}>My Tickets</NavLink>
        </>
    );
};


{/*componente che restituisce il link della navbar con la classe appropriata */}
const NavLink = ({href, isMobile, children}: NavLinkProps) => {
    const classeMobile = "w-full text-center py-4 text-lg border-b border-border text-foreground hover:text-primary hover:font-semibold transition-all duration-300 px-4";
    const classeDesktop = "text-sm font-medium text-foreground hover:text-primary px-3 py-2 transition-all duration-300";

    return (
        <a href={href} className={isMobile ? classeMobile : classeDesktop}>
            {children}
        </a>
    );
};


// Componente che mostra il nome ed il bottone disconnetti in caso l'utente sia loggato.
//Invece se non è loggato presenta un icona con il pulsante login.
// da Mobile: gli elementi sono disposti in una colonna
// per Desktop: gli elementi sono disposti in una riga.
// Prima modifichiamo UserSection per gestire sia la versione icon-only che quella completa
export const UserSection = ({ isMobile, iconOnly = false }: { isMobile: boolean, iconOnly?: boolean }) => {
    const { utente, autenticato, disconnetti } = useAuth();

    // Versione icon-only per il mobile header
    if (iconOnly) {
        return autenticato ? (
            <span className="text-primary font-semibold">{utente?.nome}</span>
        ) : (
            <AuthModal>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                >
                    <User className="h-6 w-6" />
                </Button>
            </AuthModal>
        );
    }

    // Versione completa per il drawer mobile e desktop
    if (autenticato && utente) {
        return (
            <div className={`flex items-center ${isMobile ? 'flex-col space-y-3 w-full px-4' : 'space-x-4'}`}>
                <span className="text-primary font-semibold">
                    {utente.nome}
                </span>
                <Button
                    onClick={() => disconnetti()}
                    className={`${isMobile ? 'w-full' : ''} bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground`}
                >
                    LOGOUT
                </Button>
            </div>
        );
    }

    // Versione non autenticata
    if (isMobile) {
        return (
            <div className="mt-6 space-y-3 w-full px-4">
                <Button
                    className="w-full bg-white/95 text-primary font-extrabold hover:bg-white/85"
                    size="lg"
                >
                    LOG IN
                </Button>
                <Button
                    className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                    size="lg"
                >
                    SIGN UP
                </Button>
            </div>
        );
    }

    return (
        <AuthModal>
            <Button
                className="flex items-center space-x-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
                <User className="h-4 w-4" />
                <span>LOGIN</span>
            </Button>
        </AuthModal>
    );
};

// E ora il Header semplificato
const Header = () => {
    return (
        <header className="w-full bg-background border-b border-border sticky">
            <div className="px-4 lg:container mx-auto">
                <div className="flex items-center justify-between lg:justify-center py-4">
                    <Sheet>
                        <SheetTrigger asChild className="lg:hidden">
                            <Menu className="w-8 h-8 cursor-pointer hover:text-primary"/>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="p-0 bg-background"
                        >
                            <div className="flex justify-center items-center p-4 border-b border-border">
                                <Logo/>
                            </div>

                            <nav className="p-4 flex flex-col items-center justify-center">
                                <NavLinkSection isMobile={true}/>
                                <UserSection isMobile={true} />
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Logo/>

                    {/* Usiamo UserSection con iconOnly per il mobile */}
                    <div className="lg:hidden">
                        <UserSection isMobile={true} iconOnly={false} />
                    </div>
                </div>

                <nav className="hidden lg:flex items-center justify-center py-3 border-t border-border">
                    <div className="flex items-center space-x-8">
                        <NavLinkSection isMobile={false}/>
                    </div>
                    <div className="flex items-center ml-8">
                        <UserSection isMobile={false} />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
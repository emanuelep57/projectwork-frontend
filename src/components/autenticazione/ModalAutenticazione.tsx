import {useAutenticazione} from "@/hooks/useAutenticazione.ts";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FormLogin from "@/components/autenticazione/FormLogin.tsx";
import {X} from "lucide-react";
import FormError from "@/components/autenticazione/FormError";
import FormRegistrazione from "@/components/autenticazione/FormRegistrazione.tsx";
import {ModalProps} from "@/types/auth.ts";

//Modal che gestisce l'autenticazione con le schede login e registrazione
const ModaleAutenticazione = ({
                                  children,
                                  tabIniziale = "login",
                                  aperto,
                                  onCambioStato = () => {
                                  },
                                  onSuccess = () => {
                                  }
                              }: ModalProps) => {
    // Hook personalizzato per la logica del modulo
    const {
        loginForm,
        signupForm,
        erroreApi,
        setErroreApi,
        handleLogin,
        handleRegistrazione,
    } = useAutenticazione(onSuccess, onCambioStato);


    //Gestisce la chiusura del modal e mi resetta tutti i campi quando chiuso
    const handleStato = (aperto: boolean) => {
        onCambioStato(aperto); // Chiama direttamente la funzione
        if (!aperto) {
            loginForm.reset();
            signupForm.reset();
            setErroreApi(null);
        }
    };

    return (
        <Dialog open={aperto} onOpenChange={handleStato}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}

            <DialogContent className="max-w-md bg-background p-0 border-border overflow-hidden sm:rounded-xl">
                <Tabs defaultValue={tabIniziale} className="w-full">
                    <TabsList className="grid w-full grid-cols-[1fr_1fr_auto] bg-background">
                        <TabsTrigger
                            value="login"
                            className="data-[state=active]:bg-primary/85 data-[state=active]:text-secondary"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="signup"
                            className="data-[state=active]:bg-primary/85 data-[state=active]:text-secondary"
                        >
                            Registrati
                        </TabsTrigger>
                        <DialogClose className="px-4 hover:bg-accent/80">
                            <X className="h-5 w-5"/>
                        </DialogClose>
                    </TabsList>

                    {erroreApi && <FormError errori={{api: {message: erroreApi}}}/>}

                    <TabsContent value="login" className="p-6">
                        <FormLogin
                            onSubmit={loginForm.handleSubmit(handleLogin)}
                            errori={loginForm.formState.errors}
                            registra={loginForm.register}
                        />
                    </TabsContent>

                    <TabsContent value="signup" className="p-6">
                        <FormRegistrazione
                            onSubmit={signupForm.handleSubmit(handleRegistrazione)}
                            errori={signupForm.formState.errors}
                            registra={signupForm.register}
                            getValori={signupForm.getValues}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default ModaleAutenticazione;

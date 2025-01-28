import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";


//componente alert che mostra gli errori dei form di login e registrazione
//ho messo any perché mi dà problemi con il tipo di react-hook-form
const FormError = ({ errori }: { errori: Record<string, any> }) => {
    // Non ritorna nulla se non ci sono errori
    if (Object.keys(errori).length === 0) return null;

    return (
        <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <ul className="list-disc pl-4">
                    {Object.entries(errori).map(([campo, errore]) => (
                        <li key={campo} className="text-sm">
                            {errore.message}
                        </li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
};

export default FormError;
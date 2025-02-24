import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const WorkInProgress = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <Card className="w-full max-w-md bg-white">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <Construction className="w-16 h-16 text-orange-500 animate-bounce" />
                    <h2 className="text-2xl font-bold text-black">Work in Progress</h2>
                    <p className="text-gray-600">
                        Questa sezione è attualmente in fase di sviluppo.
                        Torneremo presto con nuovi contenuti!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkInProgress;
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from './Logo';
import {SezioneNavLink} from './SezioneNavLink';
import {SezioneUtente} from './SezioneUtente';

const Header = () => {
    return (
        <header className="w-full bg-background border-b border-border sticky">
            <div className="px-4 lg:container mx-auto">
                <div className="flex items-center justify-between lg:justify-center py-4">
                    {/* Menu mobile */}
                    <Sheet>
                        <SheetTrigger asChild className="lg:hidden">
                            <Menu className="w-6 h-6 cursor-pointer hover:text-primary"/>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="p-0 bg-background"
                        >
                            <div className="flex justify-center items-center p-4 border-b border-border">
                                <Logo />
                            </div>

                            <nav className="p-4 flex flex-col items-center">
                                <SezioneNavLink vistaMobile />
                                <div className="mt-4 w-full">
                                    <SezioneUtente vistaMobile />
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Logo />

                    {/* UserSection mobile (solo icona) */}
                    <div className="lg:hidden">
                        <SezioneUtente vistaMobile />
                    </div>
                </div>

                {/* Navigation desktop */}
                <nav className="hidden lg:flex items-center justify-center py-3 border-t border-border">
                    <div className="flex items-center space-x-8">
                        <SezioneNavLink />
                    </div>
                    <div className="flex items-center ml-8">
                        <SezioneUtente />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
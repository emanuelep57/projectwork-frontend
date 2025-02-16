import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//semplice sezione con il logo ed il titolo sulla navbar
export const Logo = () => (
    <div className="flex items-center space-x-3 group cursor-pointer">
        <Avatar>
            <AvatarImage src="https://res.cloudinary.com/dj5udxse6/image/upload/v1738162706/logo.webp"/>
            <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <span className="text-xl lg:text-2xl font-bold">
            CINEMA PEGASUS
        </span>
    </div>
);
//semplice footer in fondo alla pagina
const Footer = () => {
    return (
        <footer className="bg-background text-white py-8 md:py-12 border-t border-border">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4 md:mb-6">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-lg font-bold">P</span>
                    </div>
                    <span className="text-xl font-bold">PEGASUS</span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                    Vivi il cinema come mai prima
                </p>
            </div>
        </footer>
    )
}

export default Footer
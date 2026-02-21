import { Brain } from "lucide-react";

const Footer = () => (
    <footer className="border-t bg-card py-10">
        <div className="container mx-auto px-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
                <Brain className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">EmotionAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
                Sistem Klasifikasi Emosi Berbasis Web
            </p>
            <p className="text-xs text-muted-foreground">
                Tugas Akhir – Sistem Cerdas
            </p>
            <p className="text-xs text-muted-foreground">
                [Nama Mahasiswa] · [Nama Institusi]
            </p>
        </div>
    </footer>
);

export default Footer;

"use client";

import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Klasifikasi", path: "/klasifikasi" },
    { label: "Riwayat", path: "/riwayat" },
    { label: "Penjelasan Dataset", path: "/dataset" },
    { label: "Tentang", path: "/tentang" },
];

const Navbar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-secondary" />
                    <span className="text-lg font-bold text-foreground">EmotionAI</span>
                </Link>

                {/* Desktop */}
                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                pathname === item.path
                                    ? "bg-accent text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t bg-card px-4 pb-4 md:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                pathname === item.path
                                    ? "bg-accent text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

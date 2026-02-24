"use client";

import { Brain, Menu, X, LogOut, User as UserIcon, Bell, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/lib/auth";
import { getUnreadMessageCount, getCriticalPatients } from "@/lib/mock-data";
import type { User, PatientStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";

const publicNavItems = [
    { label: "Beranda", path: "/" },
];

const pasienNavItems = [
    { label: "Dashboard", path: "/dashboard" },
];

const psikologNavItems = [
    { label: "Dashboard", path: "/psikolog" },
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Psychologist alert notification
    const [alertPatients, setAlertPatients] = useState<PatientStatus[]>([]);
    const [showAlertDropdown, setShowAlertDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        if (currentUser?.role === "pasien") {
            setUnreadCount(getUnreadMessageCount(currentUser.id, "pasien"));
        }
        if (currentUser?.role === "psikolog") {
            setAlertPatients(getCriticalPatients());
        }
    }, [pathname]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowAlertDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = user
        ? user.role === "psikolog"
            ? psikologNavItems
            : pasienNavItems
        : publicNavItems;

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push("/login");
    };

    const criticalCount = alertPatients.filter((p) => p.alertLevel === "critical").length;
    const warningCount = alertPatients.filter((p) => p.alertLevel === "warning").length;

    return (
        <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href={user ? (user.role === "psikolog" ? "/psikolog" : "/dashboard") : "/"} className="flex items-center gap-2">
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
                                "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                pathname === item.path
                                    ? "bg-accent text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item.label}
                            {item.label === "Dashboard" && user?.role === "pasien" && unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Alert bell for psychologist */}
                    {user?.role === "psikolog" && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowAlertDropdown(!showAlertDropdown)}
                                className={cn(
                                    "relative ml-1 rounded-lg p-2 text-sm transition-colors hover:bg-muted",
                                    alertPatients.length > 0
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Bell className="h-4.5 w-4.5" />
                                {alertPatients.length > 0 && (
                                    <span className={cn(
                                        "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white",
                                        criticalCount > 0 ? "bg-red-500" : "bg-amber-500"
                                    )}>
                                        {alertPatients.length}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showAlertDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-lg">
                                    <div className="border-b border-border px-4 py-3">
                                        <h3 className="text-sm font-semibold text-foreground">Notifikasi Alert</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Pasien yang membutuhkan perhatian
                                        </p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {alertPatients.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                                Tidak ada alert saat ini ✓
                                            </div>
                                        ) : (
                                            alertPatients.map((patient) => (
                                                <Link
                                                    key={patient.patientId}
                                                    href={`/psikolog/pasien/${patient.patientId}`}
                                                    onClick={() => setShowAlertDropdown(false)}
                                                    className="flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-muted/50"
                                                >
                                                    <div className={cn(
                                                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                        patient.alertLevel === "critical"
                                                            ? "bg-red-500/10 text-red-500"
                                                            : "bg-amber-500/10 text-amber-500"
                                                    )}>
                                                        {patient.alertLevel === "critical" ? (
                                                            <ShieldAlert className="h-4 w-4" />
                                                        ) : (
                                                            <AlertTriangle className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-foreground">
                                                                {patient.patientName}
                                                            </span>
                                                            <span className={cn(
                                                                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                                                                patient.alertLevel === "critical"
                                                                    ? "bg-red-500/10 text-red-500"
                                                                    : "bg-amber-500/10 text-amber-500"
                                                            )}>
                                                                {patient.alertLevel === "critical" ? "Kritis" : "Perhatian"}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {patient.negativePercentage}% emosi negatif · {patient.consecutiveNegativeDays} hari berturut
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                    {alertPatients.length > 0 && (
                                        <div className="border-t border-border px-4 py-2.5">
                                            <div className="flex gap-3 text-xs text-muted-foreground">
                                                {criticalCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                                        {criticalCount} Kritis
                                                    </span>
                                                )}
                                                {warningCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                        {warningCount} Perlu Perhatian
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Auth buttons */}
                    {user ? (
                        <div className="ml-3 flex items-center gap-2 border-l border-border pl-3">
                            <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5">
                                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium text-foreground">{user.nama}</span>
                                <span className="rounded-full bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                                    {user.role}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="ml-3">
                            <Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                                Masuk
                            </Button>
                        </Link>
                    )}
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

                    {/* Mobile alert for psychologist */}
                    {user?.role === "psikolog" && alertPatients.length > 0 && (
                        <div className="mt-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Bell className="h-4 w-4" />
                                Alert Pasien
                                <span className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white",
                                    criticalCount > 0 ? "bg-red-500" : "bg-amber-500"
                                )}>
                                    {alertPatients.length}
                                </span>
                            </div>
                            <div className="mt-2 space-y-1.5">
                                {alertPatients.map((p) => (
                                    <Link
                                        key={p.patientId}
                                        href={`/psikolog/pasien/${p.patientId}`}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between rounded-md bg-card px-3 py-2 text-xs transition-colors hover:bg-muted"
                                    >
                                        <span className="font-medium text-foreground">{p.patientName}</span>
                                        <span className={cn(
                                            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                                            p.alertLevel === "critical"
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {p.alertLevel === "critical" ? "Kritis" : "Perhatian"}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {user ? (
                        <div className="mt-2 border-t border-border pt-2">
                            <div className="flex items-center gap-2 px-4 py-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{user.nama}</span>
                                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={() => { handleLogout(); setOpen(false); }}
                                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="mt-2 block rounded-lg bg-hero-gradient px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

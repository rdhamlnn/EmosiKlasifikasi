"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Loader2, Eye, EyeOff } from "lucide-react";
import { login, register } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false); // default: register
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nama, setNama] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (isLogin) {
                const result = login(email, password);
                if (result.success && result.user) {
                    toast.success(`Selamat datang, ${result.user.nama}!`);
                    router.push(result.user.role === "psikolog" ? "/psikolog" : "/dashboard");
                } else {
                    toast.error(result.error || "Login gagal");
                }
            } else {
                if (!nama.trim()) {
                    toast.error("Nama tidak boleh kosong");
                    setLoading(false);
                    return;
                }
                const result = register(email, nama, password, "pasien");
                if (result.success && result.user) {
                    toast.success("Registrasi berhasil!");
                    router.push("/dashboard");
                } else {
                    toast.error(result.error || "Registrasi gagal");
                }
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md px-4">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground shadow-lg">
                        <BrainCircuit className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isLogin ? "Masuk ke Akun" : "Buat Akun Baru"}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {isLogin
                            ? "Masuk untuk melanjutkan ke dashboard Anda"
                            : "Daftar untuk mulai monitoring kesehatan mental Anda"}
                    </p>
                </div>

                {/* Form */}
                <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        placeholder="Masukkan nama lengkap"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Masukkan password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : isLogin ? (
                                    "Masuk"
                                ) : (
                                    "Daftar Sekarang"
                                )}
                            </Button>
                        </form>

                        {/* Toggle link */}
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            {isLogin ? (
                                <>
                                    Belum punya akun?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="font-semibold text-secondary hover:underline"
                                    >
                                        Daftar
                                    </button>
                                </>
                            ) : (
                                <>
                                    Sudah punya akun?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        className="font-semibold text-secondary hover:underline"
                                    >
                                        Masuk
                                    </button>
                                </>
                            )}
                        </p>

                        {/* Demo credentials */}
                        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Demo Akun
                            </p>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <p>
                                    <span className="font-medium text-foreground">Pasien:</span>{" "}
                                    pasien@demo.com / demo123
                                </p>
                                <p>
                                    <span className="font-medium text-foreground">Psikolog:</span>{" "}
                                    psikolog@demo.com / demo123
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    History,
    Trash2,
    AlertTriangle,
    Inbox,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from "@/lib/history";

const emotionColors: Record<string, string> = {
    Happy: "bg-accent text-secondary",
    Sad: "bg-accent text-primary",
    Angry: "bg-destructive/10 text-destructive",
    Fear: "bg-accent text-primary",
    Neutral: "bg-muted text-muted-foreground",
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function RiwayatPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleDeleteOne = (id: string) => {
        const updated = deleteHistoryItem(id);
        setHistory(updated);
        toast.success("1 data riwayat berhasil dihapus.");
    };

    const handleDeleteAll = () => {
        clearHistory();
        setHistory([]);
        toast.success("Seluruh data riwayat berhasil dihapus.");
    };

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                        <History className="h-3.5 w-3.5" />
                        Riwayat
                    </div>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        Riwayat Klasifikasi Emosi
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Daftar seluruh hasil klasifikasi emosi yang pernah dilakukan sebelumnya.
                    </p>
                </div>

                {/* Actions */}
                {history.length > 0 && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Total: <span className="font-semibold text-foreground">{history.length}</span> riwayat
                        </p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Semua
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                        Hapus Semua Riwayat?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini akan menghapus seluruh data riwayat klasifikasi. Data yang sudah dihapus tidak dapat dikembalikan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAll}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Ya, Hapus Semua
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}

                {/* Table or Empty State */}
                {history.length === 0 ? (
                    <Card className="border-border/50 shadow-card">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <Inbox className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-foreground">Belum Ada Riwayat</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Riwayat klasifikasi akan muncul di sini setelah Anda melakukan analisis emosi pada halaman Klasifikasi.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-border/50 shadow-card">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">No</TableHead>
                                            <TableHead>Teks Input</TableHead>
                                            <TableHead className="w-28">Emosi</TableHead>
                                            <TableHead className="w-28 text-right">Confidence</TableHead>
                                            <TableHead className="w-40">Waktu</TableHead>
                                            <TableHead className="w-16 text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map((item, i) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                                <TableCell className="max-w-xs">
                                                    <p className="truncate text-foreground" title={item.teksInput}>
                                                        {item.teksInput}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            (emotionColors[item.hasilEmosi] || "bg-muted text-muted-foreground") +
                                                            " font-semibold border-0"
                                                        }
                                                    >
                                                        {item.hasilEmosi}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {item.confidence.toFixed(2)}%
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(item.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Riwayat Ini?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Data riwayat klasifikasi ini akan dihapus secara permanen.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteOne(item.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

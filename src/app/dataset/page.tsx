"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Database, Tag, FileText, Info, BookOpen } from "lucide-react";

const emotionDistribution = [
    { emotion: "Happy", count: 1200, color: "hsl(142, 60%, 45%)" },
    { emotion: "Sad", count: 980, color: "hsl(220, 60%, 50%)" },
    { emotion: "Angry", count: 870, color: "hsl(0, 70%, 55%)" },
    { emotion: "Fear", count: 750, color: "hsl(30, 80%, 50%)" },
    { emotion: "Neutral", count: 1100, color: "hsl(210, 15%, 55%)" },
];

const sampleData = [
    { text: "Senang banget hari ini bisa ketemu teman lama!", emotion: "Happy" },
    { text: "Sedih rasanya ditinggal pergi jauh...", emotion: "Sad" },
    { text: "Kesel banget sama orang yang gak tanggung jawab!", emotion: "Angry" },
    { text: "Takut banget kalau nilainya jelek semester ini", emotion: "Fear" },
    { text: "Hari ini biasa aja sih, tidak ada yang spesial", emotion: "Neutral" },
];

const emotionColors: Record<string, string> = {
    Happy: "bg-accent text-secondary",
    Sad: "bg-accent text-primary",
    Angry: "bg-destructive/10 text-destructive",
    Fear: "bg-accent text-primary",
    Neutral: "bg-muted text-muted-foreground",
};

export default function DatasetPage() {
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                        <Database className="h-3.5 w-3.5" />
                        Penjelasan Dataset
                    </div>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        Dataset Emosi Media Sosial
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Dataset yang digunakan dalam sistem ini terdiri dari teks-teks media sosial
                        yang telah dilabeli secara manual ke dalam lima kelas emosi utama.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Database, label: "Total Data", value: "4.900" },
                        { icon: Tag, label: "Kelas Emosi", value: "5 Label" },
                        { icon: FileText, label: "Sumber", value: "Media Sosial" },
                        { icon: BookOpen, label: "Bahasa", value: "Indonesia" },
                    ].map((stat) => (
                        <Card key={stat.label} className="border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-secondary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Distribution Chart */}
                    <Card className="border-border/50 shadow-card">
                        <CardContent className="p-6">
                            <h3 className="mb-1 text-lg font-semibold text-foreground">Distribusi Label Emosi</h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Jumlah data untuk setiap kelas emosi dalam dataset
                            </p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={emotionDistribution} barSize={40}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 25% 90%)" />
                                        <XAxis dataKey="emotion" tick={{ fontSize: 12 }} stroke="hsl(220 15% 46%)" />
                                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 15% 46%)" />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "0.75rem",
                                                border: "1px solid hsl(214 25% 90%)",
                                                boxShadow: "var(--shadow-card)",
                                            }}
                                        />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                            {emotionDistribution.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emotion Labels Description */}
                    <Card className="border-border/50 shadow-card">
                        <CardContent className="p-6">
                            <h3 className="mb-1 text-lg font-semibold text-foreground">Label Emosi</h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Penjelasan singkat setiap kelas emosi yang digunakan
                            </p>
                            <div className="space-y-4">
                                {[
                                    { label: "Happy", desc: "Ekspresi kebahagiaan, kegembiraan, atau kepuasan terhadap suatu hal." },
                                    { label: "Sad", desc: "Ekspresi kesedihan, kekecewaan, atau kehilangan." },
                                    { label: "Angry", desc: "Ekspresi kemarahan, frustrasi, atau ketidakpuasan yang intens." },
                                    { label: "Fear", desc: "Ekspresi ketakutan, kekhawatiran, atau kecemasan." },
                                    { label: "Neutral", desc: "Teks yang tidak mengandung emosi spesifik yang dominan." },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                                        <Badge className={emotionColors[item.label] + " mt-0.5 font-semibold border-0"}>
                                            {item.label}
                                        </Badge>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sample Data Table */}
                <Card className="mt-8 border-border/50 shadow-card">
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-secondary">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Contoh Data</h3>
                                <p className="text-sm text-muted-foreground">
                                    Berikut beberapa contoh teks beserta label emosinya dari dataset
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-3 pr-4 text-left font-semibold text-foreground">No</th>
                                        <th className="py-3 pr-4 text-left font-semibold text-foreground">Teks</th>
                                        <th className="py-3 text-left font-semibold text-foreground">Label Emosi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((row, i) => (
                                        <tr key={i} className="border-b border-border/50 last:border-0">
                                            <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                                            <td className="py-3 pr-4 text-foreground">{row.text}</td>
                                            <td className="py-3">
                                                <Badge className={emotionColors[row.emotion] + " font-semibold border-0"}>
                                                    {row.emotion}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

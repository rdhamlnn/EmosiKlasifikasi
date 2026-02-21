"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
    result: {
        label: string;
        confidence: number;
        probabilities: { emotion: string; probability: number }[];
    };
}

const EMOTION_COLORS: Record<string, string> = {
    Happy: "hsl(175, 45%, 40%)",
    Sad: "hsl(220, 60%, 45%)",
    Angry: "hsl(0, 65%, 55%)",
    Fear: "hsl(280, 40%, 50%)",
    Neutral: "hsl(220, 15%, 55%)",
};

const ResultSection = ({ result }: Props) => (
    <section id="result" className="py-20">
        <div className="container mx-auto max-w-3xl px-4 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">Hasil Klasifikasi</h2>
            </div>

            {/* Main result */}
            <Card className="border-secondary/30 shadow-card text-center">
                <CardContent className="p-8">
                    <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Emosi Terdeteksi
                    </p>
                    <p className="mt-2 text-5xl font-bold text-gradient">{result.label}</p>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Confidence:{" "}
                        <span className="font-semibold text-foreground">
                            {result.confidence.toFixed(2)}%
                        </span>
                    </p>
                </CardContent>
            </Card>

            {/* Chart + Table */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-card">
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Distribusi Probabilitas
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={result.probabilities} layout="vertical">
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <YAxis dataKey="emotion" type="category" width={60} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v: number | undefined) => `${v ?? 0}%`} />
                                <Bar dataKey="probability" radius={[0, 6, 6, 0]}>
                                    {result.probabilities.map((entry) => (
                                        <Cell
                                            key={entry.emotion}
                                            fill={EMOTION_COLORS[entry.emotion] || "hsl(220,15%,55%)"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-card">
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Tabel Probabilitas
                        </h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Emosi</TableHead>
                                    <TableHead className="text-right">Probabilitas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.probabilities
                                    .sort((a, b) => b.probability - a.probability)
                                    .map((row) => (
                                        <TableRow
                                            key={row.emotion}
                                            className={row.emotion === result.label ? "bg-accent/50 font-semibold" : ""}
                                        >
                                            <TableCell>{row.emotion}</TableCell>
                                            <TableCell className="text-right">{row.probability}%</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Explanation box */}
            <Card className="border-secondary/20 bg-accent/30 shadow-card">
                <CardContent className="p-6">
                    <p className="text-sm leading-relaxed text-foreground">
                        Teks diklasifikasikan sebagai emosi{" "}
                        <span className="font-bold text-secondary">{result.label}</span> karena kata-kata
                        dominan memiliki probabilitas tertinggi pada kelas tersebut berdasarkan
                        perhitungan Naive Bayes dengan fitur TF-IDF.
                    </p>
                </CardContent>
            </Card>
        </div>
    </section>
);

export default ResultSection;

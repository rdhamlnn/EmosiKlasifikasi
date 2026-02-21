"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RotateCcw } from "lucide-react";
import ResultSection from "./ResultSection";
import { saveToHistory } from "@/lib/history";

interface EmotionResult {
    label: string;
    confidence: number;
    probabilities: { emotion: string; probability: number }[];
}

const MOCK_DELAY = 1800;

const simulateClassification = (text: string): EmotionResult => {
    const emotions = ["Happy", "Sad", "Angry", "Fear", "Neutral"];
    const seed = text.length % 5;
    const raw = emotions.map((_, i) => {
        const base = i === seed ? 0.5 + Math.random() * 0.3 : Math.random() * 0.15;
        return base;
    });
    const sum = raw.reduce((a, b) => a + b, 0);
    const normalized = raw.map((v) => v / sum);
    const maxIdx = normalized.indexOf(Math.max(...normalized));

    return {
        label: emotions[maxIdx],
        confidence: normalized[maxIdx] * 100,
        probabilities: emotions.map((e, i) => ({
            emotion: e,
            probability: Math.round(normalized[i] * 10000) / 100,
        })),
    };
};

const ClassificationSection = () => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<EmotionResult | null>(null);

    const handleClassify = () => {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        setTimeout(() => {
            const classificationResult = simulateClassification(text);
            setResult(classificationResult);
            saveToHistory({
                teksInput: text,
                hasilEmosi: classificationResult.label,
                confidence: classificationResult.confidence,
                probabilities: classificationResult.probabilities,
            });
            setLoading(false);
            setTimeout(() => {
                document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }, MOCK_DELAY);
    };

    const handleReset = () => {
        setText("");
        setResult(null);
    };

    return (
        <>
            <section id="classify" className="bg-muted/50 py-20">
                <div className="container mx-auto max-w-2xl px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl">Klasifikasi Emosi</h2>
                        <p className="mt-4 text-muted-foreground">
                            Masukkan teks dari media sosial untuk diklasifikasikan emosinya menggunakan
                            Naive Bayes Classifier.
                        </p>
                    </div>
                    <Card className="border-border/50 shadow-card">
                        <CardContent className="space-y-4 p-6">
                            <label className="text-sm font-medium text-foreground">
                                Teks Media Sosial
                            </label>
                            <Textarea
                                placeholder="Masukkan teks media sosial di sini..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={5}
                                className="resize-none bg-background"
                            />
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleClassify}
                                    disabled={!text.trim() || loading}
                                    className="flex-1 bg-hero-gradient text-primary-foreground hover:opacity-90"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Proses Klasifikasi Emosi"
                                    )}
                                </Button>
                                {result && (
                                    <Button variant="outline" onClick={handleReset}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Analisis Ulang
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {result && <ResultSection result={result} />}
        </>
    );
};

export default ClassificationSection;

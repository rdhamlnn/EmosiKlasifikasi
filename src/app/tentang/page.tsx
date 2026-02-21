import { Card, CardContent } from "@/components/ui/card";
import {
    Database,
    FileText,
    BrainCircuit,
    ShieldCheck,
    Eye,
    FileInput,
    Filter,
    BarChart3,
    CheckCircle2,
    Target,
    Users,
    GraduationCap,
} from "lucide-react";

const aboutCards = [
    {
        icon: Database,
        title: "Emotion Data",
        description:
            "Dataset emosi yang dikumpulkan dari teks media sosial, terdiri dari label emosi seperti Happy, Sad, Angry, Fear, dan Neutral.",
    },
    {
        icon: FileText,
        title: "Text Mining",
        description:
            "Teknik preprocessing teks meliputi tokenisasi, stopword removal, dan stemming untuk menghasilkan fitur TF-IDF yang optimal.",
    },
    {
        icon: BrainCircuit,
        title: "Naive Bayes Classifier",
        description:
            "Algoritma klasifikasi probabilistik yang menghitung posterior probability berdasarkan Teorema Bayes untuk menentukan kelas emosi.",
    },
];

const steps = [
    { icon: FileInput, label: "Input Teks", desc: "Masukkan teks media sosial" },
    { icon: Filter, label: "Preprocessing", desc: "Tokenisasi, stopword, stemming" },
    { icon: BarChart3, label: "TF-IDF Extraction", desc: "Bobot fitur kata" },
    { icon: BrainCircuit, label: "Naive Bayes", desc: "Perhitungan probabilitas kelas" },
    { icon: CheckCircle2, label: "Hasil Emosi", desc: "Label emosi terklasifikasi" },
];

export default function TentangPage() {
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Tentang Sistem
                    </div>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        Sistem Klasifikasi Emosi
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Sistem klasifikasi emosi ini menggunakan pendekatan machine learning berbasis
                        probabilistik untuk menganalisis sentimen dan emosi dari teks media sosial secara
                        transparan.
                    </p>
                </div>

                {/* Purpose Cards */}
                <div className="mb-16 grid gap-6 md:grid-cols-2">
                    <Card className="border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-secondary">
                                <Target className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Tujuan Sistem</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Sistem ini bertujuan untuk mengklasifikasikan emosi dari teks media sosial secara
                                otomatis menggunakan algoritma Naive Bayes Classifier. Hasil klasifikasi dapat
                                digunakan untuk analisis sentimen, riset akademis, dan pemahaman pola emosi publik.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-secondary">
                                <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Target Pengguna</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Ditujukan untuk mahasiswa, dosen, dan evaluator akademis yang membutuhkan
                                demonstrasi sistem klasifikasi teks berbasis AI yang transparan dan dapat
                                dijelaskan (Explainable AI) dalam konteks tugas akhir dan seminar proposal.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Technology Cards */}
                <div className="mb-16">
                    <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Komponen Utama Sistem</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {aboutCards.map((card) => (
                            <Card
                                key={card.title}
                                className="group border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-secondary">
                                        <card.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">{card.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Process Flow */}
                <div className="mb-16">
                    <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Alur Proses Sistem</h2>
                    <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
                        Visualisasi tahapan pemrosesan teks hingga menghasilkan klasifikasi emosi.
                    </p>
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-0">
                        {steps.map((step, i) => (
                            <div key={step.label} className="flex items-center">
                                <div className="flex w-40 flex-col items-center text-center">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground shadow-lg">
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        {step.label}
                                    </span>
                                    <span className="mt-1 text-xs text-muted-foreground">{step.desc}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden h-0.5 w-10 bg-border md:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explainability */}
                <div>
                    <h2 className="mb-2 text-center text-2xl font-bold text-foreground">Explainable AI</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
                        Sistem ini dirancang dengan prinsip Explainable AI — setiap hasil dapat
                        dipertanggungjawabkan secara akademis.
                    </p>
                    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
                        <Card className="shadow-card">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-secondary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground">Perhitungan Naive Bayes</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Naive Bayes menghitung probabilitas posterior P(C|X) menggunakan Teorema Bayes.
                                    Probabilitas setiap kelas emosi dihitung berdasarkan prior probability dan
                                    likelihood dari setiap fitur kata yang muncul dalam teks input.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-card">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-secondary">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-foreground">Mengapa Explainable AI?</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Berbeda dengan model black-box, Naive Bayes memberikan transparansi penuh.
                                    Setiap prediksi dapat ditelusuri melalui kontribusi probabilitas tiap kata,
                                    sehingga pengguna memahami alasan di balik klasifikasi yang dihasilkan.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

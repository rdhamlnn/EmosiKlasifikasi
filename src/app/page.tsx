import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Smile,
  Frown,
  Angry,
  AlertTriangle,
  Minus,
  FileInput,
  Filter,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Naive Bayes Classifier",
    desc: "Algoritma probabilistik yang terbukti efektif untuk klasifikasi teks dengan akurasi tinggi.",
  },
  {
    icon: BarChart3,
    title: "TF-IDF Feature Extraction",
    desc: "Ekstraksi fitur otomatis yang mengukur kepentingan setiap kata dalam dokumen.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable AI",
    desc: "Setiap prediksi transparan dan dapat ditelusuri — bukan model black-box.",
  },
];

const emotions = [
  { icon: Smile, label: "Happy", color: "text-secondary" },
  { icon: Frown, label: "Sad", color: "text-primary" },
  { icon: Angry, label: "Angry", color: "text-destructive" },
  { icon: AlertTriangle, label: "Fear", color: "text-primary" },
  { icon: Minus, label: "Neutral", color: "text-muted-foreground" },
];

const steps = [
  { icon: FileInput, label: "Input Teks" },
  { icon: Filter, label: "Preprocessing" },
  { icon: BarChart3, label: "TF-IDF" },
  { icon: BrainCircuit, label: "Naive Bayes" },
  { icon: CheckCircle2, label: "Hasil Emosi" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-[0.03]" />
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-block rounded-full border border-secondary/30 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                Sistem Cerdas – Tugas Akhir
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Sistem Klasifikasi Emosi{" "}
                <span className="text-gradient">Pengguna Media Sosial</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                Berbasis Web Menggunakan Metode{" "}
                <span className="font-semibold text-foreground">Naive Bayes Classifier</span>{" "}
                dengan fitur TF-IDF untuk ekstraksi fitur teks secara otomatis.
              </p>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Sistem ini dirancang untuk menganalisis dan mengklasifikasikan emosi dari
                teks media sosial secara transparan dan dapat dijelaskan (explainable AI).
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-hero-gradient text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                >
                  <Link href="/klasifikasi">
                    Mulai Analisis Emosi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/tentang">Pelajari Sistem</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/hero-illustration.png"
                alt="Ilustrasi jaringan emosi dan AI"
                width={512}
                height={512}
                className="w-full max-w-lg rounded-2xl shadow-card"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emotion Labels */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            5 Kelas Emosi yang Diklasifikasikan
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {emotions.map((e) => (
              <div key={e.label} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-5 py-3 shadow-sm transition-all hover:shadow-card">
                <e.icon className={`h-5 w-5 ${e.color}`} />
                <span className="text-sm font-semibold text-foreground">{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Mengapa Sistem Ini?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Dibangun dengan pendekatan akademis dan metode yang teruji untuk menghasilkan
              klasifikasi emosi yang akurat dan dapat dipertanggungjawabkan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group border-border/50 shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-secondary transition-colors group-hover:bg-hero-gradient group-hover:text-primary-foreground">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Process Flow */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Alur Kerja Sistem</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Dari input teks hingga hasil klasifikasi emosi dalam 5 langkah sederhana.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center text-center w-28 sm:w-36">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground shadow-lg">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden h-0.5 w-8 bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 bg-hero-gradient shadow-lg">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center md:p-16">
              <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
                Siap Menganalisis Emosi Teks?
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-primary-foreground/80">
                Masukkan teks media sosial dan lihat bagaimana sistem mengklasifikasikan emosi
                secara transparan menggunakan Naive Bayes Classifier.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-card text-foreground shadow-lg hover:bg-card/90"
              >
                <Link href="/klasifikasi">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

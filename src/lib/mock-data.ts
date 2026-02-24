import type {
    DiaryEntry,
    EmotionResult,
    Feedback,
    Message,
    PsychologistNote,
    PatientStatus,
    AlertLevel,
    UserRole,
} from "./types";

const DIARY_KEY = "emotionsense_diary";
const NOTES_KEY = "emotionsense_notes";
const FEEDBACK_KEY = "emotionsense_feedback";
const MESSAGE_KEY = "emotionsense_messages";
const ALERT_OVERRIDE_KEY = "emotionsense_alert_overrides";

// ==================== Emotion Classification (Mock) ====================
const EMOTIONS = ["Happy", "Sad", "Angry", "Fear", "Neutral"];

export function simulateClassification(text: string): Omit<EmotionResult, "id" | "diaryEntryId" | "createdAt"> {
    const seed = text.length % 5;
    const raw = EMOTIONS.map((_, i) => {
        const base = i === seed ? 0.5 + Math.random() * 0.3 : Math.random() * 0.15;
        return base;
    });
    const sum = raw.reduce((a, b) => a + b, 0);
    const normalized = raw.map((v) => v / sum);
    const maxIdx = normalized.indexOf(Math.max(...normalized));

    return {
        label: EMOTIONS[maxIdx],
        confidence: normalized[maxIdx] * 100,
        probabilities: EMOTIONS.map((e, i) => ({
            emotion: e,
            probability: Math.round(normalized[i] * 10000) / 100,
        })),
    };
}

// ==================== Diary CRUD ====================
export function getDiaryEntries(userId?: string): DiaryEntry[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(DIARY_KEY);
        const all: DiaryEntry[] = raw ? JSON.parse(raw) : [];
        return userId ? all.filter((d) => d.userId === userId) : all;
    } catch {
        return [];
    }
}

export function saveDiaryEntry(
    userId: string,
    teks: string
): DiaryEntry {
    const entries = getDiaryEntries();
    const diaryId = crypto.randomUUID();
    const now = new Date().toISOString();
    const classification = simulateClassification(teks);

    const entry: DiaryEntry = {
        id: diaryId,
        userId,
        teks,
        emotionResult: {
            id: crypto.randomUUID(),
            diaryEntryId: diaryId,
            label: classification.label,
            confidence: classification.confidence,
            probabilities: classification.probabilities,
            createdAt: now,
        },
        createdAt: now,
    };

    entries.unshift(entry);
    localStorage.setItem(DIARY_KEY, JSON.stringify(entries));
    return entry;
}

// ==================== Psychologist Notes ====================
export function getNotes(patientId: string): PsychologistNote[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(NOTES_KEY);
        const all: PsychologistNote[] = raw ? JSON.parse(raw) : [];
        return all.filter((n) => n.patientId === patientId);
    } catch {
        return [];
    }
}

export function saveNote(
    psychologistId: string,
    patientId: string,
    note: string
): PsychologistNote {
    const all = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(NOTES_KEY) || "[]")
        : [];
    const newNote: PsychologistNote = {
        id: crypto.randomUUID(),
        psychologistId,
        patientId,
        note,
        createdAt: new Date().toISOString(),
    };
    all.unshift(newNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    return newNote;
}

// ==================== Feedback ====================
export function getFeedback(patientId: string): Feedback[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(FEEDBACK_KEY);
        const all: Feedback[] = raw ? JSON.parse(raw) : [];
        return all.filter((f) => f.patientId === patientId);
    } catch {
        return [];
    }
}

export function getUnreadFeedbackCount(patientId: string): number {
    return getFeedback(patientId).filter((f) => !f.isRead).length;
}

export function saveFeedback(
    psychologistId: string,
    patientId: string,
    message: string
): Feedback {
    const all = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]")
        : [];
    const newFeedback: Feedback = {
        id: crypto.randomUUID(),
        psychologistId,
        patientId,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
    };
    all.unshift(newFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
    return newFeedback;
}

export function markFeedbackRead(feedbackId: string) {
    const all: Feedback[] = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]")
        : [];
    const updated = all.map((f) =>
        f.id === feedbackId ? { ...f, isRead: true } : f
    );
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
}

// ==================== Two-Way Messages ====================
export function getMessages(patientId: string): Message[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(MESSAGE_KEY);
        const all: Message[] = raw ? JSON.parse(raw) : [];
        return all.filter((m) => m.patientId === patientId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
        return [];
    }
}

export function getUnreadMessageCount(userId: string, role: UserRole): number {
    if (typeof window === "undefined") return 0;
    try {
        const raw = localStorage.getItem(MESSAGE_KEY);
        const all: Message[] = raw ? JSON.parse(raw) : [];
        if (role === "pasien") {
            // Patient: count unread messages from psychologist in their conversation
            return all.filter((m) => m.patientId === userId && m.senderRole === "psikolog" && !m.isRead).length;
        } else {
            // Psychologist: count all unread messages from any patient
            return all.filter((m) => m.senderRole === "pasien" && !m.isRead).length;
        }
    } catch {
        return 0;
    }
}

export function sendMessage(
    senderId: string,
    senderRole: UserRole,
    patientId: string,
    message: string
): Message {
    const all: Message[] = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(MESSAGE_KEY) || "[]")
        : [];
    const newMsg: Message = {
        id: crypto.randomUUID(),
        senderId,
        senderRole,
        patientId,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
    };
    all.push(newMsg);
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(all));
    return newMsg;
}

export function markMessagesRead(patientId: string, readerRole: UserRole) {
    const all: Message[] = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(MESSAGE_KEY) || "[]")
        : [];
    // Mark as read all messages in this conversation sent by the OTHER role
    const updated = all.map((m) => {
        if (m.patientId === patientId && m.senderRole !== readerRole) {
            return { ...m, isRead: true };
        }
        return m;
    });
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(updated));
}

// ==================== Alert Calculation ====================
const NEGATIVE_EMOTIONS = ["Sad", "Angry", "Fear"];

export function calculateAlertLevel(entries: DiaryEntry[]): AlertLevel {
    if (entries.length === 0) return "safe";

    // negative percentage
    const negativeCount = entries.filter((e) =>
        NEGATIVE_EMOTIONS.includes(e.emotionResult.label)
    ).length;
    const negativePercentage = (negativeCount / entries.length) * 100;

    // consecutive negative days
    const sortedByDate = [...entries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let consecutiveNegativeDays = 0;
    const seen = new Set<string>();
    for (const entry of sortedByDate) {
        const dateKey = new Date(entry.createdAt).toLocaleDateString();
        if (seen.has(dateKey)) continue;
        seen.add(dateKey);
        if (NEGATIVE_EMOTIONS.includes(entry.emotionResult.label)) {
            consecutiveNegativeDays++;
        } else {
            break;
        }
    }

    if (negativePercentage > 60 || consecutiveNegativeDays >= 5) return "critical";
    if (negativePercentage >= 40 || consecutiveNegativeDays >= 3) return "warning";
    return "safe";
}

// ==================== Alert Override (Psychologist Control) ====================
interface AlertOverride {
    patientId: string;
    overriddenAt: string; // ISO date when psychologist marked safe
    overriddenBy: string; // psychologist userId
}

function getAlertOverrides(): AlertOverride[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(ALERT_OVERRIDE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getAlertOverride(patientId: string): AlertOverride | null {
    return getAlertOverrides().find((o) => o.patientId === patientId) || null;
}

// Check if override is still valid (no new negative entries after override)
function isOverrideValid(patientId: string): boolean {
    const override = getAlertOverride(patientId);
    if (!override) return false;

    const NEGATIVE = ["Sad", "Angry", "Fear"];
    const entries = getDiaryEntries(patientId);
    const overrideTime = new Date(override.overriddenAt).getTime();

    // Check if any negative entry was written AFTER the override
    const hasNewNegative = entries.some((e) => {
        const entryTime = new Date(e.createdAt).getTime();
        return entryTime > overrideTime && NEGATIVE.includes(e.emotionResult.label);
    });

    // If new negative entry exists, override is no longer valid
    return !hasNewNegative;
}

export function markPatientSafe(psychologistId: string, patientId: string) {
    const overrides = getAlertOverrides().filter((o) => o.patientId !== patientId);
    overrides.push({
        patientId,
        overriddenAt: new Date().toISOString(),
        overriddenBy: psychologistId,
    });
    localStorage.setItem(ALERT_OVERRIDE_KEY, JSON.stringify(overrides));
}

export function removePatientOverride(patientId: string) {
    const overrides = getAlertOverrides().filter((o) => o.patientId !== patientId);
    localStorage.setItem(ALERT_OVERRIDE_KEY, JSON.stringify(overrides));
}

// Effective alert level: respects psychologist override
export function getEffectiveAlertLevel(entries: DiaryEntry[], patientId: string): AlertLevel {
    const systemLevel = calculateAlertLevel(entries);
    if (systemLevel === "safe") return "safe";

    // If psychologist marked safe and no new negative entries since then
    if (isOverrideValid(patientId)) return "safe";

    return systemLevel;
}

export function getPatientStatus(
    patientId: string,
    patientName: string,
    patientEmail: string
): PatientStatus {
    const entries = getDiaryEntries(patientId);
    const negativeCount = entries.filter((e) =>
        NEGATIVE_EMOTIONS.includes(e.emotionResult.label)
    ).length;

    const sortedByDate = [...entries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let consecutiveNegativeDays = 0;
    const seen = new Set<string>();
    for (const entry of sortedByDate) {
        const dateKey = new Date(entry.createdAt).toLocaleDateString();
        if (seen.has(dateKey)) continue;
        seen.add(dateKey);
        if (NEGATIVE_EMOTIONS.includes(entry.emotionResult.label)) {
            consecutiveNegativeDays++;
        } else {
            break;
        }
    }

    return {
        patientId,
        patientName,
        patientEmail,
        alertLevel: getEffectiveAlertLevel(entries, patientId),
        totalEntries: entries.length,
        negativePercentage: entries.length > 0 ? Math.round((negativeCount / entries.length) * 100) : 0,
        lastEntryDate: entries.length > 0 ? entries[0].createdAt : "",
        consecutiveNegativeDays,
    };
}

// Get all patients with warning or critical status (for psychologist navbar)
export function getCriticalPatients(): PatientStatus[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem("emotionsense_users");
        const users = raw ? JSON.parse(raw) : [];
        const patients = users.filter((u: { role: string }) => u.role === "pasien");

        return patients
            .map((p: { id: string; nama: string; email: string }) =>
                getPatientStatus(p.id, p.nama, p.email)
            )
            .filter((s: PatientStatus) => s.alertLevel !== "safe");
    } catch {
        return [];
    }
}

// Get self-alert message for patient based on their own emotional state
export function getPatientSelfAlert(patientId: string): {
    level: AlertLevel;
    message: string;
    consecutiveDays: number;
} | null {
    const entries = getDiaryEntries(patientId);
    if (entries.length === 0) return null;

    const alertLevel = getEffectiveAlertLevel(entries, patientId);
    if (alertLevel === "safe") return null;

    // Count consecutive negative days
    const sortedByDate = [...entries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    let consecutiveDays = 0;
    const seen = new Set<string>();
    for (const entry of sortedByDate) {
        const dateKey = new Date(entry.createdAt).toLocaleDateString();
        if (seen.has(dateKey)) continue;
        seen.add(dateKey);
        if (NEGATIVE_EMOTIONS.includes(entry.emotionResult.label)) {
            consecutiveDays++;
        } else {
            break;
        }
    }

    const message =
        alertLevel === "critical"
            ? `Kami mendeteksi emosi negatif yang konsisten selama ${consecutiveDays} hari berturut-turut. Psikolog Anda sudah diberitahu dan siap membantu. Jangan ragu untuk menceritakan perasaanmu.`
            : `Emosi negatif terdeteksi selama ${consecutiveDays} hari terakhir. Ceritakan perasaanmu di diary — psikolog Anda siap memberikan dukungan.`;

    return { level: alertLevel, message, consecutiveDays };
}

// ==================== Filter by Period ====================
export type FilterPeriod = "daily" | "weekly" | "monthly";

export function filterEntriesByPeriod(
    entries: DiaryEntry[],
    period: FilterPeriod
): DiaryEntry[] {
    const now = new Date();
    let cutoff: Date;

    switch (period) {
        case "daily":
            cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case "weekly":
            cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "monthly":
            cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
    }

    return entries.filter((e) => new Date(e.createdAt) >= cutoff);
}

// ==================== Seed Demo Data ====================
export function seedDemoData() {
    if (typeof window === "undefined") return;

    // Check if already seeded
    if (localStorage.getItem("emotionsense_seeded")) return;

    // Create demo patient
    const demoPatientId = "demo-patient-1";
    const demoPatient = {
        id: demoPatientId,
        email: "pasien@demo.com",
        nama: "Andi Pratama",
        role: "pasien" as const,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Create demo psychologist
    const demoPsychologistId = "demo-psikolog-1";
    const demoPsychologist = {
        id: demoPsychologistId,
        email: "psikolog@demo.com",
        nama: "Dr. Sari Wulandari",
        role: "psikolog" as const,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Save users
    const users = [demoPatient, demoPsychologist];
    localStorage.setItem("emotionsense_users", JSON.stringify(users));
    localStorage.setItem(
        "emotionsense_users_pass",
        JSON.stringify([
            { userId: demoPatientId, password: "demo123" },
            { userId: demoPsychologistId, password: "demo123" },
        ])
    );

    // Create diary entries over the past 14 days
    const diaryTexts = [
        { text: "Hari ini saya merasa sangat bahagia karena dapat nilai bagus di ujian.", daysAgo: 14, emotion: "Happy" },
        { text: "Saya senang bisa menghabiskan waktu bersama keluarga di akhir pekan.", daysAgo: 13, emotion: "Happy" },
        { text: "Merasa sedikit cemas tentang presentasi besok, semoga berjalan lancar.", daysAgo: 12, emotion: "Fear" },
        { text: "Presentasi berjalan baik, saya lega dan senang dengan hasilnya.", daysAgo: 11, emotion: "Happy" },
        { text: "Hari biasa saja, tidak ada yang spesial terjadi hari ini.", daysAgo: 10, emotion: "Neutral" },
        { text: "Saya merasa sedih karena teman baik saya pindah ke kota lain.", daysAgo: 9, emotion: "Sad" },
        { text: "Masih merasa kesepian tanpa teman saya, sulit untuk fokus belajar.", daysAgo: 8, emotion: "Sad" },
        { text: "Kesal dengan teman sekelompok yang tidak mau bekerja sama.", daysAgo: 7, emotion: "Angry" },
        { text: "Hari ini agak lebih baik, mencoba untuk berpikir positif.", daysAgo: 6, emotion: "Neutral" },
        { text: "Saya takut tidak bisa menyelesaikan tugas akhir tepat waktu.", daysAgo: 5, emotion: "Fear" },
        { text: "Merasa sangat tertekan dengan banyaknya deadline yang menumpuk.", daysAgo: 4, emotion: "Sad" },
        { text: "Saya menangis tadi malam, merasa tidak mampu menghadapi semua ini.", daysAgo: 3, emotion: "Sad" },
        { text: "Tidak bisa tidur dengan baik, pikiran terus berputar tentang masalah.", daysAgo: 2, emotion: "Fear" },
        { text: "Hari ini sedikit lebih baik, teman-teman memberi semangat.", daysAgo: 1, emotion: "Happy" },
        { text: "Mencoba untuk tetap kuat, tapi kadang merasa lelah secara emosional.", daysAgo: 0, emotion: "Sad" },
    ];

    const entries: DiaryEntry[] = diaryTexts.map((d) => {
        const diaryId = crypto.randomUUID();
        const date = new Date(Date.now() - d.daysAgo * 24 * 60 * 60 * 1000);
        date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

        // Create deterministic probabilities based on the intended emotion
        const probs = EMOTIONS.map((e) => {
            if (e === d.emotion) return 45 + Math.random() * 30;
            return 2 + Math.random() * 10;
        });
        const total = probs.reduce((a, b) => a + b, 0);
        const normalized = probs.map((p) => Math.round((p / total) * 10000) / 100);

        return {
            id: diaryId,
            userId: demoPatientId,
            teks: d.text,
            emotionResult: {
                id: crypto.randomUUID(),
                diaryEntryId: diaryId,
                label: d.emotion,
                confidence: normalized[EMOTIONS.indexOf(d.emotion)],
                probabilities: EMOTIONS.map((e, i) => ({
                    emotion: e,
                    probability: normalized[i],
                })),
                createdAt: date.toISOString(),
            },
            createdAt: date.toISOString(),
        };
    });

    localStorage.setItem(DIARY_KEY, JSON.stringify(entries));

    // Create demo feedback
    const feedbacks: Feedback[] = [
        {
            id: crypto.randomUUID(),
            psychologistId: demoPsychologistId,
            patientId: demoPatientId,
            message: "Saya perhatikan emosi Anda cenderung sedih beberapa hari terakhir. Jangan ragu untuk menceritakan apa yang Anda rasakan. Anda tidak sendirian.",
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: crypto.randomUUID(),
            psychologistId: demoPsychologistId,
            patientId: demoPatientId,
            message: "Bagus sekali Anda tetap menulis diary secara rutin. Ini adalah langkah positif untuk kesehatan mental Anda. Terus semangat!",
            isRead: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));

    // Create demo notes
    const notes: PsychologistNote[] = [
        {
            id: crypto.randomUUID(),
            psychologistId: demoPsychologistId,
            patientId: demoPatientId,
            note: "Pasien menunjukkan pola emosi negatif yang meningkat dalam seminggu terakhir. Perlu monitoring lebih lanjut.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

    localStorage.setItem("emotionsense_seeded", "true");
}

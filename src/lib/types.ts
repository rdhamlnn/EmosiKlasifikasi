// ==================== User & Auth ====================
export type UserRole = "pasien" | "psikolog";

export interface User {
    id: string;
    email: string;
    nama: string;
    role: UserRole;
    createdAt: string;
}

// ==================== Diary & Emotions ====================
export interface EmotionProbability {
    emotion: string;
    probability: number;
}

export interface EmotionResult {
    id: string;
    diaryEntryId: string;
    label: string;
    confidence: number;
    probabilities: EmotionProbability[];
    createdAt: string;
}

export interface DiaryEntry {
    id: string;
    userId: string;
    teks: string;
    emotionResult: EmotionResult;
    createdAt: string;
}

// ==================== Psychologist ====================
export interface PsychologistNote {
    id: string;
    psychologistId: string;
    patientId: string;
    note: string;
    createdAt: string;
}

export interface Feedback {
    id: string;
    psychologistId: string;
    patientId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderRole: UserRole;
    patientId: string;     // always the patient's id (used as conversation key)
    message: string;
    isRead: boolean;
    createdAt: string;
}

// ==================== Alert ====================
export type AlertLevel = "safe" | "warning" | "critical";

export interface PatientStatus {
    patientId: string;
    patientName: string;
    patientEmail: string;
    alertLevel: AlertLevel;
    totalEntries: number;
    negativePercentage: number;
    lastEntryDate: string;
    consecutiveNegativeDays: number;
}

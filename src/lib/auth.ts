"use client";

import type { User, UserRole } from "./types";

const USERS_KEY = "emotionsense_users";
const SESSION_KEY = "emotionsense_session";

// ==================== Helpers ====================
function getUsers(): User[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ==================== Auth Functions ====================
export function register(
    email: string,
    nama: string,
    password: string,
    role: UserRole
): { success: boolean; error?: string; user?: User } {
    const users = getUsers();

    if (users.find((u) => u.email === email)) {
        return { success: false, error: "Email sudah terdaftar" };
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        email,
        nama,
        role,
        createdAt: new Date().toISOString(),
    };

    // store password alongside (simplified, not for production)
    const usersWithPass = JSON.parse(localStorage.getItem(USERS_KEY + "_pass") || "[]");
    usersWithPass.push({ userId: newUser.id, password });
    localStorage.setItem(USERS_KEY + "_pass", JSON.stringify(usersWithPass));

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
}

export function login(
    email: string,
    password: string
): { success: boolean; error?: string; user?: User } {
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
        return { success: false, error: "Email tidak ditemukan" };
    }

    const passwords = JSON.parse(localStorage.getItem(USERS_KEY + "_pass") || "[]");
    const match = passwords.find(
        (p: { userId: string; password: string }) =>
            p.userId === user.id && p.password === password
    );

    if (!match) {
        return { success: false, error: "Password salah" };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function getAllPatients(): User[] {
    return getUsers().filter((u) => u.role === "pasien");
}

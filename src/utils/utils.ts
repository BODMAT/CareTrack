import type { Work } from "../architecture/types";

export function getTheme() {
    const raw = localStorage.getItem('theme-storage-caretrack');
    try {
        const parsed = raw ? JSON.parse(raw) : null;
        const theme = parsed?.state?.theme;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        // fallback if JSON is broken
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
}

export function createAnimalID(petSpecies: string, name: string): string {
    const cleanedSpecies = petSpecies.trim().toLowerCase().replace(/\s+/g, "-");
    const cleanedName = name.trim().toLowerCase().replace(/\s+/g, "-");

    const now = new Date();
    const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    const random = Math.random().toString(36).slice(2, 6);

    return `${cleanedSpecies}_${cleanedName}_${timestamp}_${random}`;
}

export function createAssignmentID(work: Work): string {
    const cleanedWork = work.trim().toLowerCase().replace(/\s+/g, "-");

    const now = new Date();
    const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    const random = Math.random().toString(36).slice(2, 6);

    return `${cleanedWork}_${timestamp}_${random}`;
}

export function createCareID(name: string): string {
    const cleanedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const now = new Date();
    const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    const random = Math.random().toString(36).slice(2, 6);
    return `${cleanedName}_${timestamp}_${random}`;
}

export function checkBeforeDelete(action: () => void) {
    const answer = confirm("Зберегти зміни?");
    if (answer) {
        action();
    }
}
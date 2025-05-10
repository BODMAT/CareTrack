import { useEffect, useState } from "react";
import { auth, provider, db } from "../apis/firebase"; // db = getFirestore(app)
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { usePopupStore } from "../store/popup";

interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: "user" | "admin";
}

export const useAuth = () => {
    const { open } = usePopupStore();
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async (uid: string): Promise<"user" | "admin"> => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().role || "user";
        }
        return "user";
    };

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: "user",
                });
            }

            const role = (await getDoc(docRef)).data()?.role || "user";

            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role,
            });
            open("Notification", <p className="mb-5">Вхід за допомогою електронної пошти: {firebaseUser.email}</p>);
        } catch (error) {
            console.error("Помилка при логіні:", error);
            open("Error", <p className="mb-5">Помилка входу, спробуйте ще раз</p>);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            open("Notification", <p className="mb-5">Користувач вийшов</p>);
        } catch (error) {
            console.error("Помилка при виході:", error);
            open("Error", <p className="mb-5">Помилка виходу, спробуйте ще раз</p>);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const role = await fetchUserRole(firebaseUser.uid);
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { user, login, logout, loading };
};

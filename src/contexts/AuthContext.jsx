import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../services/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    deleteUser
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password) {
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    }

    async function login(email, password) {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            if (error.message && error.message.includes("The database connection is closing")) {
                console.warn("Firebase Auth: Transient IndexedDB error detected. This often happens during hot-reloading. Please refresh the page if this persists.");
                // Optionally retry or just let the user know
            }
            throw error;
        }
    }

    async function googleSignIn() {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    function deleteAccount() {
        return deleteUser(auth.currentUser);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        googleSignIn,
        logout,
        deleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

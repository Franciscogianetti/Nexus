
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthContext: Initializing session check...");

        try {
            // Check active sessions and sets the user
            supabase.auth.getSession()
                .then(({ data: { session }, error }) => {
                    if (error) {
                        console.error("AuthContext: Get session error:", error);
                    }
                    console.log("AuthContext: Session retrieved:", session?.user?.email || "No session");
                    setUser(session?.user ?? null);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("AuthContext: Promise rejected in getSession:", err);
                    setLoading(false);
                });

            // Listen for changes on auth state (logged in, signed out, etc.)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                console.log("AuthContext: Auth state changed:", _event, session?.user?.email || "No session");
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => {
                if (subscription) subscription.unsubscribe();
            };
        } catch (err) {
            console.error("AuthContext: Fatal error in useEffect:", err);
            setLoading(false);
        }
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

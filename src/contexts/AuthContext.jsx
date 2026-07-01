import { createContext, useEffect, useState, useCallback } from "react";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOut as authSignOut,
  getSession,
  onAuthStateChange,
} from "../services/authService";
import { createProfile, getProfile } from "../services/profileService";
import { createWallet, getWallet } from "../services/walletService";
import { generateAndStoreHash } from "../services/hashService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase auth user
  const [profile, setProfile] = useState(null); // profiles table row
  const [wallet, setWallet] = useState(null);   // wallets table row
  const [loading, setLoading] = useState(true); // initial session check

  // Load profile + wallet for a given user id
  const loadUserData = useCallback(async (userId) => {
    try {
      const [prof, wal] = await Promise.all([
        getProfile(userId),
        getWallet(userId),
      ]);
      // Append cache-busting timestamp to avatar URL so header updates immediately
      if (prof && prof.avatar_url) {
        prof.avatar_url = prof.avatar_url + (prof.avatar_url.includes("?") ? "&" : "?") + `t=${Date.now()}`;
      }
      setProfile(prof);
      setWallet(wal);
    } catch (err) {
      console.error("Failed to load user data:", err.message);
    }
  }, []);

  // Listen for auth state changes (login, logout, token refresh)
  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      } catch (err) {
        console.error("Session restore failed:", err.message);
      } finally {
        setLoading(false);
      }

      // Subscribe to future auth events
      unsubscribe = onAuthStateChange(async (session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setWallet(null);
        }
      });
    };

    init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadUserData]);

  // ── Auth actions ─────────────────────────────────────────────

  const login = async (email, password) => {
    const data = await signInWithEmail(email, password);
    // onAuthStateChange will fire and call loadUserData
    return data;
  };

  const loginWithGoogle = async () => {
    return signInWithGoogle(); // triggers OAuth redirect
  };

  const register = async (email, password, fullName, role) => {
    // 1. Create auth user
    const data = await signUpWithEmail(email, password, {
      full_name: fullName,
      role,
    });

    const userId = data.user?.id;
    if (!userId) {
      // Email confirmation required — profile created on first login
      return data;
    }

    // 2. Create profile
    const prof = await createProfile(userId, {
      full_name: fullName,
      email,
      role,
    });

    // 3. Create wallet (₹1,00,000 initial balance)
    const wal = await createWallet(userId);

    // 4. Generate & store blockchain hash for the new profile
    await generateAndStoreHash("profile", userId, {
      full_name: fullName,
      email,
      role,
    });

    setProfile(prof);
    setWallet(wal);

    return data;
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setWallet(null);
  };

  // Reload wallet (call after balance changes)
  const refreshWallet = async () => {
    if (user) {
      const wal = await getWallet(user.id);
      setWallet(wal);
    }
  };

  // Reload profile explicitly (call after profile updates)
  const refreshProfile = async () => {
    try {
      if (user) {
        const prof = await getProfile(user.id);
        if (prof && prof.avatar_url) {
          prof.avatar_url = prof.avatar_url + (prof.avatar_url.includes("?") ? "&" : "?") + `t=${Date.now()}`;
        }
        setProfile(prof);
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err.message);
    }
  };

  const value = {
    user,
    profile,
    wallet,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshWallet,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

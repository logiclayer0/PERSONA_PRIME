import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { API_BASE } from "../config";

// Optional: still talk to your FastAPI backend for user profile data
const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: { "Content-Type": "application/json" }
});

export const registerUser = async ({ email, password, display_name, role = "student" }) => {
  // 1. Create account in Firebase
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Set display name
  if (display_name) {
    await updateProfile(userCredential.user, { displayName: display_name });
  }

  // 3. Get Firebase ID token
  const token = await userCredential.user.getIdToken();

  // 4. (Optional) Also create user in your own backend so other features work
  try {
    await api.post(
      "/auth/register",
      {
        email,
        display_name: display_name || email.split("@")[0],
        password: "firebase-managed", // not used by backend when Firebase is primary
        role
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  } catch (err) {
    // Backend might be sleeping or already have the user – not critical for login
    console.warn("Backend register (optional) failed:", err?.response?.data || err.message);
  }

  return {
    access_token: token,
    user: {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      display_name: display_name || userCredential.user.displayName || email.split("@")[0]
    }
  };
};

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  return {
    access_token: token,
    user: {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      display_name: userCredential.user.displayName || email.split("@")[0]
    }
  };
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Keep these for compatibility with existing code
export const getMe = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return {
    id: user.uid,
    email: user.email,
    display_name: user.displayName
  };
};

export const updateReminder = async (payload) => {
  return (await api.post("/auth/reminder", payload)).data;
};

export const updateProfile = async (payload) => {
  if (auth.currentUser && payload.display_name) {
    await updateProfile(auth.currentUser, { displayName: payload.display_name });
  }
  try {
    return (await api.post("/auth/profile", payload)).data;
  } catch {
    return { display_name: payload.display_name };
  }
};

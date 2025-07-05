import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase/config"; // import app từ firebase config

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Lấy thông tin cần thiết từ user
    return {
      email: user.email,
      name: user.displayName,
      avatar: user.photoURL,
      uid: user.uid,
    };
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    throw error;
  }
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

const OAuth = ({ authMode }) => {
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const auth = getAuth();

      const provider =
        authMode === "google"
          ? new GoogleAuthProvider()
          : authMode === "facebook"
          ? new FacebookAuthProvider()
          : authMode === "twitter"
          ? new TwitterAuthProvider()
          : new GithubAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check if user exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // create user if does not exist
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="icon" onClick={handleAuth}>
      <i className={`fa-brands fa-${authMode} fa-lg`}></i>
    </div>
  );
};

export default OAuth;

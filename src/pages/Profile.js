import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collectionGroup, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

import Spinner from "../components/Spinner";
import alienIcon from "../assets/alien.png";
import firebaseIcon from "../assets/firebaseIcon.svg";

const Profile = () => {
  const auth = getAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setEmail(user.email);
      } else {
        navigate("/");
      }
    });
  }, [auth.currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (auth.currentUser.displayName !== name) {
        // update firebase authentication
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update firebase firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });

        setLoading(false);
        toast.success("Profile updated successfully");
      } else {
        setLoading(false);
        toast.error("Please enter a different name");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Unable to update profile");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent");
    } catch (error) {
      toast.error("Unable to send reset email");
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    toast.success("Signed out succesfully");
    navigate("/");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container profile">
      <img src={alienIcon} alt="alien" className="alien-icon"></img>
      <h1>Welcome {name.split(" ")[0]}!</h1>
      {!reset && (
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            className="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
          <input
            type="text"
            className="email"
            name="email"
            value={email ?? "Not Applicable"}
            disabled
          />
          <button type="submit">Update Profile</button>
          <p className="forgot-password" onClick={() => setReset(true)}>
            Reset Password
          </p>
        </form>
      )}

      {reset && (
        <form onSubmit={handleResetSubmit}>
          <input
            type="text"
            className="email"
            name="email"
            value={email}
            disabled
          />
          <button type="submit">Send Reset Email</button>
          <p className="forgot-password" onClick={() => setReset(false)}>
            Update Profile
          </p>
        </form>
      )}
      <div className="icon-container" onClick={handleSignOut}>
        <i className="fa-solid fa-right-from-bracket fa-lg"></i>
        <p>Sign Out</p>
      </div>

      <img src={firebaseIcon} alt="firebase-icon" className="firebase-icon" />
    </div>
  );
};

export default Profile;

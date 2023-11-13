import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

import Spinner from "../components/Spinner";
import OAuth from "../components/OAuth";
import firebaseIcon from "../assets/firebaseIcon.svg";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reset, setReset] = useState(false);

  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== password2) {
      setLoading(false);
      toast.error("Please ensure matching passwords");
    } else {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const user = userCredential.user;
        const userData = { name, email };
        userData.timestamp = serverTimestamp();
        await setDoc(doc(db, "users", user.uid), userData);

        setLoading(false);
        navigate("/profile");
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        setLoading(false);
        navigate("/profile");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleSignInToggle = (e) => {
    const container = document.getElementById("container");
    container.classList.remove("active");
  };

  const handleSignUpToggle = (e) => {
    const container = document.getElementById("container");
    container.classList.add("active");
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent");
    } catch (error) {
      toast.error("Unable to send reset email");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container" id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Sign Up</h1>
          <div className="social-icons">
            <OAuth authMode="google" />
            <OAuth authMode="facebook" />
            <OAuth authMode="twitter" />
            <OAuth authMode="github" />
          </div>
          <span>or sign up with email</span>
          <input
            type="text"
            className="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
          <input
            type="text"
            className="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            {showPassword ? (
              <i
                className="fa-solid fa-eye-slash"
                id="visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye"
                id="visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            )}
          </div>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="password2"
              name="password2"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="off"
              required
            />
            {showPassword ? (
              <i
                className="fa-solid fa-eye-slash"
                id="visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye"
                id="visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            )}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        {!reset && (
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <OAuth authMode="google" />
              <OAuth authMode="facebook" />
              <OAuth authMode="twitter" />
              <OAuth authMode="github" />
            </div>
            <span>or sign in with email</span>
            <input
              type="text"
              className="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                className="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
              />
              {showPassword ? (
                <i
                  className="fa-solid fa-eye-slash"
                  id="visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye"
                  id="visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                ></i>
              )}
            </div>
            <button type="submit">Sign In</button>
            <p className="forgot-password" onClick={() => setReset(true)}>
              Forgot Password
            </p>
          </form>
        )}

        {reset && (
          <form onSubmit={handleResetSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <OAuth authMode="google" />
              <OAuth authMode="facebook" />
              <OAuth authMode="twitter" />
              <OAuth authMode="github" />
            </div>
            <input
              type="text"
              className="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
            <button type="submit">Send Reset Email</button>
            <p className="forgot-password" onClick={() => setReset(false)}>
              Sign In
            </p>
          </form>
        )}
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Sign in to access full site features.</p>
            <button className="hidden" onClick={handleSignInToggle}>
              Sign In
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Hello Friend!</h1>
            <p>Register with us to access full site features.</p>
            <button className="hidden" onClick={handleSignUpToggle}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <img src={firebaseIcon} alt="firebase-icon" className="firebase-icon" />
    </div>
  );
};

export default Home;

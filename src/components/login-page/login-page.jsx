import React, { useState } from "react";
import "./login-page.css";
import user_icon from "./Assets/person.png";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect } from "react";

const Loginpage = ({ setIsLoggedIn }) => {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState(""); // Add state for the name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false); // State for forgot password

  //useEffect to check and set login status on component mount
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");

    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const handleCancel = () => {
    if (name || email || password) {
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((userCredential) => {
        console.log(userCredential);
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };
  const handleForgotPassword = async () => {
    try {
      // Send a password reset email
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async () => {
    if (action === "Sign Up") {
      // try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          localStorage.setItem("isLoggedIn", "true");
        })
        .catch((error) => {
          alert(error.message);
          // console.log(error.message);
        });
      // Set display name for the user
      // await updateProfile(userCredential.user, { displayName: name });
      // console.log("I am from try");
      // localStorage.setItem("isLoggedIn", "true");
      // } catch (err) {
      //   console.log("I am from err");
      //   console.error(err.message);
      // }
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // console.log(userCredential);
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        })
        .catch((error) => {
          setIsLoggedIn(false);
          alert("Credentials didn't match");
        });
    }
  };

  return (
    <div className="LoginContainer">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
      {action === "Sign Up" ? null : (
        <div className="forgot-password">
          Lost Password?{" "}
          <span onClick={() => setForgotPassword(true)}>Click Here!</span>
        </div>
      )}

      {/* Conditionally render the password reset UI */}
      {forgotPassword && (
        <div className="forgot-password-container">
          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="reset-password" onClick={handleForgotPassword}>
            Reset Password
          </button>
          <button className="cancel" onClick={() => setForgotPassword(false)}>
            Cancel
          </button>
        </div>
      )}
      <div className="submit-container">
        <button
          className="submit"
          // style={{ backgroundColor: "#a9a9a9" }}
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
        <button className="submit" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>

      {action === "Sign Up" ? (
        <div className="signup-container">
          {/* <button onClick={handleSignup}>Complete Signup</button> */}
          <div>
            Already a user?{" "}
            <button onClick={() => setAction("Login")}>Click</button>
          </div>
        </div>
      ) : (
        <div className="signup-container">
          <div>
            New user?{" "}
            <button onClick={() => setAction("Sign Up")}>Click</button>
          </div>
        </div>
      )}
      <div className="signup-container">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Loginpage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "../config/firebase"; // Import Supabase and Firebase instances
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase sign-in function
import "../styling/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Step 2: Retrieve user data from Supabase using the email
      const { data: userData, error: supabaseError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("email", firebaseUser.email) // Match based on email from Firebase
        .single();

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error("Error fetching user data from Supabase.");
      }

      // Log user data for debugging
      console.log("User data from Supabase:", userData);

      // Step 3: Check the "is_admin" field and navigate accordingly
      if (userData && userData.is_admin) {
        navigate("/adminpage");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      setError(err.message);
      console.log("Error logging in:", err);
    }
  };

  const goToRegister = () => {
    navigate("/"); // Navigate to register page
  };
  return (
    <div className="signup-container">
      <h1>LOST AND FOUND</h1>
      <div className="buttons">
        <button
          style={{
            backgroundColor: "white",
            color: "#36408e",
            border: "none",
            opacity: 1, // Keep opacity consistent
            cursor: "not-allowed", // Change cursor to indicate disabled state
            pointerEvents: "none", // Disable interaction
          }}
        >
          Login
        </button>
        <button
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "none",
          }}
          id="register"
          onClick={goToRegister}
        >
          Register
        </button>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <label id="signxup">Log in with your Account</label>
        <div className="emails">
          <input
            type="text"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="passwords">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Sign In</button> <br />
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import "./Register.css";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom";
import loginImg from "../../Assets/login .png";
import registerImg from "../../Assets/register.png";

const Register = ({ setIsRegistered }) => {
  const [signUpMode, setSignUpMode] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // API base URL
  const API_BASE = "http://localhost:5000"; 

  //Handle sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        setSignUpMode(false);
        setIsRegistered(true);
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleSignIn = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const result = await res.json();
    console.log(result); 
    if (res.ok) {
      // Store token and username in localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);

      alert("Login successful!");
      navigate("/dashboard");
    } else {
      alert(result.message || "Login failed.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred during login. Please try again.");
  }
};

  
  return (
    <div className={`auth-container ${signUpMode ? "auth-sign-up-mode" : ""}`}>
      <div className="auth-forms-container">
        <div className="auth-signin-signup">
          {/* Sign-in Form */}
          <form className="auth-sign-in-form" onSubmit={handleSignIn}>
            <h2 className="auth-title">Sign in</h2>
            <div className="auth-input-field">
              <PersonIcon />
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-input-field">
              <LockIcon />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <input type="submit" value="Login" className="auth-btn auth-solid" />
            <p className="auth-social-text">Or Sign in with social platforms</p>
            <div className="auth-social-media">
              <a href="#" className="auth-social-icon"><FacebookIcon /></a>
              <a href="#" className="auth-social-icon"><TwitterIcon /></a>
              <a href="#" className="auth-social-icon"><GoogleIcon /></a>
              <a href="#" className="auth-social-icon"><LinkedInIcon /></a>
            </div>
          </form>

          {/* Sign-up Form */}
          <form className="auth-sign-up-form" onSubmit={handleSignUp}>
            <h2 className="auth-title">Sign up</h2>
            <div className="auth-input-field">
              <PersonIcon />
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
              />
            </div>
            <div className="auth-input-field">
              <EmailIcon />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-input-field">
              <LockIcon />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </div>
            <input type="submit" className="auth-btn" value="Register" />
            <p className="auth-social-text">Or Sign up with social platforms</p>
            <div className="auth-social-media">
              <a href="#" className="auth-social-icon"><FacebookIcon /></a>
              <a href="#" className="auth-social-icon"><TwitterIcon /></a>
              <a href="#" className="auth-social-icon"><GoogleIcon /></a>
              <a href="#" className="auth-social-icon"><LinkedInIcon /></a>
            </div>
          </form>
        </div>
      </div>

      <div className="auth-panels-container">
        <div className="auth-panel auth-left-panel">
          <div className="auth-content">
          
            <h3>First time here?</h3>
            <p>Discover a world of possibilities! Join us and explore a vibrant community.</p>
            <button className="auth-btn auth-transparent" onClick={() => setSignUpMode(true)}>Sign up</button>
          </div>
          <img src={loginImg} alt="Join Us" className="auth-image" />
        </div>
        <div className="auth-panel auth-right-panel">
          <div className="auth-content">
            <h3>Welcome back!</h3>
            <p>Your journey continues — let’s pick up right where you left off</p>
            <button className="auth-btn auth-transparent" onClick={() => setSignUpMode(false)}>Sign in</button>
          </div>
          <img src={registerImg} className="auth-image auth-image1 " alt=""  />

        </div>
      </div>
    </div>
  );
};

export default Register;

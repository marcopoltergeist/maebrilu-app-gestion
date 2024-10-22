import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/picto/picto-maebrilu.png';
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour la soumission des données de connexion
    console.log("Email:", email, "Password:", password);

    navigate('/home');

  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Connection</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="maebrily@gmail.com"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="login-input"
        />
        <button type="submit" className="login-button">
          Connexion
        </button>
        <div className="login-icon">
          <img src={logo} alt="logo" className="flamingo" />
        </div>
      </form>
    </div>
  );
};

export default Login;

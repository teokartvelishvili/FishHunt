"use client";

import React, { useState } from "react";
import "./auth.css";

interface AuthModalProps {
  onClose: () => void; // მოდალის დახურვის ფუნქცია
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false); // რეგისტრაცია vs ავტორიზაცია

  return (
    <div className="modal">
      <div className="modal__content">
        {/* დახურვის ღილაკი */}
        <button className="modal__close" onClick={onClose}>
          ❌
        </button>

        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form>
          {/* საერთო ველები */}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {/* რეგისტრაციის დამატებითი ველი */}
          {isSignUp && <input type="text" placeholder="Full Name" required />}
          <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
        </form>

        {/* რეგისტრაციისა და ავტორიზაციის გადართვა */}
        <p className="sign-p" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </p>

        {/* სოციალური აიქონები */}
        <div className="social-icons">
          <span>🔵</span>
          <span>🟣</span>
          <span>🔴</span>
          <span>✉️</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import React from 'react';
import './Navbar.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Navbar = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      <h1>ChatPDF Clone</h1>
      <div className="nav-buttons">
        {user ? (
          <div className="user-info">
            <p className="welcome-message">Welcome, {user.displayName}!</p>
            <button className='auth-btn' onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useEffect } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import './SignInPage.css';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user])

    return (
        <div className="SignIn">
            <button type="button" className="login-with-google-btn" onClick={() => { signInWithGoogle() }}>
                Sign in with Google
            </button>
        </div>
    );
};

export default SignInPage;

import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const SignIn = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className="SignIn">
      <button onClick={() => signInWithGoogle()}>Sign In with Google</button>
    </div>
  );
};

export default SignIn;

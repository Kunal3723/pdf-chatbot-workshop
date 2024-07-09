import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const useAuth = () => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/signin');
        }
    }, [loading, user, navigate]);

    return;
};

export default useAuth;

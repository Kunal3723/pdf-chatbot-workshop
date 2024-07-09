import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useProjectIDAuth = (projectID) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectID) {
      navigate('/');
    }
  }, [projectID, navigate]);

  return;
};

export default useProjectIDAuth;

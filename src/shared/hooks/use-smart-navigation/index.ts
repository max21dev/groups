import { useNavigate } from 'react-router-dom';

export const useSmartNavigation = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    const canGoBack = window.history.state?.idx > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return { navigateBack };
};

import { useLocation, useNavigate } from 'react-router-dom';

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = () => {
    const hasNavigationState = location.state?.from;

    const hasInternalReferrer =
      document.referrer && document.referrer.includes(window.location.origin);

    const hasHistoryEntries = window.history.length > 1;

    if (hasNavigationState || (hasInternalReferrer && hasHistoryEntries)) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return { navigateBack };
};

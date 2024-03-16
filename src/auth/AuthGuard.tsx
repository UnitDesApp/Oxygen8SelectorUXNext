import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/login';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const [isDisplayLoadingScreen, setIsDisplayLoadingScreen] = useState<boolean>(true);

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsDisplayLoadingScreen(true);
      setTimeout(() => {
        setIsDisplayLoadingScreen(false);
      }, 2000);
    }
  }, [setIsDisplayLoadingScreen, isAuthenticated]);

  if (isDisplayLoadingScreen) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  return <> {children} </>;
}

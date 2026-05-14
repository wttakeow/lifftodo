import { useState, useEffect } from 'react';
import liff from '@line/liff';

export const useLiff = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // 1. Initialize LIFF
        await liff.init({ 
          liffId: import.meta.env.VITE_LIFF_ID 
        });

        // 2. Check Login Status
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } else {
          // If not logged in, you might want to trigger login
          // For a landing page, we usually wait for the user to click "Login"
          console.log("User not logged in");
        }

        setIsReady(true);
      } catch (err) {
        console.error("LIFF Initialization Error:", err);
        setError(err);
        setIsReady(false);
      }
    };

    initLiff();
  }, []);

  // Helper function to trigger login manually via a button
  const login = () => {
    liff.login();
  };

  return { profile, error, isReady, login, liff };
};

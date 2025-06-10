import { authorize, refresh, revoke } from 'react-native-app-auth';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webClientId = '14151508240-cn9bb77mknbkmp10tcm10t7tm71e1mt0.apps.googleusercontent.com';

// Configuration for Google OAuth
const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId: webClientId,
  redirectUrl: 'fillup:/oauth2callback',
  scopes: ['openid', 'profile', 'email'],
};

export type GoogleUser = {
  email: string;
  name: string;
  picture: string;
};

export function useGoogleAuth(onAuthSuccess: (user: GoogleUser) => void, onAuthError?: (error: string) => void) {
  const [isLoading, setIsLoading] = useState(false);

  const promptAsync = async () => {
    try {
      setIsLoading(true);
      const result = await authorize(googleConfig);
      
      if (result?.idToken) {
        const user = parseJwt(result.idToken);
        if (user && user.email && user.name && user.picture) {
          // Store auth tokens
          await AsyncStorage.setItem('@fillup_auth_token', result.accessToken);
          if (result.refreshToken) {
            await AsyncStorage.setItem('@fillup_refresh_token', result.refreshToken);
          }
          
          // Store user profile
          const userProfile = {
            id: `google-user-${Date.now()}`,
            email: user.email,
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            mobileNumber: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          await AsyncStorage.setItem('@fillup_user_data', JSON.stringify(userProfile));
          
          onAuthSuccess({
            email: user.email,
            name: user.name,
            picture: user.picture,
          });
        } else if (onAuthError) {
          onAuthError('Failed to extract user info from Google token');
        }
      } else if (onAuthError) {
        onAuthError('No id_token returned from Google');
      }
    } catch (error) {
      if (onAuthError) {
        onAuthError(error instanceof Error ? error.message : 'Google authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { promptAsync, isLoading };
}

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
} 
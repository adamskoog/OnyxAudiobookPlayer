import { checkToken, signIn, validatePin } from './Api';
import {
  SETTINGS_KEYS, loadSettingFromStorage, saveSettingToStorage, removeSettingFromStorage,
} from '../utility/settings';

// Action = GET_TOKEN
export const getAuthTokenFromStorage = (): string | null => {
  // Attempt to get the token from browser local storage.
  const token = loadSettingFromStorage(SETTINGS_KEYS.token);
  if (token && token !== '') return token;
  return null;
};

export const logout = (): void => {
  // Might need to do more here, clear settings??
  removeSettingFromStorage(SETTINGS_KEYS.token);
};

// previously 'checkToken'
// Main.js -> processLogin
// Action = CHECK_TOKEN
export const validateToken = async (token: string): Promise<any> => {
  const userInfo = await checkToken(token);

  if (userInfo.message) {
    logout();
    return { message: userInfo.message };
  }
  return { user: userInfo };
};

export const getAuthenticationId = (): string | null => {
  const authId = loadSettingFromStorage(SETTINGS_KEYS.loginRedirectId);
  if (authId && authId !== '') return authId;
  return null;
};

export const prepareLoginRequest = async (): Promise<any> => {
  const redirectInfo = await signIn();

  saveSettingToStorage(SETTINGS_KEYS.loginRedirectId, redirectInfo.id);

  return { url: redirectInfo.redirectUrl };
};

export const validateAuthId = async (authId: string): Promise<any> => {
  const regInfo = await validatePin(authId);

  removeSettingFromStorage(SETTINGS_KEYS.loginRedirectId);
  saveSettingToStorage(SETTINGS_KEYS.token, regInfo.authToken);
  saveSettingToStorage(SETTINGS_KEYS.clientIdentifier, '616647cf-a68b-4474-8b4f-3ad72ed95cf9');

  return { token: regInfo.authToken };
};

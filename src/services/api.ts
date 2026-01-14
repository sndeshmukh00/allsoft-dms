import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Move it to ENV file later
const BASE_URL = 'https://apis.allsoft.co/api/documentManagement';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add token in all the apis by default
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export const generateOTP = async (mobileNumber: string) => {
  try {
    const response = await apiClient.post('/generateOTP', { mobile_number: mobileNumber });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateOTP = async (mobileNumber: string, otp: string) => {
  try {
    const response = await apiClient.post('/validateOTP', { mobile_number: mobileNumber, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDocumentEntry = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/saveDocumentEntry', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentTags = async (term: string = '') => {
  try {
    const response = await apiClient.post('/documentTags', { term });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDocumentEntry = async (searchParams: any) => {
  try {
    const response = await apiClient.post('/searchDocumentEntry', searchParams);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// asycnStorage local apis
export const storeToken = async (token: string) => {
  await AsyncStorage.setItem('auth_token', token);
};

export const storeUser = async (user: { userId: string; userName: string }) => {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
};

export const getToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const clearToken = async () => {
    await AsyncStorage.removeItem('auth_token');
};

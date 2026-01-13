import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CustomText } from '../../components/ui';
import { ScreenLayout } from '../../components/layout';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { sanitizeNumbersOnly } from '../../utils/sanitize';
import { validateOTP } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = ({ route }: any) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleNumberChange = (text: string) => {
    const cleanedOTP = sanitizeNumbersOnly(text);
    setOtp(cleanedOTP);
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await validateOTP(mobileNumber, otp);
      setLoading(false);
      if (response && response?.data && response?.data?.token) {
        await signIn(response.data.token);
      } else {
        Alert.alert('Login Failed', 'No access token received.');
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Invalid OTP or Verification Failed.');
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.content}>
        <CustomText style={styles.title} size={28} weight="bold" color="#333">
          Verify OTP
        </CustomText>
        <CustomText style={styles.subtitle} size={16} color="#666">
          Enter the OTP sent to +91 {mobileNumber}
        </CustomText>

        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={otp}
          onChangeText={handleNumberChange}
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText
              style={styles.buttonText}
              size={16}
              weight="600"
              color="#fff"
            >
              Verify
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: verticalScale(40),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(20),
    fontSize: moderateScale(16),
    color: '#333',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    letterSpacing: scale(5),
  },
  button: {
    backgroundColor: '#28a745',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});

export default OTPScreen;

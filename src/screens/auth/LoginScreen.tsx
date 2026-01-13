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
import { verticalScale, moderateScale } from '../../utils/responsive';
import { sanitizeNumbersOnly } from '../../utils/sanitize';

const LoginScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberChange = (text: string) => {
    const cleaned = sanitizeNumbersOnly(text);
    setMobileNumber(cleaned);
  };

  const handleSendOTP = async () => {
    if (mobileNumber.length < 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement otp generation api hit here
      setLoading(false);
      navigation.navigate('OTP', { mobileNumber });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'Failed to generate OTP.');
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.content}>
        <CustomText style={styles.title} size={28} weight="bold" color="#333">
          Login
        </CustomText>
        <CustomText style={styles.subtitle} size={16} color="#666">
          Enter your mobile number
        </CustomText>

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={handleNumberChange}
          maxLength={10}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendOTP}
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
              Send OTP
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
  },
  button: {
    backgroundColor: '#007AFF',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});

export default LoginScreen;

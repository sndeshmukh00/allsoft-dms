import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '../ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface HeaderProps {
  userName: string;
  onSignOut: () => void;
}

export const DashboardHeader = ({ userName, onSignOut }: HeaderProps) => (
  <View style={styles.header}>
    <View style={styles.titleWrapper}>
      <CustomText style={styles.title}>DMS</CustomText>
      <CustomText style={styles.greetingText} color="#333">
        Welcome, {userName}!
      </CustomText>
    </View>
    <TouchableOpacity style={styles.logoutBtn} onPress={onSignOut}>
      <CustomText style={styles.logoutText}>Logout</CustomText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(15),
    backgroundColor: '#fff',
  },
  titleWrapper: { width: '75%' },
  title: { fontSize: moderateScale(28), fontWeight: 'bold', color: '#333' },
  greetingText: { fontSize: moderateScale(16) },
  logoutBtn: {
    width: '25%',
    backgroundColor: '#FF3B30',
    padding: verticalScale(10),
    borderRadius: moderateScale(8),
  },
  logoutText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '../components/ui/';
import { ScreenLayout } from '../components/layout';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const DashboardScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ScreenLayout backgroundColor="#f5f5f5">
      <View style={styles.content}>
        <CustomText style={styles.title} size={28} weight="bold" color="#333">
          Document Management System
        </CustomText>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.card, styles.uploadCard]}
            onPress={() => {
              navigation.navigate('Upload');
            }}
          >
            <CustomText
              style={styles.cardTitle}
              size={20}
              weight="700"
              color="#333"
            >
              Upload Document
            </CustomText>
            <CustomText style={styles.cardDesc} size={14} color="#666">
              Add new files to the system
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.searchCard]}
            onPress={() => {
              navigation.navigate('Search');
            }}
          >
            <CustomText
              style={styles.cardTitle}
              size={20}
              weight="700"
              color="#333"
            >
              Search Documents
            </CustomText>
            <CustomText style={styles.cardDesc} size={14} color="#666">
              Find and view existing files
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.logoutCard]}
            onPress={() => {
              console.log('pressed');
              //   TODO: implement logout thing here
            }}
          >
            <CustomText
              style={[styles.cardTitle, styles.logoutText]}
              size={20}
              weight="700"
            >
              Logout
            </CustomText>
            <CustomText style={styles.cardDesc} size={14} color="#666">
              Sign out of the application
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    marginBottom: verticalScale(30),
    marginTop: verticalScale(20),
  },
  menuContainer: {
    flex: 1,
    gap: verticalScale(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  uploadCard: {
    borderLeftWidth: scale(5),
    borderLeftColor: '#007AFF',
  },
  searchCard: {
    borderLeftWidth: scale(5),
    borderLeftColor: '#FF9500',
  },
  logoutCard: {
    borderLeftWidth: scale(5),
    borderLeftColor: '#FF3B30',
    marginTop: 'auto',
  },
  cardTitle: {
    marginBottom: verticalScale(5),
  },
  logoutText: {
    color: '#FF3B30',
  },
  cardDesc: {
    color: '#666',
  },
});

export default DashboardScreen;

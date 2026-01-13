import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from '../../utils/responsive';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

const ScreenLayout = ({
  children,
  style,
  noPadding = false,
  backgroundColor = '#fff',
  barStyle = 'dark-content',
}: ScreenLayoutProps) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      <View
        style={[
          styles.content,
          !noPadding && { padding: moderateScale(20) },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenLayout;

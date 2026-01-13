import React from 'react';
import { Text, TextProps } from 'react-native';
import { moderateScale } from '../../utils/responsive';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  size?: number;
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  color?: string;
}

const CustomText = ({
  children,
  style,
  size = 14,
  weight = 'normal',
  color = '#000',
  ...props
}: CustomTextProps) => {
  const responsiveSize = moderateScale(size);

  return (
    <Text
      allowFontScaling={true}
      maxFontSizeMultiplier={1.2}
      // this wlil limit the  max scaling to avoid breaking of anyt layout
      style={[{ fontSize: responsiveSize, fontWeight: weight, color }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

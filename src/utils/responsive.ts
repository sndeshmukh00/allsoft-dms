import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const getResponsiveFontSize = (size: number) => {
  return moderateScale(size, 0.5);
};

export {
  scale,
  verticalScale,
  moderateScale,
  getResponsiveFontSize,
  width,
  height,
};

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { ScreenLayout } from '../components/layout';
import { CustomText } from '../components/ui';

const PreviewScreen = ({ route }: any) => {
  const { document } = route.params;
  const sourceUrl = document.file_url;
  const source = { uri: sourceUrl, cache: true };
  //   just a guess that is working fine as api is not giving file type in response and is only returning url
  const cleanUrl = sourceUrl?.split('?')[0].toLowerCase();
  const isPdf = cleanUrl?.endsWith('.pdf');
  const isImage = cleanUrl?.match(/\.(jpg|jpeg|png|gif)$/i);

  if (!sourceUrl) {
    return (
      <ScreenLayout>
        <CustomText>No file URL found for this document.</CustomText>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout noPadding backgroundColor="#000" barStyle="light-content">
      {isPdf ? (
        <Pdf
          trustAllCerts={false}
          source={source}
          style={styles.pdf}
          renderActivityIndicator={() => (
            <ActivityIndicator color="#007AFF" size="large" />
          )}
        />
      ) : isImage ? (
        <Image
          source={{ uri: sourceUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.center}>
          <CustomText>Preview not available for this file type.</CustomText>
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PreviewScreen;

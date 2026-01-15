import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '../ui';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

interface DocumentItemProps {
  item: any;
  onPreview: (item: any) => void;
  onDownload: (item: any) => void;
}

export const DocumentItem = ({
  item,
  onPreview,
  onDownload,
}: DocumentItemProps) => (
  <View style={styles.card}>
    <CustomText style={styles.title} size={16} weight="bold">
      {item?.document_remarks || 'Untitled Document'}
    </CustomText>
    <CustomText style={styles.meta} size={14} color="#666">
      {item?.major_head} - {item?.minor_head}
    </CustomText>
    <CustomText style={styles.date} size={12} color="#999">
      {item?.document_date}
    </CustomText>

    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.btnPreview}
        onPress={() => onPreview(item)}
      >
        <CustomText style={styles.textPreview} weight="500">
          Preview
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnDownload}
        onPress={() => onDownload(item)}
      >
        <CustomText style={styles.textDownload} weight="500">
          Download
        </CustomText>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
    elevation: 2,
    borderLeftWidth: scale(5),
    borderLeftColor: '#007AFF',
  },
  title: { marginBottom: verticalScale(5) },
  meta: { marginBottom: verticalScale(2) },
  date: { marginBottom: verticalScale(10) },
  actions: { flexDirection: 'row', gap: moderateScale(10) },
  btnPreview: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eef6ff',
    padding: verticalScale(6),
    borderRadius: moderateScale(15),
  },
  btnDownload: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: verticalScale(6),
    borderRadius: moderateScale(15),
  },
  textPreview: { color: '#007AFF', fontSize: moderateScale(12) },
  textDownload: { color: '#eef6ff', fontSize: moderateScale(12) },
});

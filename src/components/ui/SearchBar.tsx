import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '../ui';
import { moderateScale } from '../../utils/responsive';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onFilterPress: () => void;
}

export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  onFilterPress,
}: SearchBarProps) => (
  <View style={styles.container}>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder="Search documents..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity onPress={onSearch} style={styles.iconBtn}>
        <CustomText>🔍</CustomText>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
      <CustomText style={styles.filterText}>Filter</CustomText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: moderateScale(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: moderateScale(8),
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
  },
  input: { flex: 1, paddingVertical: moderateScale(10), color: '#333' },
  iconBtn: { padding: moderateScale(5) },
  filterBtn: { padding: moderateScale(10) },
  filterText: { color: '#007AFF', fontWeight: '600' },
});

import React, { useState } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { CustomText, Dropdown, ChipsInput } from '../ui';
import { moderateScale, verticalScale } from '../../utils/responsive';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  searchState: any;
}

export const FilterModal = ({
  visible,
  onClose,
  searchState,
}: FilterModalProps) => {
  const {
    majorHead,
    setMajorHead,
    minorHead,
    setMinorHead,
    minorHeads,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    tags,
    setTags,
    handleTagSearch,
    clearFilters,
    search,
  } = searchState;

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const apply = () => {
    search();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <CustomText size={18} weight="bold">
              Filters
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <CustomText size={18}>✕</CustomText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Dropdown
              label="Category"
              data={['Personal', 'Professional']}
              selectedItem={majorHead}
              onSelect={item => {
                setMajorHead(item);
                setMinorHead('');
              }}
            />
            {majorHead ? (
              <Dropdown
                label="Sub Category"
                data={minorHeads}
                selectedItem={minorHead}
                onSelect={setMinorHead}
              />
            ) : null}

            <CustomText style={styles.label} weight="500">
              Date Range
            </CustomText>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setOpenFrom(true)}
              >
                <CustomText>
                  {fromDate ? fromDate.toDateString() : 'From Date'}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setOpenTo(true)}
              >
                <CustomText>
                  {toDate ? toDate.toDateString() : 'To Date'}
                </CustomText>
              </TouchableOpacity>
            </View>

            <ChipsInput
              chips={tags}
              onChipsChange={setTags}
              onSearch={handleTagSearch}
              searchEnabled
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.clear]}
                onPress={clearFilters}
              >
                <CustomText>Clear</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.apply]}
                onPress={apply}
              >
                <CustomText style={styles.applyText}>Apply</CustomText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <DatePicker
        modal
        open={openFrom}
        date={fromDate || new Date()}
        mode="date"
        onConfirm={d => {
          setOpenFrom(false);
          setFromDate(d);
        }}
        onCancel={() => setOpenFrom(false)}
      />
      <DatePicker
        modal
        open={openTo}
        date={toDate || new Date()}
        mode="date"
        onConfirm={d => {
          setOpenTo(false);
          setToDate(d);
        }}
        onCancel={() => setOpenTo(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(20),
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  label: { marginTop: verticalScale(10), marginBottom: verticalScale(5) },
  dateRow: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  dateBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: moderateScale(15),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  btn: {
    flex: 1,
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  clear: { backgroundColor: '#f0f0f0' },
  apply: { backgroundColor: '#007AFF' },
  applyText: { color: '#fff', fontWeight: 'bold' },
});

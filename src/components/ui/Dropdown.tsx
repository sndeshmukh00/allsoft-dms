import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CustomText } from '../ui';
import { verticalScale, moderateScale } from '../../utils/responsive';

interface DropdownProps {
  label: string;
  data: string[];
  onSelect: (item: string) => void;
  selectedItem: string;
  placeholder?: string;
}

const Dropdown = ({
  label,
  data,
  onSelect,
  selectedItem,
  placeholder = 'Select Item',
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.label} weight="500">
        {label}
      </CustomText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <CustomText
          style={[styles.text, !selectedItem && styles.placeholder]}
          size={16}
        >
          {selectedItem || placeholder}
        </CustomText>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <CustomText style={styles.itemText} size={16} color="#333">
                    {item}
                  </CustomText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(20),
  },
  label: {
    marginBottom: verticalScale(8),
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000080',
  },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: '50%',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(20),
  },
  item: {
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    color: '#333',
  },
});

export default Dropdown;

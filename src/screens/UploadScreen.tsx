import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { launchCamera } from 'react-native-image-picker';
import { pick, types } from '@react-native-documents/picker';
import { getDocumentTags, saveDocumentEntry } from '../services/api';
import { ScreenLayout } from '../components/layout';
import { CustomText, Dropdown, ChipsInput } from '../components/ui';
import { moderateScale, verticalScale } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';

const MINOR_HEADS_PERSONAL = ['John', 'Tom', 'Emily'];
const MINOR_HEADS_PROFESSIONAL = ['Accounts', 'HR', 'IT', 'Finance'];

const UploadScreen = ({ navigation }: any) => {
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState<{ tag_name: string }[]>([]);
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { userData } = useAuth();

  const minorHeads =
    majorHead === 'Personal'
      ? MINOR_HEADS_PERSONAL
      : majorHead === 'Professional'
      ? MINOR_HEADS_PROFESSIONAL
      : [];

  const handleTagSearch = async (term: string) => {
    return await getDocumentTags(term);
  };

  const handleFilePick = async () => {
    try {
      const res = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: false,
      });
      setFile(res[0]);
    } catch {
      //   console.log('Picker Error or Cancelled:', err);
      Alert.alert('Unknown Error', 'Failed to pick file');
    }
  };

  const handleCameraPick = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setFile({
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName,
        size: asset.fileSize,
      });
    }
  };

  const handleSubmit = async () => {
    if (!majorHead || !minorHead || !file) {
      Alert.alert(
        'Missing Fields',
        'Please fill all required fields and select a file.',
      );
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}-${date.getFullYear()}`;

    const dataPayload = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: formattedDate,
      document_remarks: remarks,
      tags: tags,
      user_id: userData?.userId || '',
    };

    formData.append('data', JSON.stringify(dataPayload));

    try {
      const result = await saveDocumentEntry(formData);

      if (result?.status === true) {
        setUploading(false);
        Alert.alert('Success', 'Document uploaded successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        setUploading(false);
        Alert.alert('Error', 'Failed to upload document');
      }
    } catch (error) {
      setUploading(false);
      console.error('Upload error', error);
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Doc Date Picker */}
        <CustomText style={styles.label} weight="500">
          Document Date
        </CustomText>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setOpenDate(true)}
        >
          <CustomText>{date.toDateString()}</CustomText>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openDate}
          date={date}
          mode="date"
          onConfirm={selectedDate => {
            setOpenDate(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpenDate(false);
          }}
        />

        {/* Mjor Minor Dropdowns */}
        <Dropdown
          label="Category (Major Head)"
          data={['Personal', 'Professional']}
          selectedItem={majorHead}
          onSelect={item => {
            setMajorHead(item);
            setMinorHead('');
          }}
        />

        {majorHead ? (
          <Dropdown
            label="Sub Category (Minor Head)"
            data={minorHeads}
            selectedItem={minorHead}
            onSelect={setMinorHead}
          />
        ) : null}

        {/* Doc Tags */}
        <ChipsInput
          chips={tags}
          onChipsChange={setTags}
          onSearch={handleTagSearch}
          searchEnabled
        />

        {/* Remarks */}
        <CustomText style={styles.label} weight="500">
          Remarks
        </CustomText>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Enter remarks..."
          placeholderTextColor="#999"
        />

        {/* file Picker */}
        <CustomText style={styles.label} weight="500">
          Attachment
        </CustomText>
        <View style={styles.fileButtonContainer}>
          <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
            <CustomText style={styles.fileButtonText} weight="600" color="#fff">
              Browse File
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fileButton, styles.cameraButton]}
            onPress={handleCameraPick}
          >
            <CustomText style={styles.fileButtonText} weight="600" color="#fff">
              Take Photo
            </CustomText>
          </TouchableOpacity>
        </View>

        {file && (
          <View style={styles.filePreview}>
            <CustomText>Selected: {file.name}</CustomText>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, uploading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <CustomText
            style={styles.submitButtonText}
            size={18}
            weight="bold"
            color="#fff"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </CustomText>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(50),
  },
  label: {
    marginBottom: verticalScale(8),
    color: '#333',
  },
  dateButton: {
    padding: moderateScale(15),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(20),
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    backgroundColor: '#fff',
    marginBottom: verticalScale(20),
    fontSize: moderateScale(14),
    color: '#333',
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: 'top',
  },
  fileButtonContainer: {
    flexDirection: 'row',
    gap: moderateScale(15),
    marginBottom: verticalScale(20),
  },
  fileButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#17a2b8',
  },
  fileButtonText: {
    color: '#fff',
  },
  filePreview: {
    marginBottom: verticalScale(20),
    padding: moderateScale(10),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(8),
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: moderateScale(18),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
  },
});

export default UploadScreen;

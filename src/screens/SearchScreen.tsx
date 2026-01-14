import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { CustomText, ChipsInput, Dropdown } from '../components/ui';
import { getDocumentTags, searchDocumentEntry } from '../services/api';
import { ScreenLayout } from '../components/layout';
import { moderateScale, verticalScale } from '../utils/responsive';

const MINOR_HEADS_PERSONAL = ['John', 'Tom', 'Emily'];
const MINOR_HEADS_PROFESSIONAL = ['Accounts', 'HR', 'IT', 'Finance'];

const SearchScreen = () => {
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [tags, setTags] = useState<{ tag_name: string }[]>([]);
  const [searchText, setSearchText] = useState('');

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LENGTH = 10;

  const minorHeads =
    majorHead === 'Personal'
      ? MINOR_HEADS_PERSONAL
      : majorHead === 'Professional'
      ? MINOR_HEADS_PROFESSIONAL
      : [];

  const handleTagSearch = async (term: string) => {
    return await getDocumentTags(term);
  };

  const handleSearch = async (isLoadMore: boolean = false) => {
    if (isLoadMore) {
      if (!hasMore || loadingMore) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
      setSearched(true);
      setStart(0);
      setHasMore(true);
    }

    setModalVisible(false);

    const currentStart = isLoadMore ? start : 0;

    const payload = {
      major_head: majorHead,
      minor_head: minorHead,
      from_date: fromDate ? fromDate.toISOString().split('T')[0] : '',
      to_date: toDate ? toDate.toISOString().split('T')[0] : '',
      tags: tags,
      uploaded_by: '',
      start: currentStart,
      length: LENGTH,
      filterId: '',
      search: { value: searchText },
    };

    try {
      const response = await searchDocumentEntry(payload);
      const list = response?.data || [];

      if (isLoadMore) {
        setResults(prev => [...prev, ...list]);
        setStart(prev => prev + LENGTH);
      } else {
        setResults(list);
        setStart(LENGTH);
      }

    //   manually assuming this as api doesnt provide pagination properly
      if (list.length < LENGTH) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch documents');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // this will be called ehen user wants to search
  const loadData = () => {
    handleSearch(false);
  };

  // this will be called when user reaches end of list to load more as pagination
  const loadMore = () => {
    if (searched && hasMore && !loadingMore && !loading) {
      handleSearch(true);
    }
  };

  const clearFilters = () => {
    setMajorHead('');
    setMinorHead('');
    setFromDate(null);
    setToDate(null);
    setTags([]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.resultItem}>
      <CustomText style={styles.docTitle} size={16} weight="bold">
        {item?.document_remarks || 'Untitled Document'}
      </CustomText>
      <CustomText style={styles.docMeta} size={14} color="#666">
        {item?.major_head} - {item?.minor_head}
      </CustomText>
      <CustomText style={styles.docDate} size={12} color="#999">
        {item?.document_date}
      </CustomText>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            // TODO: preview logic here
          }}
        >
          <CustomText style={styles.actionText} weight="500">
            Preview
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            // TODO: download logic here
          }}
        >
          <CustomText style={styles.actionText} weight="500">
            Download
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenLayout noPadding>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={loadData}
          />
          <TouchableOpacity onPress={loadData} style={styles.searchIconBtn}>
            <CustomText>🔍</CustomText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setModalVisible(true)}
        >
          <CustomText style={styles.filterBtnText}>Filter</CustomText>
        </TouchableOpacity>
      </View>

      {/* searhc results list */}
      <View style={styles.resultsSection}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#007AFF"
                  style={styles.footerLoader}
                />
              ) : null
            }
            ListEmptyComponent={
              searched ? (
                <CustomText style={styles.emptyText} color="#666">
                  No documents found.
                </CustomText>
              ) : (
                <CustomText style={styles.emptyText} color="#666">
                  Use search or filters to find documents.
                </CustomText>
              )
            }
          />
        )}
      </View>

      {/* search filters modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText size={18} weight="bold">
                Filters
              </CustomText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                  onPress={() => setOpenFromDate(true)}
                >
                  <CustomText>
                    {fromDate ? fromDate.toDateString() : 'From Date'}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => setOpenToDate(true)}
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

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.clearBtn]}
                  onPress={clearFilters}
                >
                  <CustomText style={styles.modalBtnTextDark}>Clear</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.applyBtn]}
                  onPress={loadData}
                >
                  <CustomText style={styles.modalBtnTextLight}>
                    Apply & Search
                  </CustomText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
        <DatePicker
          modal
          open={openFromDate}
          date={fromDate || new Date()}
          mode="date"
          onConfirm={d => {
            setOpenFromDate(false);
            setFromDate(d);
          }}
          onCancel={() => setOpenFromDate(false)}
        />
        <DatePicker
          modal
          open={openToDate}
          date={toDate || new Date()}
          mode="date"
          onConfirm={d => {
            setOpenToDate(false);
            setToDate(d);
          }}
          onCancel={() => setOpenToDate(false)}
        />
      </Modal>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: moderateScale(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: moderateScale(8),
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
  },
  searchInput: {
    flex: 1,
    paddingVertical: moderateScale(10),
    fontSize: moderateScale(14),
    color: '#333',
  },
  searchIconBtn: {
    padding: moderateScale(5),
  },
  filterBtn: {
    padding: moderateScale(10),
  },
  filterBtnText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
    padding: moderateScale(15),
    backgroundColor: '#f9f9f9',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  docTitle: {
    marginBottom: verticalScale(5),
  },
  docMeta: {
    marginBottom: verticalScale(2),
  },
  docDate: {
    marginBottom: verticalScale(10),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(10),
  },
  actionBtn: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(12),
    backgroundColor: '#eef6ff',
    borderRadius: moderateScale(15),
  },
  actionText: {
    color: '#007AFF',
    fontSize: moderateScale(12),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(50),
    fontSize: moderateScale(16),
  },

  //   Modal styles filters
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(20),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  label: {
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10),
    color: '#333',
  },
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
  modalActions: {
    flexDirection: 'row',
    gap: moderateScale(15),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  modalBtn: {
    flex: 1,
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#f0f0f0',
  },
  applyBtn: {
    backgroundColor: '#007AFF',
  },
  loader: {
    marginTop: verticalScale(20),
  },
  listContent: {
    paddingBottom: verticalScale(20),
  },
  modalBtnTextDark: {
    color: '#333',
  },
  modalBtnTextLight: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerLoader: {
    marginVertical: verticalScale(20),
  },
});

export default SearchScreen;

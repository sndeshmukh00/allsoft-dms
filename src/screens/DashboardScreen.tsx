import React, { useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { CustomText, SearchBar, FilterModal } from '../components/ui';
import { ScreenLayout } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { useDocumentSearch } from '../hooks/useDocumentSearch';
import { DashboardHeader, DocumentItem } from '../components/dashboard/';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

const DashboardScreen = ({ navigation }: { navigation: any }) => {
  const { signOut, userData } = useAuth();
  const searchState = useDocumentSearch(); // Custom Hook for search
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScreenLayout backgroundColor="#f5f5f5" noPadding>
      <View style={styles.container}>
        {/* Header */}
        <DashboardHeader
          userName={userData?.userName || 'user'}
          onSignOut={signOut}
        />

        {/* Search & Filter Bar */}
        <SearchBar
          value={searchState.searchText}
          onChangeText={searchState.setSearchText}
          onSearch={searchState.search}
          onFilterPress={() => setModalVisible(true)}
        />

        {/* Results List */}
        <View style={styles.listContainer}>
          {searchState.loading ? (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={styles.activityIndicator}
            />
          ) : (
            <FlatList
              data={searchState.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <DocumentItem
                  item={item}
                  onPreview={doc =>
                    navigation.navigate('PreviewScreen', { document: doc })
                  }
                  onDownload={doc => console.log('Download', doc)}
                />
              )}
              contentContainerStyle={styles.listContent}
              onEndReached={searchState.loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                searchState.loadingMore ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : null
              }
              ListEmptyComponent={
                <CustomText style={styles.emptyText} color="#666">
                  {searchState.searched
                    ? 'No documents found.'
                    : 'Use search to find documents.'}
                </CustomText>
              }
            />
          )}
        </View>

        {/* FAB for add new doc */}
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate('Upload')}
        >
          <CustomText style={styles.fabText}>+ Add New</CustomText>
        </Pressable>

        {/* Filter mOdal */}
        <FilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          searchState={searchState}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    flex: 1,
    padding: moderateScale(15),
    backgroundColor: '#f9f9f9',
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: scale(20),
    borderRadius: 40,
    paddingHorizontal: 20,
    backgroundColor: 'green',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#fff' },
  activityIndicator: { marginTop: verticalScale(20) },
  listContent: { paddingBottom: verticalScale(100) },
});

export default DashboardScreen;

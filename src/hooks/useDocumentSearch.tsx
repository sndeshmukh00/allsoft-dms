import { useState } from 'react';
import { Alert } from 'react-native';
import { searchDocumentEntry, getDocumentTags } from '../services/api';

const MINOR_HEADS_PERSONAL = ['John', 'Tom', 'Emily'];
const MINOR_HEADS_PROFESSIONAL = ['Accounts', 'HR', 'IT', 'Finance'];
const PAGE_LENGTH = 10;

export const useDocumentSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<{ tag_name: string }[]>([]);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);

  const minorHeads =
    majorHead === 'Personal'
      ? MINOR_HEADS_PERSONAL
      : majorHead === 'Professional'
      ? MINOR_HEADS_PROFESSIONAL
      : [];

  const handleTagSearch = async (term: string) => await getDocumentTags(term);

  const fetchDocuments = async (isLoadMore: boolean = false) => {
    if (isLoadMore) {
      if (!hasMore || loadingMore) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
      setSearched(true);
      setStart(0);
      setHasMore(true);
    }

    const currentStart = isLoadMore ? start : 0;

    const payload = {
      major_head: majorHead,
      minor_head: minorHead,
      from_date: fromDate ? fromDate.toISOString().split('T')[0] : '',
      to_date: toDate ? toDate.toISOString().split('T')[0] : '',
      tags: tags,
      uploaded_by: '',
      start: currentStart,
      length: PAGE_LENGTH,
      filterId: '',
      search: { value: searchText },
    };

    try {
      const response = await searchDocumentEntry(payload);
      const list = response?.data || [];

      if (isLoadMore) {
        setResults(prev => [...prev, ...list]);
        setStart(prev => prev + PAGE_LENGTH);
      } else {
        setResults(list);
        setStart(PAGE_LENGTH);
      }

      if (list.length < PAGE_LENGTH) setHasMore(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch documents');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setMajorHead('');
    setMinorHead('');
    setFromDate(null);
    setToDate(null);
    setTags([]);
  };

  return {
    searchText,
    setSearchText,
    majorHead,
    setMajorHead,
    minorHead,
    setMinorHead,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    tags,
    setTags,
    results,
    loading,
    loadingMore,
    searched,
    minorHeads,
    handleTagSearch,
    search: () => fetchDocuments(false),
    loadMore: () => fetchDocuments(true),
    clearFilters,
  };
};

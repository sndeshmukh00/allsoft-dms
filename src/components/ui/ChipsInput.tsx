import { useState, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { CustomText } from '../ui';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { debounce } from 'lodash';

interface SearchedData {
  data: { label: string; id: string }[];
}

interface ChipsInputProps {
  chips: { label: string }[];
  onChipsChange: (chips: { label: string }[]) => void;
  onSearch: (term: string) => Promise<SearchedData>;
  searchEnabled?: boolean;
}

const ChipsInput = ({ chips, onChipsChange, onSearch, searchEnabled = false }: ChipsInputProps) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchTags = useCallback(
    async (term: string) => {
      try {
        const response = await onSearch(term);
        const list = response?.data || [];
        console.log('response', list);
        setSuggestions(list);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching tags', error);
      }
    },
    [onSearch],
  );

  const debouncedFetchTags = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length > 1) {
          fetchTags(text);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 500),
    [fetchTags],
  );

  const handleInputChange = useCallback(
    (text: string) => {
      setInput(text);
      if (searchEnabled) {
        debouncedFetchTags(text);
      }
    },
    [debouncedFetchTags, searchEnabled],
  );

  const addChip = (tagName: string) => {
    if (!chips.find(tag => tag.label === tagName)) {
      onChipsChange([...chips, { label: tagName }]);
    }
    setInput('');
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const removeChip = (index: number) => {
    const newChips = [...chips];
    newChips.splice(index, 1);
    onChipsChange(newChips);
  };

  const isChipSelected = (label: string) => {
    return chips.some(chip => chip.label.toLowerCase() === label.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.label} weight="500">
        Tags
      </CustomText>
      <View style={styles.chipsContainer}>
        {chips.map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => removeChip(index)}
          >
            <CustomText style={styles.chipText} size={14} color="#333">
              {chip.label} ×
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Add a tag..."
          value={input}
          onChangeText={handleInputChange}
          onSubmitEditing={() => input && addChip(input)}
          placeholderTextColor="#999"
        />
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map(item => {
              const label = item.label || item.label || item;
              const selected = isChipSelected(label);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.suggestionItem,
                    selected && styles.suggestionItemDisabled,
                  ]}
                  onPress={() => !selected && addChip(label)}
                  activeOpacity={selected ? 1 : 0.7}
                  disabled={selected}
                >
                  <CustomText
                    style={selected ? styles.suggestionTextDisabled : undefined}
                  >
                    {label} {selected ? '(Selected)' : ''}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(10),
    gap: scale(8),
  },
  chip: {
    backgroundColor: '#e1e1e1',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
  },
  chipText: {
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    backgroundColor: '#fff',
    fontSize: moderateScale(14),
    color: '#333',
  },
  suggestions: {
    maxHeight: verticalScale(150),
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    backgroundColor: '#fff',
    borderBottomLeftRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
    elevation: 2,
  },
  suggestionItem: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionItemDisabled: {
    backgroundColor: '#f9f9f9',
  },
  suggestionTextDisabled: {
    color: '#aaa',
  },
});

export default ChipsInput;

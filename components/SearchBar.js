import React from 'react';
import styled from 'styled-components/native';

const SearchContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const Input = styled.TextInput`
  background-color: ${props => props.theme.colors.surface};
  padding: 12px ${props => props.theme.spacing.medium}px;
  border-radius: 25px; /* Bo tròn viền cho giống thanh search hiện đại */
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const SearchBar = ({ keyword, onChange }) => {
  return (
    <SearchContainer>
      <Input
        placeholder="🔍 Tìm kiếm theo tiêu đề hoặc nội dung..."
        placeholderTextColor="#8E8E93"
        value={keyword}
        onChangeText={onChange} // Cập nhật từ khóa trực tiếp lên HomeScreen
        clearButtonMode="while-editing" // Hiện nút X xóa nhanh trên iPhone
      />
    </SearchContainer>
  );
};

export default SearchBar;
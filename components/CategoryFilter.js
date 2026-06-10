import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useCategory } from '../contexts/CategoryContext';

const FilterContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.medium}px;
  height: 40px;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${props => props.isActive ? props.theme.colors.primary : '#E5E5EA'};
  padding: 8px 16px;
  border-radius: 15px;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

const FilterText = styled.Text`
  color: ${props => props.isActive ? '#FFFFFF' : props.theme.colors.text};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  font-size: 14px;
`;

const CategoryFilter = () => {
  // Lấy danh mục hiện tại và hàm cập nhật từ Context API đã viết [cite: 22-23]
  const { currentCategory, setCurrentCategory } = useCategory();

  // Danh sách các danh mục hiển thị lên giao diện [cite: 7]
  const categories = [
    { key: 'All', label: 'Tất cả' },
    { key: 'Work', label: 'Công việc' },
    { key: 'Personal', label: 'Cá nhân' },
    { key: 'Ideas', label: 'Ý tưởng' },
  ];

  return (
    <FilterContainer>
      {/* ScrollView ngang giúp người dùng có thể vuốt qua lại nếu có nhiều danh mục */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <FilterButton
            key={cat.key}
            isActive={currentCategory === cat.key}
            onPress={() => setCurrentCategory(cat.key)} // Bấm vào để đổi danh mục lọc
          >
            <FilterText isActive={currentCategory === cat.key}>
              {cat.label}
            </FilterText>
          </FilterButton>
        ))}
      </ScrollView>
    </FilterContainer>
  );
};

export default CategoryFilter;
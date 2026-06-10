import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';

// --- GIAO DIỆN TẤM CARD GHI CHÚ BẰNG STYLED-COMPONENTS ---
const CardContainer = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: 12px;
  margin-bottom: ${props => props.theme.spacing.small}px;
  
  /* Đổi màu viền bên trái tùy theo danh mục ghi chú để phân loại trực quan */
  border-left-width: 6px;
  border-left-color: ${props => {
    if (props.category === 'Work') return props.theme.colors.work;
    if (props.category === 'Personal') return props.theme.colors.personal;
    return props.theme.colors.ideas;
  }};
  
  /* Tạo hiệu ứng đổ bóng nhẹ cho tấm card */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 2;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const CategoryBadge = styled.View`
  background-color: ${props => props.color}20; /* Thêm mã 20 vào cuối mã Hex để tạo nền mờ 12% */
  padding: 4px 8px;
  border-radius: 6px;
  margin-left: 8px;
`;

const CategoryText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.color};
`;

const Content = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 20px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  padding-top: 8px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 4px 8px;
`;

const DeleteText = styled.Text`
  color: #FF3B30;
  font-weight: bold;
  font-size: 14px;
`;
// --- KẾT THÚC GIAO DIỆN ---

const NoteItem = ({ note, onEdit, onDelete }) => {
  // Hàm lấy mã màu đại diện nhanh để tô điểm cho Badge danh mục
  const getCategoryColor = (cat) => {
    if (cat === 'Work') return '#FF9500';
    if (cat === 'Personal') return '#34C759';
    return '#AF52DE';
  };

  const categoryColor = getCategoryColor(note.category);

  return (
    // ✨ BỌC HIỆU ỨNG REANIMATED TẠI ĐÂY:
    // entering: Khi xuất hiện, ghi chú sẽ mờ dần và bay từ dưới lên (FadeInDown) với gia tốc lò xo (springify).
    // exiting: Khi bị xóa, ghi chú sẽ trượt bay sang trái mờ dần (FadeOutLeft) trong vòng 300ms.
    <Animated.View 
      entering={FadeInDown.springify()} 
      exiting={FadeOutLeft.duration(300)}
    >
      <CardContainer category={note.category} onPress={onEdit}>
        <CardHeader>
          <Title numberOfLines={1}>{note.title}</Title>
          <CategoryBadge color={categoryColor}>
            <CategoryText color={categoryColor}>
              {note.category === 'Work' ? 'Công việc' : note.category === 'Personal' ? 'Cá nhân' : 'Ý tưởng'}
            </CategoryText>
          </CategoryBadge>
        </CardHeader>
        
        {/* Giới hạn hiển thị tối đa 3 dòng nội dung để tránh card quá dài */}
        <Content numberOfLines={3}>{note.content}</Content>
        
        <Footer>
          <DateText>{note.createdAt || 'Mới tạo'}</DateText>
          
          {/* Nút bấm xóa có hiện hộp thoại cảnh báo trước khi xóa thực sự */}
          <DeleteButton onPress={() => {
            Alert.alert(
              'Xác nhận xóa',
              'Bạn có chắc chắn muốn xóa ghi chú này không?',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa ghi chú', style: 'destructive', onPress: () => onDelete(note.id) }
              ]
            );
          }}>
            <DeleteText>Xóa</DeleteText>
          </DeleteButton>
        </Footer>
      </CardContainer>
    </Animated.View>
  );
};

export default NoteItem;
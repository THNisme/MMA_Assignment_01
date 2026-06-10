import React from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';

// Import các công cụ đã làm ở các bước trước
import NoteForm from '../components/NoteForm';
import { addNote, updateNote } from '../redux/actions';
import { storageService } from '../services/storageService';

// --- GIAO DIỆN BẰNG STYLED-COMPONENTS ---
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.medium}px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: ${props => props.theme.spacing.large}px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px 0;
`;

const BackButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 500;
`;
// --- KẾT THÚC GIAO DIỆN ---

const EditNoteScreen = ({ noteToEdit, onBack }) => {
  const dispatch = useDispatch();
  
  // Lấy danh sách ghi chú hiện tại từ Redux để lát nữa cập nhật chuỗi dữ liệu mới
  const allNotes = useSelector(state => state.notes.items);

  // Mẹo kiểm tra: Nếu có `noteToEdit` truyền vào -> Nghĩa là đang ở chế độ SỬA (isEditing = true)
  const isEditing = !!noteToEdit;

  // Hàm xử lý khi người dùng bấm nút Submit trên NoteForm
  const handleFormSubmit = async (formValues) => {
    let updatedNotesArray = [];

    if (isEditing) {
      // 🛠 TRƯỜNG HỢP 1: SỬA GHI CHÚ ĐÃ CÓ 
      const updatedNote = { 
        ...noteToEdit, 
        ...formValues // Đè các nội dung mới (title, content, category) lên ghi chú cũ
      };
      
      // Gửi lệnh cập nhật lên bộ não Redux [cite: 26]
      dispatch(updateNote(updatedNote));
      
      // Tạo mảng mới đã thay thế ghi chú cũ để chuẩn bị lưu xuống bộ nhớ máy
      updatedNotesArray = allNotes.map(note => 
        note.id === noteToEdit.id ? updatedNote : note
      );
    } else {
      // ➕ TRƯỜNG HỢP 2: THÊM MỚI GHI CHÚ HOÀN TOÀN 
      const newNote = {
        id: Date.now().toString(), // Tạo một ID độc nhất bằng thời gian hiện tại
        ...formValues,
        createdAt: new Date().toLocaleDateString('vi-VN'), // Lưu ngày tạo định dạng Việt Nam
      };

      // Gửi lệnh thêm mới lên bộ não Redux [cite: 26]
      dispatch(addNote(newNote));
      
      // Thêm ghi chú mới vào mảng để chuẩn bị lưu xuống bộ nhớ máy
      updatedNotesArray = [...allNotes, newNote];
    }

    // Tiến hành lưu dữ liệu bền vững xuống máy bằng AsyncStorage thông qua service [cite: 8, 32]
    await storageService.saveNotes(updatedNotesArray);
    
    // Xử lý xong thì gọi hàm quay về màn hình chính
    onBack();
  };

  return (
    <Container>
      {/* Thanh Header phía trên cùng */}
      <Header>
        <BackButton onPress={onBack}>
          <BackButtonText>◁ Quay lại</BackButtonText>
        </BackButton>
        
        <Title>{isEditing ? 'Sửa Ghi Chú' : 'Thêm Ghi Chú'}</Title>
        
        {/* View trống này giúp căn giữa Tiêu đề chuẩn tỉ lệ */}
        <View style={{ width: 60 }} /> 
      </Header>

      {/* Lắp ráp chiếc Formik Form thần thánh đã làm ở bước trước vào đây */}
      <NoteForm
        initialValues={noteToEdit}
        onSubmitButtonText={isEditing ? 'Cập nhật ghi chú' : 'Tạo ghi chú mới'}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};

export default EditNoteScreen;
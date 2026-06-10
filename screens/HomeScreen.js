import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';

// Import các "bộ não" và dịch vụ chúng ta đã làm ở bước trước
import { useCategory } from '../contexts/CategoryContext';
import { setNotes, deleteNote } from '../redux/actions';
import { storageService } from '../services/storageService';

// Import các components
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import NoteItem from '../components/NoteItem';

// --- BẮT ĐẦU DỰNG GIAO DIỆN BẰNG STYLED-COMPONENTS ---
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.medium}px;
`;

const HeaderText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-top: 20px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 40px;
  font-size: 16px;
`;

const NoteTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const NoteContent = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Nút bấm hình tròn lơ lửng góc phải màn hình để thêm ghi chú nhanh
const FloatingActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  right: 30px;
  background-color: ${props => props.theme.colors.primary};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 5;
`;

const FabText = styled.Text`
  color: #FFFFFF;
  font-size: 32px;
  line-height: 35px;
  font-weight: bold;
`;
// --- KẾT THÚC DỰNG GIAO DIỆN ---

const HomeScreen = ({
    onNavigateToEdit,
    onNavigateToAdd,
}) => {
  const dispatch = useDispatch();
  
  // Lấy danh sách ghi chú từ kho chứa Redux toàn cục [cite: 11]
  const notes = useSelector(state => state.notes.items);
  
  // Lấy trạng thái danh mục đang chọn từ Context API [cite: 11]
  const { currentCategory } = useCategory();

  // Các trạng thái cục bộ để xử lý tìm kiếm và hiệu ứng tải dữ liệu
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Đọc dữ liệu bền vững từ AsyncStorage khi vừa mở ứng dụng lên
  useEffect(() => {
    const loadNotesFromStorage = async () => {
      const savedNotes = await storageService.getNotes();
      dispatch(setNotes(savedNotes)); // Đồng bộ vào Redux
    };
    loadNotesFromStorage();
  }, []);

  // Kéo xuống để đồng bộ/làm mới lại dữ liệu (Pull-to-refresh)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const savedNotes = await storageService.getNotes();
    dispatch(setNotes(savedNotes));
    setIsRefreshing(false);
  };

  // Hàm xử lý Xóa ghi chú (Được kích hoạt từ tấm card NoteItem truyền lên)
  const handleDeleteNote = async (id) => {
    // 1. Ra lệnh cho bộ não Redux xóa bỏ ghi chú này khỏi UI ngay lập tức
    dispatch(deleteNote(id));
    
    // 2. Lọc mảng cục bộ loại bỏ ghi chú vừa xóa để lưu đè lại vào AsyncStorage bền vững
    const remainingNotes = notes.filter(note => note.id !== id);
    await storageService.saveNotes(remainingNotes);
  };

  // Giả lập cuộn vô hạn (Infinite Scroll) tăng trải nghiệm tải mượt
  const handleLoadMore = () => {
    if (isLoadingMore) return;

    if (filteredNotes.length === 0) return;

    setIsLoadingMore(true);
    
    // Giả lập delay 1 giây để tạo cảm giác tải mượt mà, sau này có thể phân trang dữ liệu ở đây
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  // Bộ lọc kép: Kết hợp quét từ khóa chữ (Tiêu đề/Nội dung) VÀ Lọc theo tab danh mục
  const filteredNotes = notes.filter(note => {
    const matchesCategory = currentCategory === 'All' || note.category === currentCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container>
      <HeaderText>Ghi chú của tôi</HeaderText>

     <SearchBar keyword={searchKeyword} onChange={setSearchKeyword} />
     <CategoryFilter />

      {/* Danh sách hiển thị ghi chú bằng FlatList cực mượt */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Tạm thời hiển thị card đơn giản, lát nữa sẽ thay bằng component NoteItem xịn sò [cite: 18]
          <NoteItem 
            note={item} 
            onEdit={() => onNavigateToEdit(item)} // Bấm vào thân card để mở màn hình chỉnh sửa
            onDelete={handleDeleteNote}          // Bấm nút xóa để kích hoạt xử lý xóa
          />
        )}
        // Hiển thị chữ này nếu danh sách rỗng
        ListEmptyComponent={<EmptyText>Chưa có ghi chú nào. Hãy tạo mới ngay!</EmptyText>}
        
        // Cấu hình Pull-to-refresh [cite: 44]
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }

        // Cấu hình Infinite Scroll (Cuộn vô hạn) [cite: 44]
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1} // Cách đáy 10% là tự động kích hoạt tải thêm
        ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" color="#007AFF" /> : null}
      />

      {/* Nút bấm lơ lửng (+) giúp người dùng mở giao diện tạo ghi chú */}
      <FloatingActionButton onPress={onNavigateToAdd}>
        <FabText>+</FabText>
      </FloatingActionButton>
    </Container>
  );
};

export default HomeScreen;
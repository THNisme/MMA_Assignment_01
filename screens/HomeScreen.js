import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';

// Import các "bộ não" và dịch vụ chúng ta đã làm ở bước trước
import { useCategory } from '../contexts/CategoryContext';
import { setNotes } from '../redux/actions';
import { storageService } from '../services/storageService';

// Import các components
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

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

// Khung tạm thời cho từng Note Item trước khi chúng ta tách thành file riêng
const TempNoteCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.small}px;
  border-left-width: 5px;
  border-left-color: ${props => props.theme.colors.primary};
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
// --- KẾT THÚC DỰNG GIAO DIỆN ---

const HomeScreen = () => {
  const dispatch = useDispatch();
  
  // Lấy danh sách ghi chú từ kho chứa Redux toàn cục [cite: 11]
  const notes = useSelector(state => state.notes.items);
  
  // Lấy trạng thái danh mục đang chọn từ Context API [cite: 11]
  const { currentCategory } = useCategory();

  // Các trạng thái cục bộ để xử lý tìm kiếm và hiệu ứng tải dữ liệu
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // LỘC 1: Tự động chạy khi mở app - Đọc ghi chú từ AsyncStorage đổ vào Redux [cite: 42-43]
  useEffect(() => {
    const loadNotesFromStorage = async () => {
      const savedNotes = await storageService.getNotes();
      dispatch(setNotes(savedNotes)); // Đồng bộ vào Redux
    };
    loadNotesFromStorage();
  }, []);

  // LỘC 2: Xử lý Kéo xuống để làm mới (Pull-to-refresh) [cite: 3, 9]
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const savedNotes = await storageService.getNotes();
    dispatch(setNotes(savedNotes));
    setIsRefreshing(false);
  };

  // LỘC 3: Xử lý Tải thêm dữ liệu khi cuộn xuống đáy (Infinite Scroll) [cite: 3, 9]
  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    
    // Giả lập delay 1 giây để tạo cảm giác tải mượt mà, sau này có thể phân trang dữ liệu ở đây
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  // LỘC 4: Logic bộ lọc Ghi chú (Kết hợp cả tìm kiếm chữ và danh mục) [cite: 3, 6-7]
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Tạm thời hiển thị card đơn giản, lát nữa sẽ thay bằng component NoteItem xịn sò [cite: 18]
          <TempNoteCard>
            <NoteTitle>{item.title}</NoteTitle>
            <NoteContent numberOfLines={2}>{item.content}</NoteContent>
          </TempNoteCard>
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
    </Container>
  );
};

export default HomeScreen;
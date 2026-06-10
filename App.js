import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

// 1. Import Redux
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';

// 2. Import Context API
import { CategoryProvider } from './contexts/CategoryContext';

// 3. Import Theme (styled-components)
import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';

// 4. Import màn hình chính và màn hình chỉnh sửa ghi chú
import HomeScreen from './screens/HomeScreen';
import EditNoteScreen from './screens/EditNoteScreen';

export default function App() {

  // Quản lý xem đang hiển thị màn hình nào ('HOME' hoặc 'EDIT')
  const [currentScreen, setCurrentScreen] = useState('HOME');
  // Quản lý dữ liệu ghi chú đang muốn sửa (nếu bấm Thêm mới thì cái này bằng null)
  const [noteToEdit, setNoteToEdit] = useState(null);

  // Hàm chuyển sang màn hình Thêm mới
  const handleGoToAdd = () => {
    setNoteToEdit(null);
    setCurrentScreen('EDIT');
  };

  // Hàm chuyển sang màn hình Sửa
  const handleGoToEdit = (note) => {
    setNoteToEdit(note);
    setCurrentScreen('EDIT');
  };

  // Hàm quay về màn hình chính
  const handleGoBack = () => {
    setCurrentScreen('HOME');
    setNoteToEdit(null);
  };

  return (
    // Bọc Redux đầu tiên để quản lý toàn bộ dữ liệu ghi chú
    <ReduxProvider store={store}>
      {/* Bọc tiếp Context để quản lý bộ lọc danh mục */}
      <CategoryProvider>
        {/* Bọc ThemeProvider để tất cả các file đều xài chung bảng màu đã cấu hình */}
        <ThemeProvider theme={theme}>
          
          {/* SafeAreaView giúp giao diện không bị đè lên tai thỏ/thanh trạng thái của điện thoại */}
          <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
           
           {currentScreen === 'HOME' ? (
              <HomeScreen onNavigateToEdit={handleGoToEdit} onNavigateToAdd={handleGoToAdd} />
            ) : (
              <EditNoteScreen noteToEdit={noteToEdit} onBack={handleGoBack} />
            )}
            
          </SafeAreaView>

        </ThemeProvider>
      </CategoryProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Trùng với màu theme.colors.background
  },
});
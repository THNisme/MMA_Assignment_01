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

// 4. Import màn hình chính (Để tạm thời hiển thị lên màn hình)
import HomeScreen from './screens/HomeScreen';

export default function App() {
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
            
            {/* Hiển thị màn hình HomeScreen lên trước */}
            <HomeScreen />
            
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
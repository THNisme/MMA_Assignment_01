import AsyncStorage from '@react-native-async-storage/async-storage';

// Khóa định danh duy nhất để lưu danh sách ghi chú trong bộ nhớ máy
const STORAGE_KEY = '@note_app_notes';

export const storageService = {
  // 1. Hàm lưu danh sách ghi chú vào máy
  saveNotes: async (notes) => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú vào AsyncStorage:', error);
    }
  },

  // 2. Hàm đọc danh sách ghi chú từ máy ra
  getNotes: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      // Nếu có dữ liệu thì chuyển từ chuỗi ngược thành mảng JSON, nếu không có thì trả về mảng rỗng []
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Lỗi khi lấy ghi chú từ AsyncStorage:', error);
      return [];
    }
  }
};
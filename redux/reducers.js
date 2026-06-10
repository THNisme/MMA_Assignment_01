import { createSlice } from '@reduxjs/toolkit';

// Trạng thái ban đầu: App mới mở sẽ có danh sách ghi chú rỗng
const initialState = {
  items: [], 
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // 1. Đồng bộ dữ liệu từ AsyncStorage vào Redux khi mở app
    setNotes: (state, action) => {
      state.items = action.payload;
    },
    // 2. Thêm một ghi chú mới vào danh sách
    addNote: (state, action) => {
      state.items.push(action.payload);
    },
    // 3. Cập nhật/Sửa nội dung ghi chú
    updateNote: (state, action) => {
      const index = state.items.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload; // Thay thế ghi chú cũ bằng ghi chú mới
      }
    },
    // 4. Xóa ghi chú dựa vào ID 
    deleteNote: (state, action) => {
      state.items = state.items.filter(note => note.id !== action.payload);
    },
  },
});

// Xuất các hàm xử lý nội bộ của Slice ra ngoài
export const { setNotes, addNote, updateNote, deleteNote } = notesSlice.actions;
// Xuất reducer chính để cấu hình Store
export default notesSlice.reducer;
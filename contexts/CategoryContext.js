import React, { createContext, useState, useContext } from 'react';

// 1. Khởi tạo Context
const CategoryContext = createContext();

// 2. Tạo Provider Component để bọc bên ngoài Ứng dụng
export const CategoryProvider = ({ children }) => {
  // Trạng thái danh mục đang chọn, mặc định là 'All' (Tất cả)
  const [currentCategory, setCurrentCategory] = useState('All');

  return (
    <CategoryContext.Provider value={{ currentCategory, setCurrentCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

// 3. Tạo một Custom Hook ngắn gọn để các Component khác gọi dùng luôn cho lẹ
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory phải được sử dụng bên trong CategoryProvider');
  }
  return context;
};
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components/native';

// --- GIAO DIỆN BẰNG STYLED-COMPONENTS ---
const FormContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: 12px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  margin-top: 12px;
`;

const StyledInput = styled.TextInput`
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: 8px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  background-color: #FAFAFA;
`;

const ErrorText = styled.Text`
  color: #FF3B30;
  font-size: 13px;
  margin-top: 4px;
`;

const CategoryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CategoryButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.isSelected ? props.color : '#E5E5EA'};
  padding: 10px;
  margin: 0 4px;
  border-radius: 8px;
  align-items: center;
`;

const CategoryButtonText = styled.Text`
  color: ${props => props.isSelected ? '#FFFFFF' : '#1C1C1E'};
  font-weight: bold;
  font-size: 14px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: 8px;
  align-items: center;
  margin-top: 16px;
`;

const SubmitButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
`;
// --- KẾT THÚC GIAO DIỆN ---

// Định nghĩa quy tắc kiểm tra dữ liệu bằng Yup (Validation Schema) 
const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề không được để trống')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  content: Yup.string()
    .required('Nội dung không được để trống'),
  category: Yup.string()
    .required('Vui lòng chọn một danh mục'),
});

const NoteForm = ({ initialValues, onSubmitButtonText, onSubmit }) => {
  // Giá trị mặc định khi tạo ghi chú mới (nếu không có dữ liệu truyền vào từ màn hình sửa)
  const defaultValues = initialValues || {
    title: '',
    content: '',
    category: 'Work', // Mặc định chọn danh mục Công việc
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={NoteValidationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);   // Gọi hàm xử lý lưu dữ liệu từ màn hình cha truyền xuống
        resetForm();        // Xóa sạch dữ liệu trên form sau khi bấm lưu thành công
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
        <FormContainer>
          
          {/* Ô nhập Tiêu đề */}
          <Label>Tiêu đề</Label>
          <StyledInput
            placeholder="Nhập tiêu đề ghi chú..."
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            value={values.title}
          />
          {touched.title && errors.title && <ErrorText>{errors.title}</ErrorText>}

          {/* Ô nhập Nội dung */}
          <Label>Nội dung</Label>
          <StyledInput
            placeholder="Nhập nội dung chi tiết..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={handleChange('content')}
            onBlur={handleBlur('content')}
            value={values.content}
          />
          {touched.content && errors.content && <ErrorText>{errors.content}</ErrorText>}

          {/* Chọn Danh mục (Work, Personal, Ideas) */}
          <Label>Danh mục</Label>
          <CategoryContainer>
            <CategoryButton 
              isSelected={values.category === 'Work'} 
              color="#FF9500" // Màu cam đại diện cho Work
              onPress={() => setFieldValue('category', 'Work')}
            >
              <CategoryButtonText isSelected={values.category === 'Work'}>Công việc</CategoryButtonText>
            </CategoryButton>

            <CategoryButton 
              isSelected={values.category === 'Personal'} 
              color="#34C759" // Màu xanh lá đại diện cho Personal
              onPress={() => setFieldValue('category', 'Personal')}
            >
              <CategoryButtonText isSelected={values.category === 'Personal'}>Cá nhân</CategoryButtonText>
            </CategoryButton>

            <CategoryButton 
              isSelected={values.category === 'Ideas'} 
              color="#AF52DE" // Màu tím đại diện cho Ideas
              onPress={() => setFieldValue('category', 'Ideas')}
            >
              <CategoryButtonText isSelected={values.category === 'Ideas'}>Ý tưởng</CategoryButtonText>
            </CategoryButton>
          </CategoryContainer>

          {/* Nút bấm Submit Form */}
          <SubmitButton onPress={handleSubmit}>
            <SubmitButtonText>{onSubmitButtonText || 'Lưu ghi chú'}</SubmitButtonText>
          </SubmitButton>

        </FormContainer>
      )}
    </Formik>
  );
};

export default NoteForm;
import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
});

// Register validation schema
export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu không được để trống'),
  firstName: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .required('Tên không được để trống'),
  lastName: yup
    .string()
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được quá 50 ký tự')
    .required('Họ không được để trống'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
});

// Reset password validation schema
export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu không được để trống'),
});

// Change password validation schema
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Mật khẩu hiện tại không được để trống'),
  newPassword: yup
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới không được để trống'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Xác nhận mật khẩu mới không khớp')
    .required('Xác nhận mật khẩu mới không được để trống'),
});

// Update profile validation schema
export const updateProfileSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .required('Họ tên không được để trống'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Ngày sinh phải là ngày trong quá khứ'),
});

// Address validation schema
export const addressSchema = yup.object().shape({
  recipientName: yup
    .string()
    .required('Tên người nhận không được để trống'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được để trống'),
  streetAddress: yup
    .string()
    .required('Địa chỉ chi tiết không được để trống'),
  ward: yup
    .string()
    .required('Phường/Xã không được để trống'),
  district: yup
    .string()
    .required('Quận/Huyện không được để trống'),
  province: yup
    .string()
    .required('Tỉnh/Thành phố không được để trống'),
  postalCode: yup.string(),
});
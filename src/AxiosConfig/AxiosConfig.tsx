import axios from 'axios';

interface CategoryData {
  name: String;
}
interface SubCategoryData {
  categoryId: String;
  name: String;
}
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Login = async (data: any) => {
  return axiosInstance.post(`/api/v1/admin/login`, data);
};

export const getCategory = async () => {
  return axiosInstance.get('/api/v1/categories/get/category');
};

export const getSubCategory = async () => {
  return axiosInstance.get('/api/v1/categories/get/subCategory');
};

export const CreateCategory = async (data: CategoryData) => {
  return axiosInstance.post('/api/v1/categories/add/category', data);
};

export const CreateSubCategory = async (data: SubCategoryData) => {
  return axiosInstance.post('/api/v1/categories/add/subCategory', data);
};

export const CreateSubSubCategory = async (data: any) => {
  return axiosInstance.post('/api/v1/categories/add/subsubCategory', data);
};

export const CreateProduct = async (data: any) => {
  return axiosInstance.post('/api/v1/product/create', data);
};

export const UploadImage = async (files: any) => {
  console.log(files);
  const formData = new FormData();
  files?.forEach((file: any) => {
    formData.append('images', file);
  });

  console.log(formData);
  return axiosInstance.post('/api/v1/C/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const UpdateCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/category', data);
};

export const UpdateSubCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/subCategory', data);
};

export const UpdateSubSubCategory = async (data: any) => {
  return axiosInstance.patch('/api/v1/categories/add/subsubCategory', data);
};

export const DeleteCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/category', { data });
};

export const DeleteSubCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/subcategory', { data });
};

export const DeleteSubSubCategory = async (data: any) => {
  return axiosInstance.delete('/api/v1/categories/delete/subsubcategory', { data });
};

export const GetAllCoupons = async (data: any) => {
  const { page, limit } = data;
  return axiosInstance.get(`/api/v1/coupon/admin?page=${page}&limit=${limit}`);
};

export const CreateCoupon = async (data: any) => {
  return axiosInstance.post('/api/v1/coupon/admin', data);
};

export const DeleteCoupons = async (data: any) => {
  return axiosInstance.delete('/api/v1/coupon/admin', { data });
};

export const EditCoupons = async (data: any) => {
  return axiosInstance.put('/api/v1/coupon/admin', data);
};

export const getallTax = async (data?: any) => {
  return axiosInstance.get(
    `/api/v1/tax/get?provinceCode=${data?.provinceCode}&category=${data?.category}`,
  );
};

export const getAllProduct = async (data: any) => {
  return axiosInstance.post(`/api/v1/product`, data);
};

export const CreateTax = async (data: any) => {
  return axiosInstance.post('/api/v1/tax', data);
};

export const EditTax = async (data: any) => {
  return axiosInstance.put('/api/v1/tax/edit', data);
};

export const DeleteTax = async (data: any) => {
  return axiosInstance.delete(`/api/v1/tax/delete?provinceCode=${data}`);
};

export const getAllOrders = async () => {
  return axiosInstance.get(`/api/v1/order/admin/orders`);
};

export const SendOtp = async (data: any) => {
  return axiosInstance.get(`/api/v1/admin/otp/${data}`);
};

export const ResetPassword = async (data: any) => {
  return axiosInstance.post("/api/v1/admin/forgot", data);
};

export const EditProduct = async (payload: any) => {
  const { id, data } = payload;
  return axiosInstance.put(`/api/v1/product/category/${id}`, data);
};

export const getAllQuarys = async () => {
  return axiosInstance.get('/api/v1/contact/');
};

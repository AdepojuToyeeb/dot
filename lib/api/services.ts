import apiInstance from "../config/axios";
import { SortOrderEnum } from "../constants";

type SortOrder = SortOrderEnum.ASC | SortOrderEnum.DESC;

type ProductQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  order?: SortOrder;
};

export const GetProductsCategories = async () => {
  const { data } = await apiInstance.get(`/api/categories`);
  return data;
};
export const GetAllProducts = async (params: ProductQueryParams) => {
  const { data } = await apiInstance.get(`/api/products`, { params });
  return data;
};
export const GetSingleProduct = async (id: number) => {
  const { data } = await apiInstance.get(`/api/products/${id}`);
  return data;
};
export const CreateProducts = async (body: any) => {
  const { data } = await apiInstance.post(`/api/products`, body);
  return data;
};
export const EditProducts = async (body: any) => {
  const { data } = await apiInstance.patch(`/api/products/${body.id}`, body);
  return data;
};
export const DeleteProducts = async (id: number) => {
  const { data } = await apiInstance.delete(`/api/products/${id}`);
  return data;
};

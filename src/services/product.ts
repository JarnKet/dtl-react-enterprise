import axiosInstance from '@/config/axios';

const API = 'https://dummyjson.com/products';

export const getProducts = async ({
	params,
}: {
	params?: {
		q?: string;
	};
}) => {
	try {
		const response = await axiosInstance.get(API, {
			params,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching remote jobs:', error);
		throw error;
	}
};

export const getProductById = async (id: string) => {
	try {
		const response = await axiosInstance.get(`${API}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching remote job by ID:', error);
		throw error;
	}
};

export const createProduct = async (data: Record<string, unknown>) => {
	try {
		const response = await axiosInstance.post(API + '/add', data);
		return response.data;
	} catch (error) {
		console.error('Error creating product:', error);
		throw error;
	}
};

export const updateProductById = async (
	id: string,
	data: Record<string, unknown>
) => {
	try {
		const response = await axiosInstance.put(`${API}/${id}`, data);
		return response.data;
	} catch (error) {
		console.error('Error updating product by ID:', error);
		throw error;
	}
};

export const deleteProductById = async (id: string) => {
	try {
		const response = await axiosInstance.delete(`${API}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting product by ID:', error);
		throw error;
	}
};

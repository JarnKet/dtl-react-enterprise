import axiosInstance from '@/config/axios';

// fetch('https://dummyjson.com/auth/login', {
// 	method: 'POST',
// 	headers: { 'Content-Type': 'application/json' },
// 	body: JSON.stringify({
// 		username: 'emilys',
// 		password: 'emilyspass',
// 		expiresInMins: 30, // optional, defaults to 60
// 	}),
// 	credentials: 'include', // Include cookies (e.g., accessToken) in the request
// })
// 	.then((res) => res.json())
// 	.then(console.log);

const API = 'https://dummyjson.com';

export const Login = async (payload: {
	username: string;
	password: string;
}) => {
	try {
		const response = await axiosInstance.post(
			API + '/auth/login',
			{
				...payload,
				// expiresInMins: 30, // optional, defaults to 60
			},
			{
				// withCredentials: true, // Include cookies (e.g., accessToken) in the request
			}
		);
		return response.data;
	} catch (error) {
		console.error('Login failed:', error);
		throw error;
	}
};

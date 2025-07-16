import axiosInstance from "@/config/axios.ts";

const API = "https://jobicy.com/api/v2/remote-jobs"

export const getRemoteJobs = async ({
                                        params,
                                    }: {
    params?: {
        count?: number;
        geo?: string;
        industry?: string;
        tag?: string;
    }
}) => {
    try {
        const response = await axiosInstance.get(API, {
            params
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching remote jobs:", error);
        throw error;
    }
};
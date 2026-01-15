import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user?: {
        id: number;
        name: string;
        age: number;
        address: string;
        username: string;
    };
    message?: string;
}

export const login = async (payload: LoginPayload) => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, payload);
    return response.data;
};

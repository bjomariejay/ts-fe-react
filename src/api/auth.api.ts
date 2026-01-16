import { AuthenticatedUser } from "../types/auth";
import { httpClient } from "./httpClient";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    age: number;
    address: string;
    username: string;
    password: string;
}

export interface AuthSuccessResponse {
    success: boolean;
    user?: AuthenticatedUser;
    token?: string;
    message?: string;
}

export interface CurrentUserResponse {
    success: boolean;
    user?: AuthenticatedUser;
    message?: string;
}

export const login = async (payload: LoginPayload) => {
    const response = await httpClient.post<AuthSuccessResponse>("/login", payload);
    return response.data;
};

export const signup = async (payload: SignupPayload) => {
    const response = await httpClient.post<AuthSuccessResponse>("/signup", payload);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await httpClient.get<CurrentUserResponse>("/me");
    return response.data;
};

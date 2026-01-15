import axios from "axios";
import { AppUser, CreateUserPayload, UpdateUserPayload } from "../types/user";

const API_URL = "http://localhost:5000/api";

export const getUsers = async (): Promise<AppUser[]> => {
    const res = await axios.get<AppUser[]>(`${API_URL}/users`);
    return res.data;
};

export const createUser = async (user: CreateUserPayload): Promise<AppUser> => {
    const res = await axios.post<AppUser>(`${API_URL}/users`, user);
    return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
};

export const updateUser = async (id: number, data: UpdateUserPayload): Promise<AppUser> => {
    const res = await axios.put<AppUser>(`${API_URL}/users/${id}`, data);
    return res.data;
};

import { AppUser, CreateUserPayload, UpdateUserPayload } from "../types/user";
import { httpClient } from "./httpClient";

export const getUsers = async (): Promise<AppUser[]> => {
    const res = await httpClient.get<AppUser[]>("/users");
    return res.data;
};

export const createUser = async (user: CreateUserPayload): Promise<AppUser> => {
    const res = await httpClient.post<AppUser>("/users", user);
    return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await httpClient.delete(`/users/${id}`);
};

export const updateUser = async (id: number, data: UpdateUserPayload): Promise<AppUser> => {
    const res = await httpClient.put<AppUser>(`/users/${id}`, data);
    return res.data;
};

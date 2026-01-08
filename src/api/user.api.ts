import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUsers = () => axios.get(`${API_URL}/users`);

export const createUser = async (user: { name: string; age: number; address: string }) => {
    const res = await axios.post(`${API_URL}/users`, user);
    return res.data;
};

export const deleteUser = async (id: number) => {
    const res = await axios.delete(`${API_URL}/users/${id}`);
    return res.data;
};

export const updateUser = (id: number, data: any) => axios.put(`${API_URL}/users/${id}`, data);
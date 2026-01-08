import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser } from "./api/user.api";

interface User {
    id: number;
    name: string;
    age: number;
    address: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: "", age: 0, address: "" });

    const fetchUsers = async () => {
        const res = await getUsers();
        setUsers(res.data);
    };

    const addUser = async () => {
        const newUser = { name: "John", age: 30, address: "Cebu" };
        await createUser(newUser);
        fetchUsers();
    };

    const removeUser = async (id: number) => {
        await deleteUser(id);
        fetchUsers();
    };

    const startEdit = (user: User) => {
        setEditingId(user.id);
        setForm({ name: user.name, age: user.age, address: user.address });
    };

    const saveEdit = async () => {
        if (editingId !== null) {
            await updateUser(Number(editingId), form);
            setEditingId(null);
            setForm({ name: "", age: 0, address: "" });
            fetchUsers();
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Users</h1>
            <button onClick={addUser}>Add User</button>
            <ul>

            </ul>
            <ul>
                {users.map(u => (
                    <li key={u.id}>
                        {editingId === u.id ? (
                            <span>
                <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                />
                <input
                    type="number"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: Number(e.target.value) })}
                    placeholder="Age"
                />
                <input
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Address"
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </span>
                        ) : (
                            <span>
                {u.name} - {u.age} - {u.address}{" "}
                                <button onClick={() => startEdit(u)}>Edit</button>
                <button onClick={() => removeUser(u.id)}>Delete</button>
              </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

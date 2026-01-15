import { FormEvent, useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "../api/user.api";
import { AppUser } from "../types/user";

export interface UserFormState {
  name: string;
  age: string;
  address: string;
  username: string;
  password: string;
}

const emptyForm: UserFormState = {
  name: "",
  age: "",
  address: "",
  username: "",
  password: "",
};

const getServerMessage = (err: unknown) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message;
  }
  return undefined;
};

export const useUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Unable to load users. Please try again.");
        console.error(err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFieldChange = (field: keyof UserFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
    setStatusMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedAddress = form.address.trim();
    const trimmedUsername = form.username.trim();
    const numericAge = Number(form.age);

    if (!trimmedName || !trimmedAddress || !trimmedUsername || !Number.isFinite(numericAge)) {
      setError("Name, age, address, and username are required. Age must be a number.");
      return;
    }

    if (!editingId && !form.password) {
      setError("Password is required when creating a user.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (editingId) {
        const updatedUser = await updateUser(editingId, {
          name: trimmedName,
          age: numericAge,
          address: trimmedAddress,
          username: trimmedUsername,
          password: form.password || undefined,
        });
        setUsers(prev => prev.map(user => (user.id === editingId ? updatedUser : user)));
        setStatusMessage("User updated successfully.");
      } else {
        const newUser = await createUser({
          name: trimmedName,
          age: numericAge,
          address: trimmedAddress,
          username: trimmedUsername,
          password: form.password,
        });
        setUsers(prev => [...prev, newUser]);
        setStatusMessage("User created successfully. You can now sign in with this account.");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(getServerMessage(err) ?? "Action failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: AppUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      age: String(user.age),
      address: user.address,
      username: user.username,
      password: "",
    });
    setStatusMessage("");
    setError("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setStatusMessage("User deleted.");
    } catch (err) {
      console.error(err);
      setError(getServerMessage(err) ?? "Unable to delete user.");
    }
  };

  return {
    users,
    form,
    editingId,
    isLoadingUsers,
    isSubmitting,
    error,
    statusMessage,
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};

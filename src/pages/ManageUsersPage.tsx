import { FormEvent, useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "../api/user.api";
import { AppUser } from "../types/user";

interface ManageUsersPageProps {
  onBackToLogin: () => void;
}

interface UserFormState {
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

const ManageUsersPage = ({ onBackToLogin }: ManageUsersPageProps) => {
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

  const getServerMessage = (err: unknown) => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      return axiosError.response?.data?.message;
    }
    return undefined;
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

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Create a User</h1>
            <p className="text-sm text-slate-500">Add a record below and then return to the login page.</p>
          </div>
          <button
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col text-sm font-semibold text-slate-700">
              Name
              <input
                className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={form.name}
                onChange={event => handleFieldChange("name", event.target.value)}
                placeholder="Jane Doe"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold text-slate-700">
              Age
              <input
                className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={form.age}
                onChange={event => handleFieldChange("age", event.target.value)}
                placeholder="30"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold text-slate-700">
              Address
              <input
                className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={form.address}
                onChange={event => handleFieldChange("address", event.target.value)}
                placeholder="123 Main St"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold text-slate-700">
              Username
              <input
                className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={form.username}
                onChange={event => handleFieldChange("username", event.target.value)}
                placeholder="jane.doe"
              />
            </label>
            <label className="flex flex-col text-sm font-semibold text-slate-700 md:col-span-2">
              Password
              <input
                className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                type="password"
                value={form.password}
                onChange={event => handleFieldChange("password", event.target.value)}
                placeholder={editingId ? "Optional – fill to reset password" : "Required"}
              />
            </label>
            {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
            {statusMessage && !error && <p className="md:col-span-2 text-sm text-green-600">{statusMessage}</p>}
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {editingId ? (isSubmitting ? "Saving..." : "Update User") : isSubmitting ? "Creating..." : "Create User"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Users table</h2>
            {isLoadingUsers && <span className="text-sm text-slate-500">Loading...</span>}
          </div>
          {!isLoadingUsers && users.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No users found. Add one using the form above.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Username</th>
                    <th className="px-4 py-2 font-semibold">Age</th>
                    <th className="px-4 py-2 font-semibold">Address</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-semibold text-slate-800">{user.name}</td>
                      <td className="px-4 py-2 text-slate-600">{user.username}</td>
                      <td className="px-4 py-2 text-slate-600">{user.age}</td>
                      <td className="px-4 py-2 text-slate-600">{user.address}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-full border border-red-200 px-4 py-1 text-xs font-semibold text-red-600 transition hover:border-red-500"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;

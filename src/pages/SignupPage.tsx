import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";

const emptyForm = {
  name: "",
  age: "",
  address: "",
  username: "",
  password: "",
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
    setStatus("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAge = Number(form.age);
    if (!form.name.trim() || !form.address.trim() || !form.username.trim() || !form.password || !Number.isFinite(numericAge)) {
      setError("All fields are required and age must be a number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await signup({
        name: form.name.trim(),
        age: numericAge,
        address: form.address.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      if (response.success && response.user) {
        if (response.token) {
          console.log(`Signup token for ${response.user.username}:`, response.token);
        }
        setStatus("Account created! Redirecting to login...");
        setForm(emptyForm);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.message ?? "Unable to create account.");
      }
    } catch (err) {
      const fallback = "Unable to create account. Please try again.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message ?? fallback);
      } else {
        setError(fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <form className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
            <p className="text-sm text-slate-500">Fill in your details to register.</p>
          </div>
          <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" to="/login">
            Back to login
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-semibold text-slate-600">
            Name
            <input
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={form.name}
              onChange={event => handleFieldChange("name", event.target.value)}
              placeholder="Jane Doe"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-600">
            Age
            <input
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={form.age}
              onChange={event => handleFieldChange("age", event.target.value)}
              placeholder="30"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-600">
            Address
            <input
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={form.address}
              onChange={event => handleFieldChange("address", event.target.value)}
              placeholder="123 Main St"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-600">
            Username
            <input
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={form.username}
              onChange={event => handleFieldChange("username", event.target.value)}
              placeholder="jane.doe"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-600 md:col-span-2">
            Password
            <input
              type="password"
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={form.password}
              onChange={event => handleFieldChange("password", event.target.value)}
              placeholder="Create a password"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status && !error && <p className="text-sm text-green-600">{status}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;

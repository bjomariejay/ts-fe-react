import { useLoginForm } from "../hooks/useLoginForm";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string;
  isLoading: boolean;
  onInputChange?: () => void;
}

const LoginPage = ({ onLogin, error, isLoading, onInputChange }: LoginPageProps) => {
  const { form, handleSubmit, handleFieldChange } = useLoginForm({
    onSubmit: onLogin,
    onInputChange,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 p-4 flex items-center justify-center">
      <form
        className="w-full border-black max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500">Use your credentials from the users table.</p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
          Username
          <input
            className="rounded-xl border border-slate-200 px-4 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={form.username}
            onChange={e => handleFieldChange("username", e.target.value)}
            placeholder="Enter username"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
          Password
          <input
            className="rounded-xl border border-slate-200 px-4 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            type="password"
            value={form.password}
            onChange={e => handleFieldChange("password", e.target.value)}
            placeholder="Enter password"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
        <p className="text-center text-xs text-slate-500">
          Use a username/password from the users table.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

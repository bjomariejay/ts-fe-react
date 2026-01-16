import { AuthenticatedUser } from "../types/auth";

interface DashboardHeaderProps {
  user: AuthenticatedUser;
  onManageUsers?: () => void;
}

const DashboardHeader = ({ user, onManageUsers }: DashboardHeaderProps) => (
  <header className="bg-white px-8 py-6 shadow-md">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Logged in as {user.name}</p>
      </div>
      {onManageUsers && (
        <button
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
          onClick={onManageUsers}
        >
          Manage users
        </button>
      )}
    </div>
  </header>
);

export default DashboardHeader;

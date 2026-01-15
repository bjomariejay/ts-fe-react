import { AuthenticatedUser } from "../types/auth";

interface DashboardHeaderProps {
  user: AuthenticatedUser;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => (
  <header className="bg-white px-8 py-6 shadow-md">
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-500">Logged in as {user.name}</p>
    </div>
  </header>
);

export default DashboardHeader;

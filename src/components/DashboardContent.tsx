import { AuthenticatedUser } from "../types/auth";
import { TabKey } from "../types/navigation";

interface DashboardContentProps {
  user: AuthenticatedUser;
  activeTab: TabKey;
}

const DashboardContent = ({ user, activeTab }: DashboardContentProps) => {
  switch (activeTab) {
    case "home":
      return (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {user.name}</h2>
          <p className="text-slate-600">
            You are now logged in. Use the tabs above to explore your dashboard.
          </p>
        </div>
      );
    case "profile":
      return (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">Name:</span> {user.name}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">Username:</span> {user.username}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">Age:</span> {user.age}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">Address:</span> {user.address}
          </p>
        </div>
      );
    case "settings":
      return (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
          <p className="text-slate-600">Settings go here. This is a placeholder you can extend later.</p>
        </div>
      );
    default:
      return null;
  }
};

export default DashboardContent;

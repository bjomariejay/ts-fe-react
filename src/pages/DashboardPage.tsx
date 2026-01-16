import DashboardContent from "../components/DashboardContent";
import DashboardHeader from "../components/DashboardHeader";
import TabNavigation from "../components/TabNavigation";
import { AuthenticatedUser } from "../types/auth";
import { TabKey } from "../types/navigation";

interface DashboardPageProps {
  user: AuthenticatedUser;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onManageUsers: () => void;
}

const DashboardPage = ({ user, activeTab, onTabChange, onManageUsers }: DashboardPageProps) => (
  <div className="min-h-screen bg-slate-100">
    <DashboardHeader user={user} onManageUsers={onManageUsers} />
    <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
    <section className="px-8 py-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <DashboardContent user={user} activeTab={activeTab} />
      </div>
    </section>
  </div>
);

export default DashboardPage;

import { useAuth } from "./hooks/useAuth";
import { useDashboardTabs } from "./hooks/useDashboardTabs";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const { user, login, logout, error, clearError, isLoading } = useAuth();
  const { activeTab, handleTabChange, resetTab } = useDashboardTabs({ onLogout: logout });

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      resetTab();
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} error={error} isLoading={isLoading} onInputChange={clearError} />;
  }

  return <DashboardPage user={user} activeTab={activeTab} onTabChange={handleTabChange} />;
}

export default App;

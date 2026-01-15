import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useDashboardTabs } from "./hooks/useDashboardTabs";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ManageUsersPage from "./pages/ManageUsersPage";

function App() {
  const [showUserManager, setShowUserManager] = useState(false);
  const { user, login, logout, error, clearError, isLoading } = useAuth();
  const { activeTab, handleTabChange, resetTab } = useDashboardTabs({ onLogout: logout });

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      resetTab();
      setShowUserManager(false);
    }
  };

  if (showUserManager) {
    return <ManageUsersPage onBackToLogin={() => setShowUserManager(false)} />;
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        error={error}
        isLoading={isLoading}
        onInputChange={clearError}
        onSignUpClick={() => setShowUserManager(true)}
      />
    );
  }

  return <DashboardPage user={user} activeTab={activeTab} onTabChange={handleTabChange} />;
}

export default App;

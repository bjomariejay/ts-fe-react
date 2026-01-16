import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { useDashboardTabs } from "./hooks/useDashboardTabs";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import SignupPage from "./pages/SignupPage";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { user, login, logout, error, clearError, isLoading } = useAuthContext();
  const { activeTab, handleTabChange, resetTab } = useDashboardTabs({
    onLogout: () => {
      logout();
      navigate("/login", { replace: true });
    },
  });

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      resetTab();
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              onLogin={handleLogin}
              error={error}
              isLoading={isLoading}
              onInputChange={clearError}
              onSignUpClick={() => navigate("/signup")}
            />
          )
        }
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage
              user={user!}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onManageUsers={() => navigate("/manage-users")}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-users"
        element={
          <ProtectedRoute>
            <ManageUsersPage onBack={() => navigate("/dashboard")} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

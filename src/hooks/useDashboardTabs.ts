import { useState } from "react";
import { TabKey } from "../types/navigation";

interface DashboardTabsHookOptions {
  onLogout: () => void;
}

export const useDashboardTabs = ({ onLogout }: DashboardTabsHookOptions) => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const handleTabChange = (tab: TabKey) => {
    if (tab === "logout") {
      onLogout();
      setActiveTab("home");
      return;
    }
    setActiveTab(tab);
  };

  const resetTab = () => setActiveTab("home");

  return { activeTab, handleTabChange, resetTab };
};

import { TabKey, dashboardTabs, tabLabels } from "../types/navigation";

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => (
  <nav className="flex flex-wrap gap-3 border-b border-slate-200 bg-white px-8 py-4">
    {dashboardTabs.map(tab => (
      <button
        key={tab}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
          activeTab === tab ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
        }`}
        onClick={() => onTabChange(tab)}
      >
        {tabLabels[tab]}
      </button>
    ))}
  </nav>
);

export default TabNavigation;

export type TabKey = "home" | "profile" | "settings" | "logout";

export const dashboardTabs: TabKey[] = ["home", "profile", "settings", "logout"];

export const tabLabels: Record<TabKey, string> = {
  home: "Home",
  profile: "Profile",
  settings: "Settings",
  logout: "Logout"
};

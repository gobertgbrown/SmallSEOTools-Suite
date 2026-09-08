import React, { createContext, useContext, useState, useEffect } from "react";
import { ToolItem, User, SavedReport, ToolCategory, LiveActivity } from "../types";
import { ALL_TOOLS } from "../data/toolsData";
import confetti from "canvas-confetti";

interface AppContextType {
  activeTool: ToolItem | null;
  setActiveTool: (tool: ToolItem | null) => void;
  selectToolById: (id: string | null) => void;
  activeCategory: ToolCategory | "all";
  setActiveCategory: (cat: ToolCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  savedReports: SavedReport[];
  saveReport: (report: Omit<SavedReport, "id" | "date">) => void;
  deleteReport: (id: string) => void;
  toolStates: Record<string, { enabled: boolean; isProOnly: boolean; usageCount: number; name: string }>;
  toggleToolStatus: (id: string) => void;
  toggleToolPro: (id: string) => void;
  updateToolName: (id: string, name: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  pricingModalOpen: boolean;
  setPricingModalOpen: (open: boolean) => void;
  savedReportsModalOpen: boolean;
  setSavedReportsModalOpen: (open: boolean) => void;
  adminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  analyticsViewOpen: boolean;
  setAnalyticsViewOpen: (open: boolean) => void;
  userDashboardOpen: boolean;
  setUserDashboardOpen: (open: boolean) => void;
  limitModalOpen: boolean;
  setLimitModalOpen: (open: boolean) => void;
  liveActivities: LiveActivity[];
  triggerUpgrade: (plan: "Pro Starter" | "Pro Business") => void;
  recordToolUsage: (toolId: string) => void;
  checkLimitAndProceed: () => boolean;
  loginUser: (userData: Partial<User>) => void;
  logoutUser: () => void;
  scansRemaining: number;
}

const DEFAULT_GUEST_USER: User = {
  id: "usr_guest_001",
  name: "Guest Visitor",
  email: "guest@smallseotools.com",
  role: "user",
  plan: "Free",
  isGuest: true,
  reportsGenerated: 0,
  dailyScansUsed: 0,
  dailyLimit: 3, // 3 free guest scans before signup is required
  joinedDate: "Today",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
};

const INITIAL_ACTIVITIES: LiveActivity[] = [
  { id: "act_1", toolName: "Plagiarism Checker", category: "Text Analysis", country: "United States", countryCode: "US", timeAgo: "12s ago", status: "success" },
  { id: "act_2", toolName: "Image Compressor", category: "Images", country: "United Kingdom", countryCode: "GB", timeAgo: "24s ago", status: "success" },
  { id: "act_3", toolName: "Keyword Density Checker", category: "Keywords", country: "Germany", countryCode: "DE", timeAgo: "41s ago", status: "success" },
  { id: "act_4", toolName: "Website SEO Score Checker", category: "Website Mgmt", country: "Pakistan", countryCode: "PK", timeAgo: "55s ago", status: "success" },
  { id: "act_5", toolName: "AI Content Detector", category: "Text Analysis", country: "Canada", countryCode: "CA", timeAgo: "1m ago", status: "success" },
  { id: "act_6", toolName: "PDF To Word", category: "PDF Tools", country: "India", countryCode: "IN", timeAgo: "2m ago", status: "success" },
  { id: "act_7", toolName: "Domain Authority Checker", category: "Domains", country: "Australia", countryCode: "AU", timeAgo: "2m ago", status: "success" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [savedReportsModalOpen, setSavedReportsModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [analyticsViewOpen, setAnalyticsViewOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>(INITIAL_ACTIVITIES);

  // User state with localStorage and daily reset check
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem("ssto_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const lastDate = localStorage.getItem("ssto_last_active_date");
        const todayStr = new Date().toISOString().split("T")[0];

        let dailyScans = parsed.dailyScansUsed ?? 0;
        if (lastDate !== todayStr) {
          dailyScans = 0;
          localStorage.setItem("ssto_last_active_date", todayStr);
        }

        return {
          ...DEFAULT_GUEST_USER,
          ...parsed,
          dailyScansUsed: dailyScans,
          dailyLimit: parsed.role === "pro" || parsed.role === "admin" ? 9999 : (parsed.isGuest === false ? 15 : 3),
        };
      }
      return DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  });

  useEffect(() => {
    localStorage.setItem("ssto_user", JSON.stringify(user));
    localStorage.setItem("ssto_last_active_date", new Date().toISOString().split("T")[0]);
  }, [user]);

  // Saved reports state with localStorage
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    try {
      const saved = localStorage.getItem("ssto_reports");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "rep_101",
        toolId: "plagiarism-checker",
        toolName: "Plagiarism Checker",
        date: "2025-05-10 14:32",
        inputSnippet: "Artificial intelligence is rapidly reshaping digital marketing...",
        summary: "Originality: 92% Unique, 8% Matched. Grade: Excellent.",
        score: "92% Unique",
        data: { unique: 92, plagiarized: 8, wordCount: 145 },
      },
      {
        id: "rep_102",
        toolId: "website-seo-score-checker",
        toolName: "Website SEO Score Checker",
        date: "2025-05-09 11:15",
        inputSnippet: "https://mycoolsite.org",
        summary: "Overall Health Score: 88/100. SSL valid, H1 present, Missing meta viewport.",
        score: "88/100",
        data: { score: 88, passed: 18, warnings: 3, errors: 1 },
      },
      {
        id: "rep_103",
        toolId: "keyword-density-checker",
        toolName: "Keywords Density Checker",
        date: "2025-05-08 09:20",
        inputSnippet: "SEO optimization guidelines for high converting landing pages...",
        summary: "Top keyword 'SEO' (3.8% density), 'Optimization' (2.1%). Within healthy range.",
        score: "Healthy Density",
        data: { totalWords: 450, topKeyword: "SEO" },
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("ssto_reports", JSON.stringify(savedReports));
  }, [savedReports]);

  // Tool admin overrides
  const [toolStates, setToolStates] = useState<Record<string, { enabled: boolean; isProOnly: boolean; usageCount: number; name: string }>>(() => {
    try {
      const saved = localStorage.getItem("ssto_tool_states");
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, { enabled: boolean; isProOnly: boolean; usageCount: number; name: string }> = {};
    ALL_TOOLS.forEach((t) => {
      initial[t.id] = {
        enabled: true,
        isProOnly: t.badge === "Pro",
        usageCount: t.usageCount || 10000,
        name: t.name,
      };
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("ssto_tool_states", JSON.stringify(toolStates));
  }, [toolStates]);

  const selectToolById = (id: string | null) => {
    if (!id) {
      setActiveTool(null);
      return;
    }
    const found = ALL_TOOLS.find((t) => t.id === id);
    if (found) {
      setActiveTool(found);
      setAdminPanelOpen(false);
      setAnalyticsViewOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveReport = (report: Omit<SavedReport, "id" | "date">) => {
    const newReport: SavedReport = {
      ...report,
      id: `rep_${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setSavedReports((prev) => [newReport, ...prev]);
    setUser((prev) => ({ ...prev, reportsGenerated: prev.reportsGenerated + 1 }));
  };

  const deleteReport = (id: string) => {
    setSavedReports((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleToolStatus = (id: string) => {
    setToolStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        enabled: !prev[id]?.enabled,
      },
    }));
  };

  const toggleToolPro = (id: string) => {
    setToolStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isProOnly: !prev[id]?.isProOnly,
      },
    }));
  };

  const updateToolName = (id: string, name: string) => {
    setToolStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        name,
      },
    }));
  };

  const recordToolUsage = (toolId: string) => {
    setToolStates((prev) => {
      const cur = prev[toolId];
      if (!cur) return prev;
      return {
        ...prev,
        [toolId]: {
          ...cur,
          usageCount: cur.usageCount + 1,
        },
      };
    });

    const tool = ALL_TOOLS.find((t) => t.id === toolId);
    if (tool) {
      const countries = ["United States", "Germany", "United Kingdom", "Canada", "Pakistan", "France", "Japan", "India"];
      const countryCodes = ["US", "DE", "GB", "CA", "PK", "FR", "JP", "IN"];
      const randIdx = Math.floor(Math.random() * countries.length);
      const newAct: LiveActivity = {
        id: `act_${Date.now()}`,
        toolName: tool.name,
        category: tool.category,
        country: countries[randIdx],
        countryCode: countryCodes[randIdx],
        timeAgo: "Just now",
        status: "success",
      };
      setLiveActivities((prev) => [newAct, ...prev.slice(0, 14)]);
    }
  };

  const triggerUpgrade = (plan: "Pro Starter" | "Pro Business") => {
    setUser((prev) => ({
      ...prev,
      plan,
      role: "pro",
      dailyLimit: 9999,
      isGuest: false,
    }));
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Quota & limit checking guard for all tool executions
  const checkLimitAndProceed = (): boolean => {
    if (user.role === "pro" || user.role === "admin") {
      return true;
    }

    // Check if guest user has exhausted 3 scans
    if (user.isGuest) {
      if (user.dailyScansUsed >= user.dailyLimit) {
        setLimitModalOpen(true);
        return false;
      }
    } else {
      // Free registered user (15 scans limit)
      if (user.dailyScansUsed >= user.dailyLimit) {
        setPricingModalOpen(true);
        return false;
      }
    }

    // Increment usage safely
    setUser((prev) => ({
      ...prev,
      dailyScansUsed: prev.dailyScansUsed + 1,
      reportsGenerated: prev.reportsGenerated + 1,
    }));
    return true;
  };

  const loginUser = (userData: Partial<User>) => {
    const isPro = userData.role === "pro" || userData.plan?.includes("Pro");
    const isAdmin = userData.role === "admin";
    setUser((prev) => ({
      ...prev,
      ...userData,
      isGuest: false,
      dailyLimit: isPro || isAdmin ? 9999 : 15,
      joinedDate: prev.joinedDate || new Date().toISOString().split("T")[0],
    }));
    setAuthModalOpen(false);
    setLimitModalOpen(false);
  };

  const logoutUser = () => {
    setUser(DEFAULT_GUEST_USER);
    setUserDashboardOpen(false);
  };

  const scansRemaining =
    user.role === "pro" || user.role === "admin"
      ? 9999
      : Math.max(0, user.dailyLimit - user.dailyScansUsed);

  return (
    <AppContext.Provider
      value={{
        activeTool,
        setActiveTool,
        selectToolById,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        user,
        setUser,
        savedReports,
        saveReport,
        deleteReport,
        toolStates,
        toggleToolStatus,
        toggleToolPro,
        updateToolName,
        authModalOpen,
        setAuthModalOpen,
        pricingModalOpen,
        setPricingModalOpen,
        savedReportsModalOpen,
        setSavedReportsModalOpen,
        adminPanelOpen,
        setAdminPanelOpen,
        analyticsViewOpen,
        setAnalyticsViewOpen,
        userDashboardOpen,
        setUserDashboardOpen,
        limitModalOpen,
        setLimitModalOpen,
        liveActivities,
        triggerUpgrade,
        recordToolUsage,
        checkLimitAndProceed,
        loginUser,
        logoutUser,
        scansRemaining,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

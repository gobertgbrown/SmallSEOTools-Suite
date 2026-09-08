export type ToolCategory =
  | "text-analysis"
  | "design-studio"
  | "images-editing"
  | "keywords-tools"
  | "backlink-tools"
  | "website-management"
  | "website-tracking"
  | "domains-tools"
  | "meta-tags"
  | "online-pdf"
  | "development"
  | "calculators"
  | "other-tools";

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  badge?: "AI" | "Popular" | "New" | "Pro" | "Free";
  isProOnly?: boolean;
  enabled?: boolean;
  usageCount?: number;
  rating?: number;
  keywords?: string[];
}

export interface CategoryMeta {
  id: ToolCategory;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "pro" | "admin";
  plan: "Free" | "Pro Starter" | "Pro Business" | "Enterprise Admin";
  isGuest?: boolean;
  avatar?: string;
  reportsGenerated: number;
  joinedDate: string;
  dailyScansUsed: number;
  dailyLimit: number;
}

export interface SavedReport {
  id: string;
  toolId: string;
  toolName: string;
  date: string;
  inputSnippet: string;
  summary: string;
  data: any;
  score?: number | string;
}

export interface LiveActivity {
  id: string;
  toolName: string;
  category: string;
  country: string;
  countryCode: string;
  timeAgo: string;
  status: "success" | "processing";
}

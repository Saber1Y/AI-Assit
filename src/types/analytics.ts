

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  currency: string;
  source?: string;
  productCategory?: string;
}

export interface UserAnalytics {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  country?: string;
  device?: string;
  acquisitionChannel?: string;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  category: string;
  revenue: number;
  unitsSold: number;
  views: number;
  conversionRate: number;
  averageRating: number;
  stockLevel: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FunnelStage {
  stage: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeInStage: number;
}

export interface KPIData {
  title: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'currency' | 'percentage' | 'number' | 'duration';
  target?: number;
  targetAchieved?: boolean;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  format?: 'currency' | 'percentage' | 'date' | 'number' | 'text';
  width?: string;
}

export interface DataTableRow {
  [key: string]: any;
}

export interface AnalyticsFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  dimensions?: string[];
  metrics?: string[];
  segments?: string[];
  sources?: string[];
  categories?: string[];
  countries?: string[];
}

export interface AnalyticsQuery {
  type: 'revenue' | 'users' | 'products' | 'funnel' | 'custom';
  filters?: AnalyticsFilter;
  aggregation?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  comparison?: {
    period: 'previous_period' | 'previous_year' | 'custom';
    dateRange: {
      start: string;
      end: string;
    };
  };
}

export interface DataSource {
  id: string;
  name: string;
  type: 'google_analytics' | 'stripe' | 'database' | 'github' | 'linear' | 'jira';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config?: Record<string, any>;
}

export interface InsightCard {
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'warning' | 'success';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions?: string[];
  relatedMetrics?: string[];
}

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  queries: AnalyticsQuery[];
  layout: {
    components: Array<{
      type: string;
      position: { x: number; y: number; w: number; h: number };
      props?: Record<string, any>;
    }>;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
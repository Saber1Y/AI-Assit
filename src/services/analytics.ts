import type { 
  RevenueData, 
  UserAnalytics, 
  ProductPerformance, 
  FunnelStage, 
  KPIData,
  AnalyticsFilter,
  AnalyticsQuery,
  HeatmapData,
  DataSource,
  InsightCard
} from '@/types/analytics';

// Helper functions for generating realistic mock data
const randomBetween = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateTrend = (): 'up' | 'down' | 'stable' => {
  const rand = Math.random();
  if (rand < 0.4) return 'up';
  if (rand < 0.8) return 'down';
  return 'stable';
};

// Google Analytics Mock Service
export const googleAnalyticsService = {
  async getUserAnalytics(filters?: AnalyticsFilter): Promise<UserAnalytics[]> {
    const days = filters?.dateRange ? 
      Math.ceil((new Date(filters.dateRange.end).getTime() - new Date(filters.dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) 
      : 30;
    
    const data: UserAnalytics[] = [];
    const baseDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      const activeUsers = randomBetween(1000, 5000);
      const newUsers = Math.floor(activeUsers * randomBetween(10, 30) / 100);
      
      data.push({
        date: date.toISOString().split('T')[0],
        activeUsers,
        newUsers,
        returningUsers: activeUsers - newUsers,
        sessionDuration: randomBetween(120, 480),
        bounceRate: randomBetween(25, 65),
        conversionRate: randomBetween(2, 8) / 100,
        country: 'US',
        device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        acquisitionChannel: ['organic', 'paid', 'direct', 'social'][Math.floor(Math.random() * 4)]
      });
    }
    
    return data;
  },

  async getTopPages(): Promise<{page: string; views: number; uniqueVisitors: number}[]> {
    return [
      { page: '/dashboard', views: 15420, uniqueVisitors: 8930 },
      { page: '/products', views: 12350, uniqueVisitors: 7210 },
      { page: '/pricing', views: 8960, uniqueVisitors: 5430 },
      { page: '/blog', views: 6780, uniqueVisitors: 4120 },
      { page: '/about', views: 5430, uniqueVisitors: 3210 }
    ];
  }
};

// Stripe Mock Service
export const stripeService = {
  async getRevenueData(filters?: AnalyticsFilter): Promise<RevenueData[]> {
    const days = filters?.dateRange ? 
      Math.ceil((new Date(filters.dateRange.end).getTime() - new Date(filters.dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) 
      : 30;
    
    const data: RevenueData[] = [];
    const baseDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      const orders = randomBetween(20, 150);
      const avgOrderValue = randomBetween(50, 300);
      const revenue = orders * avgOrderValue;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue,
        orders,
        averageOrderValue: avgOrderValue,
        currency: 'USD',
        source: ['web', 'mobile', 'api'][Math.floor(Math.random() * 3)],
        productCategory: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)]
      });
    }
    
    return data;
  },

  async getSubscriptionMetrics(): Promise<{
    activeSubscriptions: number;
    newSubscriptions: number;
    churnedSubscriptions: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
  }> {
    return {
      activeSubscriptions: 2847,
      newSubscriptions: 143,
      churnedSubscriptions: 28,
      monthlyRecurringRevenue: 127450,
      averageRevenuePerUser: 44.75
    };
  }
};

// Database Mock Service
export const databaseService = {
  async getProductPerformance(filters?: AnalyticsFilter): Promise<ProductPerformance[]> {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
    const data: ProductPerformance[] = [];
    
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const views = randomBetween(100, 5000);
      const unitsSold = Math.floor(views * randomBetween(1, 25) / 100);
      
      data.push({
        productId: `PROD_${String(i + 1).padStart(4, '0')}`,
        productName: `Product ${i + 1}`,
        category,
        revenue: unitsSold * randomBetween(20, 200),
        unitsSold,
        views,
        conversionRate: unitsSold / views,
        averageRating: randomBetween(30, 50) / 10,
        stockLevel: randomBetween(0, 500),
        trend: generateTrend()
      });
    }
    
    return data.sort((a, b) => b.revenue - a.revenue);
  },

  async getFunnelAnalysis(): Promise<FunnelStage[]> {
    return [
      {
        stage: 'Website Visit',
        users: 10000,
        conversionRate: 1.0,
        dropoffRate: 0,
        averageTimeInStage: 45
      },
      {
        stage: 'Product View',
        users: 3500,
        conversionRate: 0.35,
        dropoffRate: 0.65,
        averageTimeInStage: 120
      },
      {
        stage: 'Add to Cart',
        users: 1200,
        conversionRate: 0.12,
        dropoffRate: 0.66,
        averageTimeInStage: 180
      },
      {
        stage: 'Checkout',
        users: 800,
        conversionRate: 0.08,
        dropoffRate: 0.33,
        averageTimeInStage: 300
      },
      {
        stage: 'Purchase',
        users: 500,
        conversionRate: 0.05,
        dropoffRate: 0.375,
        averageTimeInStage: 240
      }
    ];
  },

  async getHeatmapData(): Promise<HeatmapData[]> {
    const hours = Array.from({length: 24}, (_, i) => i.toString());
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: HeatmapData[] = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        const hourNum = parseInt(hour);
        let value = randomBetween(10, 100);
        
        // Simulate realistic usage patterns
        if (day === 'Sat' || day === 'Sun') {
          value *= 0.6; // Less weekend activity
        }
        if (hourNum >= 9 && hourNum <= 17) {
          value *= 1.5; // Business hours
        } else if (hourNum >= 19 && hourNum <= 22) {
          value *= 1.2; // Evening peak
        } else if (hourNum >= 0 && hourNum <= 6) {
          value *= 0.3; // Night time
        }
        
        data.push({
          x: hour,
          y: day,
          value: Math.round(value),
          label: `${day} ${hour}:00`
        });
      });
    });
    
    return data;
  }
};

// Universal Analytics Service (orchestrates all data sources)
export const analyticsService = {
  async getKPIData(): Promise<KPIData[]> {
    const revenue = await stripeService.getRevenueData();
    const totalRevenue = revenue.reduce((sum, day) => sum + day.revenue, 0);
    const prevRevenue = totalRevenue * 0.87; // Simulate 13% growth
    
    const users = await googleAnalyticsService.getUserAnalytics();
    const totalUsers = users.reduce((sum, day) => sum + day.newUsers, 0);
    const prevUsers = totalUsers * 0.92; // Simulate 8% growth
    
    return [
      {
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000).toFixed(1)}K`,
        previousValue: `$${(prevRevenue / 1000).toFixed(1)}K`,
        change: 13.2,
        changeType: 'increase',
        format: 'currency',
        target: totalRevenue * 1.1,
        targetAchieved: true
      },
      {
        title: 'New Users',
        value: totalUsers.toLocaleString(),
        previousValue: Math.round(prevUsers).toLocaleString(),
        change: 8.7,
        changeType: 'increase',
        format: 'number',
        target: totalUsers * 1.05,
        targetAchieved: true
      },
      {
        title: 'Conversion Rate',
        value: '4.2%',
        previousValue: '3.8%',
        change: 10.5,
        changeType: 'increase',
        format: 'percentage',
        target: 4.0,
        targetAchieved: true
      },
      {
        title: 'Avg Order Value',
        value: '$127.40',
        previousValue: '$118.20',
        change: -4.2,
        changeType: 'decrease',
        format: 'currency',
        target: 130,
        targetAchieved: false
      }
    ];
  },

  async generateInsights(): Promise<InsightCard[]> {
    return [
      {
        title: 'Revenue Growth Alert',
        description: 'Revenue has increased by 13.2% compared to the previous period, exceeding targets by 8%.',
        type: 'success',
        confidence: 0.95,
        impact: 'high',
        actionable: false,
        relatedMetrics: ['revenue', 'orders', 'conversion_rate']
      },
      {
        title: 'Cart Abandonment Opportunity',
        description: '33% of users abandon cart at checkout stage. Implementing email recovery could save ~$12K/month.',
        type: 'recommendation',
        confidence: 0.87,
        impact: 'medium',
        actionable: true,
        suggestedActions: [
          'Set up abandoned cart email sequence',
          'Add guest checkout option',
          'Display shipping costs earlier'
        ],
        relatedMetrics: ['conversion_rate', 'cart_abandonment']
      },
      {
        title: 'Weekend Traffic Drop',
        description: 'Website traffic drops by 40% on weekends. Consider weekend promotions to boost engagement.',
        type: 'trend',
        confidence: 0.92,
        impact: 'medium',
        actionable: true,
        suggestedActions: [
          'Launch weekend special campaigns',
          'Create weekend-specific content',
          'Increase social media presence on weekends'
        ],
        relatedMetrics: ['traffic', 'engagement', 'revenue']
      }
    ];
  },

  async getDataSources(): Promise<DataSource[]> {
    return [
      {
        id: 'ga_123',
        name: 'Google Analytics',
        type: 'google_analytics',
        status: 'connected',
        lastSync: new Date().toISOString()
      },
      {
        id: 'stripe_456',
        name: 'Stripe Payments',
        type: 'stripe',
        status: 'connected',
        lastSync: new Date().toISOString()
      },
      {
        id: 'db_789',
        name: 'Production Database',
        type: 'database',
        status: 'connected',
        lastSync: new Date(Date.now() - 300000).toISOString() // 5 min ago
      }
    ];
  }
};
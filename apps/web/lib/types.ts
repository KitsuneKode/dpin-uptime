export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'paused';
  lastChecked: string;
  responseTime: number;
  uptime: {
    current: string; // "5 hours 3 mins 46 seconds"
    percentage: number;
  };
  interval: string; // "3m", "5m", etc.
  incidents: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseTimeData {
  timestamp: string;
  value: number;
  monitorId: string;
  location: string;
}

export interface UptimeStats {
  period: 'today' | 'week' | 'month';
  availability: number; // 100.0000%
  downtime: string;
  incidents: number;
  longestIncident: string;
  avgIncident: string;
}

export interface StatusPage {
  id: string;
  companyName: string;
  subdomain: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  monitors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  title: string;
  description?: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startedAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
}

export interface DashboardMetrics {
  totalMonitors: number;
  overallUptime: number;
  activeIncidents: number;
  avgResponseTime: number;
  uptimeStreak: string;
  lastChecked: string;
}

export interface CreateMonitorData {
  name: string;
  url: string;
  interval: string;
  timeout?: number;
  expectedStatusCodes?: number[];
  locations?: string[];
}

export interface UpdateMonitorData extends Partial<CreateMonitorData> {
  id: string;
}

export interface CreateStatusPageData {
  companyName: string;
  subdomain: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  monitors: string[];
}

export interface UpdateStatusPageData extends Partial<CreateStatusPageData> {
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type MonitorStatus = Monitor['status'];
export type IncidentStatus = Incident['status'];
export type IncidentSeverity = Incident['severity'];
export type TimePeriod = 'day' | 'week' | 'month';
export type Location = 'us-east' | 'us-west' | 'eu-west' | 'asia-southeast';

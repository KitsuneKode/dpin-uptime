// Database-aligned types based on Prisma schema
export interface Website {
  id: string;
  url: string;
  userId: string;
  archived: boolean;
  websiteTicks?: WebsiteTick[];
}

export interface WebsiteTick {
  id: string;
  websiteId: string;
  status: WebsiteStatus;
  latency: number; // in milliseconds
  validatorId: string;
  createdAt: string;
}

export enum WebsiteStatus {
  Bad = 'Bad',
  Good = 'Good',
}

export interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
}

// Frontend display types (derived from database data)
export interface Monitor {
  id: string;
  name: string; // derived from URL or user input
  url: string;
  status: 'up' | 'down' | 'degraded' | 'paused'; // derived from recent ticks
  lastChecked: string; // latest tick createdAt
  responseTime: number; // latest tick latency
  uptime: {
    current: string; // calculated uptime streak
    percentage: number; // calculated from ticks
  };
  interval: string; // monitoring frequency
  incidents: number; // calculated from status changes
  createdAt: string;
  updatedAt: string;
}

// Chart data types (derived from WebsiteTicks)
export interface ResponseTimeData {
  timestamp: string; // WebsiteTick.createdAt
  value: number; // WebsiteTick.latency
  monitorId: string; // WebsiteTick.websiteId
  location: string; // Validator.location
  status: WebsiteStatus; // WebsiteTick.status
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

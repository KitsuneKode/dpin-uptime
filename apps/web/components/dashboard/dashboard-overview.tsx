import { MetricsCards } from './metrics-cards';
import { ResponseTimeChart } from './response-time-chart';
import { RecentIncidents } from './recent-incidents';

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <MetricsCards />
      
      {/* Charts and Incidents Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Response Time Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ResponseTimeChart />
        </div>
        
        {/* Recent Incidents - Takes 1 column */}
        <div className="lg:col-span-1">
          <RecentIncidents />
        </div>
      </div>
    </div>
  );
}

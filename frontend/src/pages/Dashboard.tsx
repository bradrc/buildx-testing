import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  revenue: number;
  systemHealth: number;
  chartData: {
    labels: string[];
    values: number[];
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const chartData = {
    labels: stats.chartData.labels,
    datasets: [
      {
        label: 'Monthly Performance',
        data: stats.chartData.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
          <div className="text-green-500 text-xs mt-2">↑ 12% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Active Sessions</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.activeSessions}</p>
          <div className="text-green-500 text-xs mt-2">↑ 5% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Revenue</h3>
          <p className="text-3xl font-bold text-slate-900">$ {stats.revenue.toLocaleString()}</p>
          <div className="text-green-500 text-xs mt-2">↑ 8% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">System Health</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.systemHealth}%</p>
          <div className="text-green-500 text-xs mt-2">↑ 2% from last month</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance Trend</h2>
          <div className="h-64">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
            <button className="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
              User Management
            </button>
            <button className="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
              System Settings
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="p-4">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">John Doe</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">john@example.com</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-500">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">Jane Smith</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-500">jane@example.com</td>
                <td className="px-4 py-3 whitespace-now-sm text-500">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-500">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-900">Bob Wilson</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-500">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Inactive</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-500">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

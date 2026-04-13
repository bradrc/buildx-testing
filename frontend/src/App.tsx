import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout>
              <div className="p-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Total Users</h3>
                    <p className="text-3xl font-bold text-slate-900">1,284</p>
                    <div className="text-green-500 text-xs mt-2">↑ 12% from last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Active Sessions</h3>
                    <p className="text-3xl font-bold text-slate-900">432</p>
                    <div className="text-green-500 text-xs mt-2">↑ 5% from last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Revenue</h3>
                    <p className="text-3xl font-bold text-slate-900">,250</p>
                    <div className="text-green-500 text-xs mt-2">↑ 8% from last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">System Health</h3>
                    <p className="text-3xl font-bold text-slate-900">98%</p>
                    <div className="text-green-500 text-xs mt-2">↑ 2% from last month</div>
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                            <button className="text-blue-600 hover:underline">View</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">Jane Smith</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">jane@example.com</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-500">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                            <button className="text-blue-600 hover:underline">View</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">Bob Wilson</td>
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
            </MainLayout>
          </AuthGuard>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

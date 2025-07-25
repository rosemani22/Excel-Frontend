import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  BarChart3,
  User,
  Settings,
  Download,
  FileSpreadsheet,
  Shield,
  Activity,
  TrendingUp,
  Menu,
  X,
  Brain,
  Zap,
  Target,
  Key
} from 'lucide-react';
import FileUpload from './FileUpload';
import ChartDisplay from './ChartDisplay';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import AIInsights from './AIInsights';
import AdminKeyModal from './AdminKeyModal';
import HistoryCenter from './HistoryCenter';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentFile, setCurrentFile] = useState(null);
  const [currentChart, setCurrentChart] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [userStats, setUserStats] = useState({
    filesUploaded: 0,
    chartsCreated: 0,
    totalDownloads: 0,
    aiInsightsGenerated: 0,
    lastActivity: new Date().toISOString()
  });

  const [uploadHistory, setUploadHistory] = useState([]);
  const [user, setUser] = useState({
    name: 'Sparsh Sahni',
    email: 'sparshsahni14feb2005@gmail.com',
    role: 'user',
    joinDate: '2024-01-15',
    avatar: null,
    preferences: {
      theme: 'dark',
      notifications: true,
      defaultChartType: '2d'
    }
  });

  const sidebarItems = [
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin Panel', icon: Shield, requiresAdmin: true },
  ];

  const handleDataUpload = (data) => {
    console.log('Dashboard: Received data from upload:', data);
    setDebugInfo(`Data received: ${JSON.stringify(data, null, 2)}`);
    setCurrentFile(data);
    setCurrentChart({
      ...data,
      chartType: '2d',
      chartStyle: 'bar',
      createdAt: new Date().toISOString()
    });

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      filesUploaded: prev.filesUploaded + 1,
      chartsCreated: prev.chartsCreated + 1,
      lastActivity: new Date().toISOString()
    }));

    // Add to history
    const historyItem = {
      id: Date.now(),
      fileName: data.metadata?.fileName || `File-${Date.now()}`,
      uploadDate: new Date().toISOString(),
      dataPoints: data.labels?.length || 0,
      chartType: 'Bar Chart',
      status: 'completed',
      data: data
    };
    setUploadHistory(prev => [historyItem, ...prev]);

    setActiveTab('charts');
  };

  const handleChartTypeChange = (chartType, chartStyle) => {
    if (currentFile) {
      const updatedChart = {
        ...currentFile,
        chartType,
        chartStyle: chartStyle || 'bar',
        updatedAt: new Date().toISOString()
      };
      setCurrentChart(updatedChart);

      // Update user stats - increment charts created when type changes
      setUserStats(prev => ({
        ...prev,
        chartsCreated: prev.chartsCreated + 1,
        lastActivity: new Date().toISOString()
      }));
    }
  };

  const handleFileReload = (fileData) => {
    console.log('Dashboard: Reloading file data:', fileData);
    setCurrentFile(fileData);
    setCurrentChart({
      ...fileData,
      chartType: '2d',
      chartStyle: 'bar',
      reloadedAt: new Date().toISOString()
    });

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      lastActivity: new Date().toISOString()
    }));

    setActiveTab('charts');
  };

  const handleFileDelete = (fileId) => {
    setUploadHistory(prev => prev.filter(item => item.id !== fileId));

    // If the deleted file is currently displayed, clear it
    const deletedFile = uploadHistory.find(item => item.id === fileId);
    if (deletedFile && currentFile && currentFile.metadata?.fileName === deletedFile.fileName) {
      setCurrentFile(null);
      setCurrentChart(null);
      setActiveTab('upload');
    }

    // Update stats
    setUserStats(prev => ({
      ...prev,
      filesUploaded: Math.max(0, prev.filesUploaded - 1),
      lastActivity: new Date().toISOString()
    }));
  };

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setShowAdminKeyModal(true);
    }
  };

  const handleAdminKeySuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminKeyModal(false);
    setActiveTab('admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload onDataUpload={handleDataUpload} />;
      case 'charts':
        return <ChartDisplay
          data={currentFile}
          chart={currentChart}
          onChartTypeChange={handleChartTypeChange}
        />;
      case 'ai-insights':
        return <AIInsights
          fileData={currentFile}
          chartData={currentChart}
          onInsightGenerated={() => setUserStats(prev => ({ ...prev, aiInsightsGenerated: prev.aiInsightsGenerated + 1 }))}
        />;
      case 'history':
        return <HistoryCenter
          history={uploadHistory}
          userStats={userStats}
          onFileReload={handleFileReload}
          onFileDelete={handleFileDelete}
        />;
      case 'profile':
        return <UserProfile user={user} onUpdate={setUser} />;
      case 'admin':
        return isAdminAuthenticated ? <AdminPanel /> : null;
      default:
        return <FileUpload onDataUpload={handleDataUpload} />;
    }
  };

  	const handleLogout = () => {
		logout();
		setTimeout(() => navigate("/"), 100); // Optional slight delay 
	};

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      {/* Header */}
      <motion.header
        className="bg-gray-900 border-gray-800 border-b px-6 py-4 transition-colors duration-300"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>

            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold">Excel Analytics Platform</h1>
                <p className="text-xs text-gray-400">
                  AI Insights: <span className="text-sm font-medium text-blue-500">{userStats.aiInsightsGenerated}</span>
                  {' • '}
                  Charts Created: <span className="text-sm font-medium text-green-500">{userStats.chartsCreated}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="w-64 bg-gray-900 border-gray-800 border-r p-4 transition-colors duration-300"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => item.requiresAdmin ? handleAdminAccess() : setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'ai-insights' && (
                      <Zap className="w-4 h-4 text-yellow-500 ml-auto" />
                    )}
                    {item.requiresAdmin && !isAdminAuthenticated && (
                      <Key className="w-4 h-4 text-red-500 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Quick Stats */}
              <motion.div
                className="mt-8 p-4 bg-gray-800 rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Files Processed
                    </span>
                    <span className="text-sm font-medium">{userStats.filesUploaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      AI Insights
                    </span>
                    <span className="text-sm font-medium text-blue-500">{userStats.aiInsightsGenerated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Active Users
                    </span>
                    <span className="text-sm font-medium text-green-500">12</span>
                  </div>
                </div>
              </motion.div>

              {/* AI Status */}
              <motion.div
                className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 border rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">AI Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">
                    Online & Learning
                  </span>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          className={`flex-1 p-6 overflow-y-auto transition-colors duration-300 ${!sidebarOpen ? 'ml-0' : ''
            }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>

      {/* Admin Key Modal */}
      <AnimatePresence>
        {showAdminKeyModal && (
          <AdminKeyModal
            onClose={() => setShowAdminKeyModal(false)}
            onSuccess={handleAdminKeySuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
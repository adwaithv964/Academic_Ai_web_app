import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import MainLayout from "components/layout/MainLayout";
import NotFound from "pages/NotFound";
import ProgressTracker from './pages/progress-tracker';
import DataRoom from './pages/data-room';
import StudyPlanner from './pages/study-planner';
import Dashboard from './pages/dashboard';
import GradePredictor from './pages/grade-predictor';
import StudentProfileSettings from './pages/student-profile-settings';
import UserManagement from './pages/user-management';
import AcademicTools from './pages/academic-tools';
import AIAssistant from './pages/ai-assistant';
import TodoList from './pages/todo-list';
import Auth from './pages/auth/Auth';
import Onboarding from './pages/onboarding/Onboarding';
import Menu from './pages/menu/Menu';
import Classes from './pages/classes/Classes';
import Exams from './pages/exams/Exams';
import Vacations from './pages/vacations/Vacations';
import Xtra from './pages/xtra/Xtra';
import FocusTimer from './pages/focus-timer/FocusTimer';
import AiScheduleScan from './pages/ai-schedule-scan/AiScheduleScan';
import CalendarSync from './pages/calendar-sync/CalendarSync';
import ScheduleSetup from './pages/schedule-setup/ScheduleSetup';
import Calendar from './pages/calendar/Calendar';
import Achievements from './pages/achievements/Achievements';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementAdmin from './pages/admin/UserManagement';
import UserDetail from './pages/admin/UserDetail';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContent from './pages/admin/AdminContent';
import AdminLogs from './pages/admin/AdminLogs';
import AdminLayout from './components/layout/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-indigo-600">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

import axios from 'axios';
import Maintenance from './pages/Maintenance';

const Routes = () => {
  const [isMaintenance, setIsMaintenance] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
        const { data } = await axios.get(`${baseURL}/public/status`);
        setIsMaintenance(data.maintenanceMode);
      } catch (error) {
        console.error("System Status Check Failed", error);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  if (checkingStatus) return <div className="flex items-center justify-center min-h-screen text-indigo-600">Loading System Status...</div>;

  if (isMaintenance && !window.location.pathname.startsWith('/admin') && window.location.pathname !== '/maintenance') {
    window.location.href = '/maintenance';
    return null;
  }

  if (!isMaintenance && window.location.pathname === '/maintenance') {
    window.location.href = '/';
    return null;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } />


          <Route element={<MainLayout />}>
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/academic-tools" element={
              <PrivateRoute>
                <AcademicTools />
              </PrivateRoute>
            } />
            <Route path="/progress-tracker" element={
              <PrivateRoute>
                <ProgressTracker />
              </PrivateRoute>
            } />
            <Route path="/data-room" element={
              <PrivateRoute>
                <DataRoom />
              </PrivateRoute>
            } />
            <Route path="/study-planner" element={
              <PrivateRoute>
                <StudyPlanner />
              </PrivateRoute>
            } />
            <Route path="/grade-predictor" element={
              <PrivateRoute>
                <GradePredictor />
              </PrivateRoute>
            } />
            <Route path="/student-profile-settings" element={
              <PrivateRoute>
                <StudentProfileSettings />
              </PrivateRoute>
            } />
            <Route path="/user-management" element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } />
            <Route path="/ai-assistant" element={
              <PrivateRoute>
                <AIAssistant />
              </PrivateRoute>
            } />
            <Route path="/todo-list" element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            } />
            <Route path="/menu" element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            } />
            <Route path="/classes" element={
              <PrivateRoute>
                <Classes />
              </PrivateRoute>
            } />
            <Route path="/exams" element={
              <PrivateRoute>
                <Exams />
              </PrivateRoute>
            } />
            <Route path="/vacations" element={
              <PrivateRoute>
                <Vacations />
              </PrivateRoute>
            } />
            <Route path="/xtra" element={
              <PrivateRoute>
                <Xtra />
              </PrivateRoute>
            } />
            <Route path="/focus-timer" element={
              <PrivateRoute>
                <FocusTimer />
              </PrivateRoute>
            } />
            <Route path="/ai-scan" element={
              <PrivateRoute>
                <AiScheduleScan />
              </PrivateRoute>
            } />
            <Route path="/calendar-sync" element={
              <PrivateRoute>
                <CalendarSync />
              </PrivateRoute>
            } />
            <Route path="/schedule-setup" element={
              <PrivateRoute>
                <ScheduleSetup />
              </PrivateRoute>
            } />
            <Route path="/achievements" element={
              <PrivateRoute>
                <Achievements />
              </PrivateRoute>
            } />

            <Route path="/calendar" element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagementAdmin />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
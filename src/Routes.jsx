import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import MainLayout from "components/layout/MainLayout";
import NotFound from "pages/NotFound";
import ProgressTracker from './pages/progress-tracker';
import WhatIfAnalysis from './pages/what-if-analysis';
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
import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
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
            <Route path="/what-if-analysis" element={
              <PrivateRoute>
                <WhatIfAnalysis />
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
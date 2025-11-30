import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/academic-tools" element={<AcademicTools />} />
          <Route path="/progress-tracker" element={<ProgressTracker />} />
          <Route path="/what-if-analysis" element={<WhatIfAnalysis />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/grade-predictor" element={<GradePredictor />} />
          <Route path="/student-profile-settings" element={<StudentProfileSettings />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
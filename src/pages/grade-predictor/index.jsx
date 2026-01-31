import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseSelectionForm from './components/CourseSelectionForm';
import PredictionDashboard from './components/PredictionDashboard';
import Icon from '../../components/AppIcon';
import { predictGrades as predictGradesApi, health as apiHealth } from '../../services/api';
import { db } from '../../services/db';
import PredictionHistory from './components/PredictionHistory';

const GradePredictor = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Backend API health and error state
  const [serverAvailable, setServerAvailable] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleLoadHistory = (historyItem) => {
    setSelectedHistory(historyItem);
    if (historyItem.data) {
      setPredictionData(historyItem.data);
      setShowResults(true);
      setToastMessage("Prediction loaded from history");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await apiHealth();
        if (mounted) setServerAvailable(true);
      } catch (e) {
        if (mounted) setServerAvailable(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setShowResults(false);
    setApiError(null);

    try {
      // Gather extra data from LocalStorage
      const studySessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
      const todoTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');

      // Direct call to new backend endpoint
      // expected response: { stats: {...}, aiInsights: {...} }
      const data = await predictGradesApi({
        courseName: formData?.courseName,
        currentGrade: parseFloat(formData?.currentGrade),
        context: formData?.context,
        studyData: {
          studySessions,
          todoList: todoTasks
        }
      });

      setPredictionData(data);
      setShowResults(true);

      // Save full result to indexedDB
      try {
        await db.predictions.add({
          date: new Date(),
          courseName: formData?.courseName || 'Unknown Course',
          currentGrade: parseFloat(formData?.currentGrade),
          predictedGrade: data.stats.predictedGrade,
          data: data
        });
      } catch (dbError) {
        console.error('Failed to save to local history:', dbError);
      }

    } catch (error) {
      console.error('Prediction failed:', error);
      setApiError(error?.response?.data?.error || error?.message || 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      {/* Page Content */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Grade Predictor</h1>
                <p className="text-muted-foreground">
                  AI-powered academic performance forecasting & coaching
                </p>
              </div>
            </div>
          </div>

          {/* Backend Status Warning */}
          {!serverAvailable && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800 mb-1">Server Unavailable</h4>
                  <p className="text-sm text-amber-700">
                    The backend server appears to be offline. Predictions require the server to run the Monte Carlo simulation and AI analysis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-1">Prediction Error</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="xl:col-span-4"
          >
            <CourseSelectionForm
              onPredict={handlePredict}
              isLoading={isLoading}
              initialData={selectedHistory}
            />

            <div className="mt-8 h-[500px]">
              <PredictionHistory
                onLoad={handleLoadHistory}
                selectedId={selectedHistory?.id}
              />
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-8"
          >
            <PredictionDashboard
              data={predictionData}
              isLoading={isLoading}
            />

            {!showResults && !isLoading && !predictionData && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="BarChart2" className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Predict</h3>
                <p className="max-w-md">
                  Enter your course details on the left and click "Predict Grade" to run our advanced Monte Carlo simulation and get AI coaching.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <Icon name="CheckCircle" size={20} className="text-green-500" />
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
};

export default GradePredictor;
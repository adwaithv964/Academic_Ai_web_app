import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import CourseSelectionForm from './components/CourseSelectionForm';
import PredictionChart from './components/PredictionChart';
import PredictionBreakdown from './components/PredictionBreakdown';
import ScenarioTabs from './components/ScenarioTabs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { predictGrades as predictGradesApi, health as apiHealth } from '../../services/api';
import { db } from '../../services/db';
import PredictionHistory from './components/PredictionHistory';

const GradePredictor = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    // Populate form data (handled by passing selectedHistory to CourseSelectionForm)

    // Restore prediction results
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

  // Mock prediction data generator
  const generatePredictionData = (formData) => {
    const currentGrade = parseFloat(formData?.currentGrade);
    const predictedGrade = Math.min(100, currentGrade + Math.random() * 15 - 5);

    // Get stored GPA
    let currentGPA = 3.45;
    try {
      const settings = localStorage.getItem('academicSettings');
      if (settings) {
        currentGPA = parseFloat(JSON.parse(settings).currentGPA) || 3.45;
      }
    } catch (e) {
      console.error('Error reading GPA', e);
    }

    // Helper to calculate new GPA (simplified mock logic)
    const calculateNewGPA = (grade) => {
      // Assume this course is 3 credits and we have 90 existing credits
      // This is a rough approximation for demo purposes
      const existingCredits = 90;
      const newCredits = 3;
      const gradePoint = grade >= 90 ? 4.0 : grade >= 80 ? 3.0 : grade >= 70 ? 2.0 : grade >= 60 ? 1.0 : 0.0;
      return ((currentGPA * existingCredits + gradePoint * newCredits) / (existingCredits + newCredits)).toFixed(2);
    };

    return {
      currentGrade: currentGrade,
      predictedGrade: Math.round(predictedGrade * 100) / 100,

      // Probability distribution data for chart
      probabilityData: [
        { grade: 'F (0-59)', probability: predictedGrade < 60 ? 15 : 5 },
        { grade: 'D (60-69)', probability: predictedGrade < 70 ? 20 : 8 },
        { grade: 'C (70-79)', probability: predictedGrade < 80 ? 35 : 15 },
        { grade: 'B (80-89)', probability: predictedGrade < 90 ? 25 : 35 },
        { grade: 'A (90-100)', probability: predictedGrade >= 90 ? 40 : 20 }
      ],

      // Confidence interval data
      confidenceData: [
        { week: 'Week 1', predicted: currentGrade, upperBound: currentGrade + 5, lowerBound: currentGrade - 3 },
        { week: 'Week 2', predicted: currentGrade + 2, upperBound: currentGrade + 7, lowerBound: currentGrade - 1 },
        { week: 'Week 3', predicted: currentGrade + 4, upperBound: currentGrade + 9, lowerBound: currentGrade + 1 },
        { week: 'Week 4', predicted: predictedGrade, upperBound: predictedGrade + 5, lowerBound: predictedGrade - 3 }
      ],

      // Scenario comparison data
      scenarioData: [
        { assignment: 'Current', optimistic: currentGrade, realistic: currentGrade, pessimistic: currentGrade },
        { assignment: 'Assignment 1', optimistic: currentGrade + 3, realistic: currentGrade + 1, pessimistic: currentGrade - 1 },
        { assignment: 'Assignment 2', optimistic: currentGrade + 6, realistic: currentGrade + 2, pessimistic: currentGrade - 2 },
        { assignment: 'Final', optimistic: predictedGrade + 8, realistic: predictedGrade, pessimistic: predictedGrade - 5 }
      ],

      // Target grades breakdown
      targetGrades: [
        {
          letter: 'A',
          grade: 90,
          description: 'Excellent performance',
          requiredAverage: Math.max(90, Math.round((90 * 100 - currentGrade * (100 - formData?.remainingAssignments * 10)) / (formData?.remainingAssignments * 10))),
          difficulty: predictedGrade >= 85 ? 'Easy' : predictedGrade >= 75 ? 'Moderate' : 'Challenging'
        },
        {
          letter: 'B',
          grade: 80,
          description: 'Good performance',
          requiredAverage: Math.max(80, Math.round((80 * 100 - currentGrade * (100 - formData?.remainingAssignments * 10)) / (formData?.remainingAssignments * 10))),
          difficulty: predictedGrade >= 75 ? 'Easy' : predictedGrade >= 65 ? 'Moderate' : 'Challenging'
        },
        {
          letter: 'C',
          grade: 70,
          description: 'Satisfactory performance',
          requiredAverage: Math.max(70, Math.round((70 * 100 - currentGrade * (100 - formData?.remainingAssignments * 10)) / (formData?.remainingAssignments * 10))),
          difficulty: predictedGrade >= 65 ? 'Easy' : 'Moderate'
        },
        {
          letter: 'D',
          grade: 60,
          description: 'Minimum passing grade',
          requiredAverage: Math.max(60, Math.round((60 * 100 - currentGrade * (100 - formData?.remainingAssignments * 10)) / (formData?.remainingAssignments * 10))),
          difficulty: 'Easy'
        }
      ],

      // Recommendations
      recommendations: [
        {
          title: 'Focus on High-Weight Assignments',
          description: `Prioritize exam preparation as it accounts for ${formData?.examWeight}% of your grade. A 10% improvement here significantly impacts your final grade.`,
          impact: Math.round(formData?.examWeight / 10),
          effort: 'High',
          timeline: '2-3 weeks',
          priority: 'high',
          icon: 'BookOpen'
        },
        {
          title: 'Consistent Homework Completion',
          description: `Maintain strong homework performance (${formData?.homeworkWeight}% weight). Regular practice reinforces learning and provides steady grade improvement.`,
          impact: Math.round(formData?.homeworkWeight / 15),
          effort: 'Medium',
          timeline: 'Ongoing',
          priority: 'medium',
          icon: 'PenTool'
        },
        {
          title: 'Active Class Participation',
          description: `Increase participation (${formData?.participationWeight}% weight). Ask questions, contribute to discussions, and demonstrate engagement.`,
          impact: Math.round(formData?.participationWeight / 10),
          effort: 'Low',
          timeline: 'Immediate',
          priority: 'low',
          icon: 'MessageSquare'
        }
      ],

      // Risk assessment
      riskAssessment: [
        {
          category: 'Assignment Load',
          level: formData?.remainingAssignments > 4 ? 'high' : formData?.remainingAssignments > 2 ? 'medium' : 'low',
          description: `${formData?.remainingAssignments} assignments remaining. Heavy workload may impact quality.`,
          probability: formData?.remainingAssignments > 4 ? 75 : formData?.remainingAssignments > 2 ? 45 : 20,
          impact: 'Moderate grade reduction',
          mitigation: 'Create detailed schedule and start early'
        },
        {
          category: 'Course Difficulty',
          level: formData?.difficulty === 'hard' ? 'high' : formData?.difficulty === 'medium' ? 'medium' : 'low',
          description: `Course difficulty rated as ${formData?.difficulty}. May affect performance consistency.`,
          probability: formData?.difficulty === 'hard' ? 60 : formData?.difficulty === 'medium' ? 35 : 15,
          impact: 'Variable performance',
          mitigation: 'Seek additional help and study resources'
        },
        {
          category: 'Historical Performance',
          level: formData?.historicalPerformance === 'below-average' ? 'high' : formData?.historicalPerformance === 'average' ? 'medium' : 'low',
          description: `Past performance indicates ${formData?.historicalPerformance} results. Pattern may continue.`,
          probability: formData?.historicalPerformance === 'below-average' ? 70 : 40,
          impact: 'Consistent with past grades',
          mitigation: 'Identify and address learning gaps'
        }
      ],

      // Scenario data for tabs
      currentScenario: {
        finalGrade: Math.round(predictedGrade),
        change: Math.round(predictedGrade - currentGrade),
        letterGrade: predictedGrade >= 90 ? 'A' : predictedGrade >= 80 ? 'B' : predictedGrade >= 70 ? 'C' : predictedGrade >= 60 ? 'D' : 'F',
        gradeDescription: predictedGrade >= 90 ? 'Excellent' : predictedGrade >= 80 ? 'Good' : predictedGrade >= 70 ? 'Satisfactory' : 'Needs Improvement',
        gpaImpact: predictedGrade >= 90 ? '+0.2' : predictedGrade >= 80 ? '+0.1' : predictedGrade >= 70 ? '0.0' : '-0.1',
        overallGPA: calculateNewGPA(predictedGrade),
        probability: 65,
        requirements: [
          { category: 'Exams', requirement: 'Maintain 75% average', icon: 'BookOpen' },
          { category: 'Homework', requirement: 'Complete all assignments', icon: 'PenTool' },
          { category: 'Participation', requirement: 'Regular attendance', icon: 'Users' }
        ],
        keyFactors: [
          { title: 'Study Consistency', description: 'Regular study schedule', importance: 'high', icon: 'Clock' },
          { title: 'Assignment Quality', description: 'Thorough completion', importance: 'medium', icon: 'CheckSquare' },
          { title: 'Help Seeking', description: 'Ask questions when needed', importance: 'medium', icon: 'HelpCircle' }
        ],
        actions: [
          'Create weekly study schedule',
          'Review previous assignments for patterns',
          'Schedule office hours with instructor',
          'Form study group with classmates'
        ]
      },

      optimisticScenario: {
        finalGrade: Math.min(100, Math.round(predictedGrade + 8)),
        change: Math.round(predictedGrade + 8 - currentGrade),
        letterGrade: 'A',
        gradeDescription: 'Excellent',
        gpaImpact: '+0.3',
        overallGPA: calculateNewGPA(predictedGrade + 8),
        probability: 25,
        requirements: [
          { category: 'Exams', requirement: 'Score 90%+ on remaining', icon: 'BookOpen' },
          { category: 'Homework', requirement: 'Perfect completion', icon: 'PenTool' },
          { category: 'Participation', requirement: 'Active engagement', icon: 'Users' }
        ],
        keyFactors: [
          { title: 'Peak Performance', description: 'Exceed expectations', importance: 'high', icon: 'Star' },
          { title: 'Extra Credit', description: 'Pursue bonus opportunities', importance: 'medium', icon: 'Plus' },
          { title: 'Perfect Attendance', description: 'Never miss class', importance: 'low', icon: 'Calendar' }
        ],
        actions: [
          'Dedicate extra study time daily',
          'Seek extra credit opportunities',
          'Form advanced study groups',
          'Get tutoring for challenging topics'
        ]
      },

      conservativeScenario: {
        finalGrade: Math.max(0, Math.round(predictedGrade - 5)),
        change: Math.round(predictedGrade - 5 - currentGrade),
        letterGrade: predictedGrade - 5 >= 80 ? 'B' : predictedGrade - 5 >= 70 ? 'C' : predictedGrade - 5 >= 60 ? 'D' : 'F',
        gradeDescription: predictedGrade - 5 >= 70 ? 'Satisfactory' : 'Needs Improvement',
        gpaImpact: '-0.1',
        overallGPA: calculateNewGPA(predictedGrade - 5),
        probability: 35,
        requirements: [
          { category: 'Exams', requirement: 'Minimum 65% average', icon: 'BookOpen' },
          { category: 'Homework', requirement: 'Submit 80% of assignments', icon: 'PenTool' },
          { category: 'Participation', requirement: 'Basic attendance', icon: 'Users' }
        ],
        keyFactors: [
          { title: 'Time Management', description: 'Balance competing priorities', importance: 'high', icon: 'Clock' },
          { title: 'Stress Management', description: 'Handle academic pressure', importance: 'high', icon: 'Heart' },
          { title: 'Basic Understanding', description: 'Grasp core concepts', importance: 'medium', icon: 'Brain' }
        ],
        actions: [
          'Focus on core requirements only',
          'Prioritize high-impact assignments',
          'Seek help early when struggling',
          'Maintain minimum attendance'
        ]
      }
    };
  };

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setShowResults(false);
    setApiError(null);

    let resultData = null;

    try {
      // Prefer backend prediction if server is available
      if (serverAvailable) {
        const aiPrediction = await predictGradesApi({
          currentGrade: parseFloat(formData?.currentGrade),
          courseName: formData?.courseName,
          difficulty: formData?.difficulty,
          remainingAssignments: parseInt(formData?.remainingAssignments),
          examWeight: parseFloat(formData?.examWeight),
          homeworkWeight: parseFloat(formData?.homeworkWeight),
          participationWeight: parseFloat(formData?.participationWeight),
          historicalPerformance: formData?.historicalPerformance,
          studyHours: parseInt(formData?.studyHours || 10),
          attendanceRate: parseFloat(formData?.attendanceRate || 95)
        });

        // Transform AI response to match existing UI format
        const transformedData = {
          currentGrade: parseFloat(formData?.currentGrade),
          predictedGrade: aiPrediction?.predictedGrade,

          // Convert AI probability distribution
          probabilityData: aiPrediction?.probabilityDistribution?.map(item => ({
            grade: item?.grade,
            probability: Math.round(item?.probability * 100)
          })) || [],

          // Use AI recommendations
          recommendations: aiPrediction?.recommendations?.map(rec => ({
            title: rec?.title,
            description: rec?.description,
            impact: rec?.impact,
            effort: rec?.effort,
            timeline: rec?.timeline,
            priority: rec?.priority,
            icon: 'BookOpen'
          })) || [],

          // Use AI risk assessment
          riskAssessment: aiPrediction?.riskFactors?.map(risk => ({
            category: risk?.category,
            level: risk?.level,
            description: risk?.description,
            probability: risk?.level === 'high' ? 70 : risk?.level === 'medium' ? 45 : 20,
            impact: 'Potential grade impact',
            mitigation: risk?.mitigation
          })) || [],

          // Use AI target grades
          targetGrades: aiPrediction?.targetGrades || [],

          // Generate confidence data based on AI prediction
          confidenceData: [
            { week: 'Week 1', predicted: parseFloat(formData?.currentGrade), upperBound: parseFloat(formData?.currentGrade) + 5, lowerBound: parseFloat(formData?.currentGrade) - 3 },
            { week: 'Week 2', predicted: parseFloat(formData?.currentGrade) + 2, upperBound: parseFloat(formData?.currentGrade) + 7, lowerBound: parseFloat(formData?.currentGrade) - 1 },
            { week: 'Week 3', predicted: parseFloat(formData?.currentGrade) + 4, upperBound: parseFloat(formData?.currentGrade) + 9, lowerBound: parseFloat(formData?.currentGrade) + 1 },
            { week: 'Week 4', predicted: aiPrediction?.predictedGrade, upperBound: aiPrediction?.predictedGrade + 5, lowerBound: aiPrediction?.predictedGrade - 3 }
          ],

          // Generate scenario data from AI scenarios
          scenarioData: [
            { assignment: 'Current', optimistic: parseFloat(formData?.currentGrade), realistic: parseFloat(formData?.currentGrade), pessimistic: parseFloat(formData?.currentGrade) },
            { assignment: 'Assignment 1', optimistic: parseFloat(formData?.currentGrade) + 3, realistic: parseFloat(formData?.currentGrade) + 1, pessimistic: parseFloat(formData?.currentGrade) - 1 },
            { assignment: 'Assignment 2', optimistic: parseFloat(formData?.currentGrade) + 6, realistic: parseFloat(formData?.currentGrade) + 2, pessimistic: parseFloat(formData?.currentGrade) - 2 },
            { assignment: 'Final', optimistic: aiPrediction?.scenarios?.optimistic?.finalGrade || aiPrediction?.predictedGrade + 8, realistic: aiPrediction?.predictedGrade, pessimistic: aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5 }
          ],

          // Create scenario tabs data using AI scenarios
          currentScenario: {
            finalGrade: Math.round(aiPrediction?.predictedGrade),
            change: Math.round(aiPrediction?.predictedGrade - parseFloat(formData?.currentGrade)),
            letterGrade: aiPrediction?.letterGrade,
            gradeDescription: aiPrediction?.predictedGrade >= 90 ? 'Excellent' : aiPrediction?.predictedGrade >= 80 ? 'Good' : aiPrediction?.predictedGrade >= 70 ? 'Satisfactory' : 'Needs Improvement',
            gpaImpact: aiPrediction?.predictedGrade >= 90 ? '+0.2' : aiPrediction?.predictedGrade >= 80 ? '+0.1' : aiPrediction?.predictedGrade >= 70 ? '0.0' : '-0.1',
            overallGPA: '3.45',
            probability: Math.round(aiPrediction?.confidence * 100),
            requirements: aiPrediction?.scenarios?.realistic?.requirements?.map(req => ({
              category: req,
              requirement: req,
              icon: 'BookOpen'
            })) || [
                { category: 'Exams', requirement: 'Maintain 75% average', icon: 'BookOpen' },
                { category: 'Homework', requirement: 'Complete all assignments', icon: 'PenTool' },
                { category: 'Participation', requirement: 'Regular attendance', icon: 'Users' }
              ],
            keyFactors: [
              { title: 'Study Consistency', description: 'Regular study schedule', importance: 'high', icon: 'Clock' },
              { title: 'Assignment Quality', description: 'Thorough completion', importance: 'medium', icon: 'CheckSquare' },
              { title: 'Help Seeking', description: 'Ask questions when needed', importance: 'medium', icon: 'HelpCircle' }
            ],
            actions: [
              'Create weekly study schedule',
              'Review previous assignments for patterns',
              'Schedule office hours with instructor',
              'Form study group with classmates'
            ]
          },

          optimisticScenario: {
            finalGrade: aiPrediction?.scenarios?.optimistic?.finalGrade || Math.min(100, Math.round(aiPrediction?.predictedGrade + 8)),
            change: Math.round((aiPrediction?.scenarios?.optimistic?.finalGrade || aiPrediction?.predictedGrade + 8) - parseFloat(formData?.currentGrade)),
            letterGrade: 'A',
            gradeDescription: 'Excellent',
            gpaImpact: '+0.3',
            overallGPA: '3.65',
            probability: Math.round((aiPrediction?.scenarios?.optimistic?.probability || 0.25) * 100),
            requirements: aiPrediction?.scenarios?.optimistic?.requirements?.map(req => ({
              category: req,
              requirement: req,
              icon: 'BookOpen'
            })) || [
                { category: 'Exams', requirement: 'Score 90%+ on remaining', icon: 'BookOpen' },
                { category: 'Homework', requirement: 'Perfect completion', icon: 'PenTool' },
                { category: 'Participation', requirement: 'Active engagement', icon: 'Users' }
              ],
            keyFactors: [
              { title: 'Peak Performance', description: 'Exceed expectations', importance: 'high', icon: 'Star' },
              { title: 'Extra Credit', description: 'Pursue bonus opportunities', importance: 'medium', icon: 'Plus' },
              { title: 'Perfect Attendance', description: 'Never miss class', importance: 'low', icon: 'Calendar' }
            ],
            actions: [
              'Dedicate extra study time daily',
              'Seek extra credit opportunities',
              'Form advanced study groups',
              'Get tutoring for challenging topics'
            ]
          },

          conservativeScenario: {
            finalGrade: aiPrediction?.scenarios?.conservative?.finalGrade || Math.max(0, Math.round(aiPrediction?.predictedGrade - 5)),
            change: Math.round((aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5) - parseFloat(formData?.currentGrade)),
            letterGrade: (aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5) >= 80 ? 'B' : (aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5) >= 70 ? 'C' : (aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5) >= 60 ? 'D' : 'F',
            gradeDescription: (aiPrediction?.scenarios?.conservative?.finalGrade || aiPrediction?.predictedGrade - 5) >= 70 ? 'Satisfactory' : 'Needs Improvement',
            gpaImpact: '-0.1',
            overallGPA: '3.25',
            probability: Math.round((aiPrediction?.scenarios?.conservative?.probability || 0.35) * 100),
            requirements: aiPrediction?.scenarios?.conservative?.requirements?.map(req => ({
              category: req,
              requirement: req,
              icon: 'BookOpen'
            })) || [
                { category: 'Exams', requirement: 'Minimum 65% average', icon: 'BookOpen' },
                { category: 'Homework', requirement: 'Submit 80% of assignments', icon: 'PenTool' },
                { category: 'Participation', requirement: 'Basic attendance', icon: 'Users' }
              ],
            keyFactors: [
              { title: 'Time Management', description: 'Balance competing priorities', importance: 'high', icon: 'Clock' },
              { title: 'Stress Management', description: 'Handle academic pressure', importance: 'high', icon: 'Heart' },
              { title: 'Basic Understanding', description: 'Grasp core concepts', importance: 'medium', icon: 'Brain' }
            ],
            actions: [
              'Focus on core requirements only',
              'Prioritize high-impact assignments',
              'Seek help early when struggling',
              'Maintain minimum attendance'
            ]
          }
        };

        resultData = transformedData;
        setPredictionData(transformedData);
      } else {
        // Fallback to mock data if backend not available
        const mockData = generatePredictionData(formData);
        resultData = mockData;
        setPredictionData(mockData);
      }
    } catch (error) {
      console.error('Prediction failed, falling back to mock data:', error);
      setApiError(error?.message || 'Prediction service is unavailable. Using demo results.');
      // Fallback to mock data if AI fails
      const mockData = generatePredictionData(formData);
      resultData = mockData;
      setPredictionData(mockData);
    } finally {
      setIsLoading(false);
      setShowResults(true);

      // Save to offline database
      try {
        if (resultData) {
          await db.predictions.add({
            date: new Date(),
            courseName: formData?.courseName || 'Unknown Course',
            currentGrade: parseFloat(formData?.currentGrade),
            predictedGrade: resultData.predictedGrade,
            data: resultData // Store full object for retrieval
          });
          console.log('Prediction saved to offline database');
        }
      } catch (dbError) {
        console.error('Failed to save to offline database:', dbError);
      }
    }
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSave = () => {
    // Prediction is already auto-saved to DB in handlePredict
    // Just show a success message to the user
    setToastMessage("Prediction saved successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main className={`
        transition-academic-slow pt-16 pb-20 lg:pb-8
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
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
                    {serverAvailable ? 'Server-backed academic performance forecasting' : 'Academic performance forecasting (Demo Mode)'}
                  </p>
                </div>
              </div>

            </div>

            {/* Backend Status */}
            {!serverAvailable && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800 mb-1">Demo Mode Active</h4>
                    <p className="text-sm text-amber-700 mb-2">Backend prediction service not detected. Start the server to enable live predictions.</p>
                    <p className="text-xs text-amber-600">
                      Currently showing mock data for demonstration purposes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show API Error if any */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 mb-1">AI Service Error</h4>
                    <p className="text-sm text-red-700 mb-2">{apiError}</p>
                    <p className="text-xs text-red-600">Falling back to demo predictions.</p>
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

            {/* Right Column - Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-8"
            >
              <PredictionChart predictionData={predictionData} isVisible={showResults} />

              {/* Results Section moved here for better layout */}
              {showResults && predictionData && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 space-y-8"
                >
                  <PredictionBreakdown
                    predictionData={predictionData}
                    isVisible={showResults}
                    onSave={handleSave}
                  />
                  <ScenarioTabs predictionData={predictionData} isVisible={showResults} />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-300"
            >
              <div className="bg-card rounded-lg border border-border p-8 max-w-sm mx-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Brain" size={24} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {'Analyzing Your Data'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {'Processing your academic information...'}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}

        </div>
      </main >

      {/* Toast Notification */}
      {
        toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Icon name="CheckCircle" size={20} className="text-green-500" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )
      }
    </div >
  );
};

export default GradePredictor;
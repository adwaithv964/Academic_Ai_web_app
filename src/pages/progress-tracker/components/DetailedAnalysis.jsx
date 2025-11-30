import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DetailedAnalysis = () => {
  const [selectedCourse, setSelectedCourse] = useState('mathematics');
  const [analysisView, setAnalysisView] = useState('assignments');

  const courseOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' }
  ];

  const viewOptions = [
    { value: 'assignments', label: 'Assignment Breakdown' },
    { value: 'trends', label: 'Performance Trends' },
    { value: 'comparison', label: 'Peer Comparison' }
  ];

  const assignmentData = [
    { name: 'Quiz 1', score: 95, maxScore: 100, type: 'Quiz', date: '2024-08-15' },
    { name: 'HW 1', score: 88, maxScore: 100, type: 'Homework', date: '2024-08-20' },
    { name: 'Midterm', score: 92, maxScore: 100, type: 'Exam', date: '2024-09-01' },
    { name: 'Quiz 2', score: 87, maxScore: 100, type: 'Quiz', date: '2024-09-05' },
    { name: 'Project', score: 96, maxScore: 100, type: 'Project', date: '2024-09-10' },
    { name: 'HW 2', score: 90, maxScore: 100, type: 'Homework', date: '2024-09-15' }
  ];

  const trendsData = [
    { week: 'Week 1', score: 88, average: 85 },
    { week: 'Week 2', score: 92, average: 87 },
    { week: 'Week 3', score: 87, average: 86 },
    { week: 'Week 4', score: 95, average: 88 },
    { week: 'Week 5', score: 90, average: 89 },
    { week: 'Week 6', score: 96, average: 90 }
  ];

  const comparisonData = [
    { category: 'Quizzes', myScore: 91, classAverage: 85, topPerformer: 98 },
    { category: 'Homework', myScore: 89, classAverage: 82, topPerformer: 95 },
    { category: 'Exams', myScore: 92, classAverage: 78, topPerformer: 96 },
    { category: 'Projects', myScore: 96, classAverage: 88, topPerformer: 99 }
  ];

  const getAssignmentTypeColor = (type) => {
    switch (type) {
      case 'Quiz':
        return '#0f766e';
      case 'Homework':
        return '#1e40af';
      case 'Exam':
        return '#dc2626';
      case 'Project':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 academic-shadow">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey}: {entry?.value}
              {entry?.dataKey === 'score' && entry?.payload?.maxScore && `/${entry?.payload?.maxScore}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderAnalysisContent = () => {
    switch (analysisView) {
      case 'assignments':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assignmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="score" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            {/* Assignment Details Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Assignment</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentData?.map((assignment, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-academic">
                      <td className="py-3 px-4 font-medium text-foreground">{assignment?.name}</td>
                      <td className="py-3 px-4">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getAssignmentTypeColor(assignment?.type) }}
                        >
                          {assignment?.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {assignment?.score}/{assignment?.maxScore}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(assignment.date)?.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className={`
                                h-2 rounded-full
                                ${assignment?.score >= 90 ? 'bg-success' : 
                                  assignment?.score >= 80 ? 'bg-primary' : 
                                  assignment?.score >= 70 ? 'bg-warning' : 'bg-error'}
                              `}
                              style={{ width: `${assignment?.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignment?.score}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="week" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={[70, 100]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 6 }}
                name="My Score"
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="var(--color-muted-foreground)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-muted-foreground)', strokeWidth: 2, r: 4 }}
                name="Class Average"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="myScore" fill="var(--color-primary)" name="My Score" />
              <Bar dataKey="classAverage" fill="var(--color-muted-foreground)" name="Class Average" />
              <Bar dataKey="topPerformer" fill="var(--color-success)" name="Top Performer" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg academic-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Detailed Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Deep dive into course-specific performance metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              options={courseOptions}
              value={selectedCourse}
              onChange={setSelectedCourse}
              className="w-48"
            />
            <Select
              options={viewOptions}
              value={analysisView}
              onChange={setAnalysisView}
              className="w-48"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Course Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Grade</p>
                <p className="text-xl font-bold text-primary">92%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Icon name="Target" size={20} className="text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Class Rank</p>
                <p className="text-xl font-bold text-success">3rd</p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Icon name="Award" size={20} className="text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-xl font-bold text-secondary">+5.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        {renderAnalysisContent()}
      </div>
    </div>
  );
};

export default DetailedAnalysis;
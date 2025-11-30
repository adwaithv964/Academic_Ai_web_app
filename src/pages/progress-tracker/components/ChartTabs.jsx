import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ChartTabs = () => {
  const [activeTab, setActiveTab] = useState('gpa');

  const tabs = [
    { id: 'gpa', label: 'GPA Trends', icon: 'TrendingUp' },
    { id: 'courses', label: 'Course Performance', icon: 'BarChart3' },
    { id: 'assignments', label: 'Assignment Scores', icon: 'PieChart' }
  ];

  const gpaData = [
    { semester: 'Fall 2022', gpa: 3.2, target: 3.5 },
    { semester: 'Spring 2023', gpa: 3.4, target: 3.5 },
    { semester: 'Fall 2023', gpa: 3.6, target: 3.7 },
    { semester: 'Spring 2024', gpa: 3.67, target: 3.7 },
    { semester: 'Fall 2024', gpa: 3.8, target: 3.8 }
  ];

  const courseData = [
    { course: 'Mathematics', score: 92, credits: 4 },
    { course: 'Physics', score: 88, credits: 3 },
    { course: 'Chemistry', score: 85, credits: 3 },
    { course: 'Computer Science', score: 94, credits: 4 },
    { course: 'English', score: 87, credits: 2 },
    { course: 'History', score: 90, credits: 3 }
  ];

  const assignmentData = [
    { name: 'Excellent (90-100)', value: 45, color: '#059669' },
    { name: 'Good (80-89)', value: 35, color: '#0f766e' },
    { name: 'Average (70-79)', value: 15, color: '#f59e0b' },
    { name: 'Below Average (<70)', value: 5, color: '#dc2626' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 academic-shadow">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'gpa':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={gpaData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="semester" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                domain={[2.5, 4.0]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'var(--color-primary)' }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-muted-foreground)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-muted-foreground)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'courses':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="course" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'assignments':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={assignmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {assignmentData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg academic-shadow">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-academic
                ${activeTab === tab?.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Chart Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {tabs?.find(tab => tab?.id === activeTab)?.label}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === 'gpa' && 'Track your GPA progression over time with target goals'}
            {activeTab === 'courses' && 'Compare performance across different courses'}
            {activeTab === 'assignments' && 'Distribution of assignment scores by grade range'}
          </p>
        </div>
        
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartTabs;
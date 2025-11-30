import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const GPAChart = ({ scenarios, chartType = 'line' }) => {
  const chartData = [
    { semester: 'Fall 2023', current: 3.2, scenario1: 3.2, scenario2: 3.2, scenario3: 3.2 },
    { semester: 'Spring 2024', current: 3.4, scenario1: 3.4, scenario2: 3.4, scenario3: 3.4 },
    { semester: 'Fall 2024', current: 3.6, scenario1: 3.8, scenario2: 3.5, scenario3: 3.9 },
    { semester: 'Spring 2025', current: null, scenario1: 3.7, scenario2: 3.4, scenario3: 3.8 },
    { semester: 'Fall 2025', current: null, scenario1: 3.6, scenario2: 3.3, scenario3: 3.7 }
  ];

  const scenarioColors = {
    current: '#6b7280',
    scenario1: '#1e40af',
    scenario2: '#059669',
    scenario3: '#d97706'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 academic-shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground capitalize">
                {entry?.dataKey === 'current' ? 'Current GPA' : 
                 entry?.dataKey === 'scenario1' ? 'Optimistic Scenario' :
                 entry?.dataKey === 'scenario2'? 'Conservative Scenario' : 'Realistic Scenario'}:
              </span>
              <span className="font-medium text-foreground">
                {entry?.value ? entry?.value?.toFixed(2) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="semester" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 4.0]}
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="current" 
            fill={scenarioColors?.current} 
            name="Current GPA"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="scenario1" 
            fill={scenarioColors?.scenario1} 
            name="Optimistic Scenario"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="scenario2" 
            fill={scenarioColors?.scenario2} 
            name="Conservative Scenario"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="scenario3" 
            fill={scenarioColors?.scenario3} 
            name="Realistic Scenario"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      );
    }

    return (
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="semester" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          domain={[0, 4.0]}
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="current" 
          stroke={scenarioColors?.current}
          strokeWidth={3}
          dot={{ fill: scenarioColors?.current, strokeWidth: 2, r: 4 }}
          name="Current GPA"
          connectNulls={false}
        />
        <Line 
          type="monotone" 
          dataKey="scenario1" 
          stroke={scenarioColors?.scenario1}
          strokeWidth={2}
          dot={{ fill: scenarioColors?.scenario1, strokeWidth: 2, r: 4 }}
          name="Optimistic Scenario"
          strokeDasharray="5 5"
        />
        <Line 
          type="monotone" 
          dataKey="scenario2" 
          stroke={scenarioColors?.scenario2}
          strokeWidth={2}
          dot={{ fill: scenarioColors?.scenario2, strokeWidth: 2, r: 4 }}
          name="Conservative Scenario"
          strokeDasharray="10 5"
        />
        <Line 
          type="monotone" 
          dataKey="scenario3" 
          stroke={scenarioColors?.scenario3}
          strokeWidth={2}
          dot={{ fill: scenarioColors?.scenario3, strokeWidth: 2, r: 4 }}
          name="Realistic Scenario"
          strokeDasharray="15 5"
        />
      </LineChart>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">GPA Projection Analysis</h2>
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Semester Comparison</span>
        </div>
      </div>

      <div className="w-full h-80 mb-6" aria-label="GPA Projection Chart">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend with Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm font-medium text-foreground">Current GPA</span>
          </div>
          <p className="text-lg font-semibold text-foreground">3.60</p>
          <p className="text-xs text-muted-foreground">Based on completed courses</p>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-700" />
            <span className="text-sm font-medium text-primary">Optimistic</span>
          </div>
          <p className="text-lg font-semibold text-primary">3.75</p>
          <p className="text-xs text-muted-foreground">Best case scenario</p>
        </div>

        <div className="p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-sm font-medium text-success">Conservative</span>
          </div>
          <p className="text-lg font-semibold text-success">3.45</p>
          <p className="text-xs text-muted-foreground">Cautious approach</p>
        </div>

        <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-amber-600" />
            <span className="text-sm font-medium text-warning">Realistic</span>
          </div>
          <p className="text-lg font-semibold text-warning">3.68</p>
          <p className="text-xs text-muted-foreground">Most likely outcome</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Lightbulb" size={16} className="text-accent" />
          <span className="text-sm font-medium text-accent">Key Insights</span>
        </div>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <Icon name="ArrowUp" size={14} className="text-success mt-0.5" />
            <span>Optimistic scenario shows +0.15 GPA improvement by graduation</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Target" size={14} className="text-primary mt-0.5" />
            <span>Realistic scenario maintains strong academic standing above 3.6</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="AlertTriangle" size={14} className="text-warning mt-0.5" />
            <span>Conservative scenario requires attention to maintain current GPA</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GPAChart;
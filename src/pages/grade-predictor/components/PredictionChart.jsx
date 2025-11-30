import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const PredictionChart = ({ predictionData, isVisible }) => {
  if (!predictionData) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 academic-shadow">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="BarChart3" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Prediction Data</h3>
          <p className="text-muted-foreground">Fill out the form and click "Predict Grade" to see your results</p>
        </div>
      </div>
    );
  }

  const { probabilityData, confidenceData, scenarioData, currentGrade, predictedGrade } = predictionData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 academic-shadow">
          <p className="font-medium text-foreground">{`Grade: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg border border-border p-6 academic-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Prediction Results</h2>
          <p className="text-sm text-muted-foreground">AI-powered grade forecast with confidence intervals</p>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Current Grade</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{currentGrade}%</p>
        </div>

        <div className="bg-success/5 rounded-lg p-4 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Predicted Grade</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{predictedGrade}%</p>
        </div>

        <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Confidence</span>
          </div>
          <p className="text-2xl font-bold text-foreground">87%</p>
        </div>
      </div>
      {/* Probability Distribution Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Grade Probability Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={probabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="grade" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="probability" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Confidence Interval Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Confidence Intervals</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="week" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="upperBound"
                stackId="1"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stackId="1"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Scenario Comparison */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Scenario Comparison</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="assignment" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="optimistic"
                stroke="var(--color-success)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 3 }}
                name="Optimistic"
              />
              <Line
                type="monotone"
                dataKey="realistic"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 3 }}
                name="Realistic"
              />
              <Line
                type="monotone"
                dataKey="pessimistic"
                stroke="var(--color-error)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 3 }}
                name="Pessimistic"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Chart Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">Optimistic Scenario</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Realistic Scenario</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-sm text-muted-foreground">Pessimistic Scenario</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionChart;
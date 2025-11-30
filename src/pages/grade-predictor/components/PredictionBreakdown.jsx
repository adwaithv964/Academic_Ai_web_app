import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictionBreakdown = ({ predictionData, isVisible }) => {
  if (!predictionData) return null;

  const { targetGrades, recommendations, riskAssessment } = predictionData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 80) return 'text-primary';
    if (grade >= 70) return 'text-accent';
    if (grade >= 60) return 'text-warning';
    return 'text-error';
  };

  const getGradeBg = (grade) => {
    if (grade >= 90) return 'bg-success/10 border-success/20';
    if (grade >= 80) return 'bg-primary/10 border-primary/20';
    if (grade >= 70) return 'bg-accent/10 border-accent/20';
    if (grade >= 60) return 'bg-warning/10 border-warning/20';
    return 'bg-error/10 border-error/20';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'high': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'low': return 'CheckCircle';
      case 'medium': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      default: return 'Info';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="space-y-6"
    >
      {/* Target Grades Section */}
      <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6 academic-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Required Scores for Target Grades</h3>
            <p className="text-sm text-muted-foreground">What you need to achieve specific letter grades</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetGrades?.map((target, index) => (
            <div key={index} className={`rounded-lg border p-4 ${getGradeBg(target?.grade)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-foreground">{target?.letter}</span>
                <span className={`text-lg font-semibold ${getGradeColor(target?.grade)}`}>
                  {target?.grade}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{target?.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Required avg:</span>
                  <span className="font-medium text-foreground">{target?.requiredAverage}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className={`font-medium ${
                    target?.difficulty === 'Easy' ? 'text-success' :
                    target?.difficulty === 'Moderate' ? 'text-warning' : 'text-error'
                  }`}>
                    {target?.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Recommendations Section */}
      <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6 academic-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Lightbulb" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Improvement Recommendations</h3>
            <p className="text-sm text-muted-foreground">AI-powered suggestions to boost your grade</p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations?.map((rec, index) => (
            <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                rec?.priority === 'high' ? 'bg-error/10' :
                rec?.priority === 'medium' ? 'bg-warning/10' : 'bg-success/10'
              }`}>
                <Icon 
                  name={rec?.icon} 
                  size={16} 
                  className={
                    rec?.priority === 'high' ? 'text-error' :
                    rec?.priority === 'medium' ? 'text-warning' : 'text-success'
                  } 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{rec?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec?.priority === 'high' ? 'bg-error/10 text-error' :
                    rec?.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {rec?.priority} priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec?.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Impact: +{rec?.impact}%</span>
                  <span>Effort: {rec?.effort}</span>
                  <span>Timeline: {rec?.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Risk Assessment Section */}
      <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6 academic-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Potential challenges and mitigation strategies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskAssessment?.map((risk, index) => (
            <div key={index} className={`rounded-lg border p-4 ${getRiskColor(risk?.level)}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name={getRiskIcon(risk?.level)} size={20} />
                <span className="font-medium">{risk?.category}</span>
              </div>
              <p className="text-sm mb-3">{risk?.description}</p>
              <div className="space-y-2">
                <div className="text-xs opacity-80">
                  <strong>Probability:</strong> {risk?.probability}%
                </div>
                <div className="text-xs opacity-80">
                  <strong>Impact:</strong> {risk?.impact}
                </div>
                {risk?.mitigation && (
                  <div className="text-xs opacity-80">
                    <strong>Mitigation:</strong> {risk?.mitigation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          iconName="Save"
          iconPosition="left"
          className="flex-1"
        >
          Save Prediction
        </Button>
        
        <Button
          variant="outline"
          iconName="Calculator"
          iconPosition="left"
          className="flex-1"
        >
          What-If Analysis
        </Button>
        
        <Button
          variant="outline"
          iconName="Calendar"
          iconPosition="left"
          className="flex-1"
        >
          Create Study Plan
        </Button>
        
        <Button
          variant="ghost"
          iconName="Download"
          iconPosition="left"
        >
          Export Results
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PredictionBreakdown;
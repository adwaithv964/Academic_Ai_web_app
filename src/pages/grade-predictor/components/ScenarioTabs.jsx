import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScenarioTabs = ({ predictionData, isVisible }) => {
  const [activeTab, setActiveTab] = useState('current');

  if (!predictionData) return null;

  const scenarios = [
    {
      id: 'current',
      label: 'Current Trajectory',
      icon: 'TrendingUp',
      description: 'Based on your current performance',
      data: predictionData?.currentScenario
    },
    {
      id: 'optimistic',
      label: 'Best Case',
      icon: 'Star',
      description: 'If you excel in remaining assignments',
      data: predictionData?.optimisticScenario
    },
    {
      id: 'conservative',
      label: 'Conservative',
      icon: 'Shield',
      description: 'Accounting for potential setbacks',
      data: predictionData?.conservativeScenario
    }
  ];

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getScenarioColor = (scenarioId) => {
    switch (scenarioId) {
      case 'optimistic': return 'text-success border-success bg-success/5';
      case 'conservative': return 'text-warning border-warning bg-warning/5';
      default: return 'text-primary border-primary bg-primary/5';
    }
  };

  const getScenarioIcon = (scenarioId) => {
    switch (scenarioId) {
      case 'optimistic': return 'TrendingUp';
      case 'conservative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg border border-border p-6 academic-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="GitCompare" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scenario Comparison</h3>
          <p className="text-sm text-muted-foreground">Compare different academic outcomes</p>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        {scenarios?.map((scenario) => (
          <motion.button
            key={scenario?.id}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: scenarios?.indexOf(scenario) * 0.1 }}
            onClick={() => setActiveTab(scenario?.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border transition-academic text-left flex-1
              ${activeTab === scenario?.id 
                ? getScenarioColor(scenario?.id)
                : 'text-muted-foreground border-border hover:bg-muted/30'
              }
            `}
          >
            <Icon name={scenario?.icon} size={16} />
            <div>
              <div className="font-medium">{scenario?.label}</div>
              <div className="text-xs opacity-80">{scenario?.description}</div>
            </div>
          </motion.button>
        ))}
      </div>
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        {scenarios?.map((scenario) => {
          if (scenario?.id !== activeTab) return null;

          return (
            <div key={scenario?.id} className="space-y-6">
              {/* Scenario Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Target" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Final Grade</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{scenario?.data?.finalGrade}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name={getScenarioIcon(scenario?.id)} size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {scenario?.data?.change > 0 ? '+' : ''}{scenario?.data?.change}% from current
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Award" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Letter Grade</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{scenario?.data?.letterGrade}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenario?.data?.gradeDescription}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Zap" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">GPA Impact</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{scenario?.data?.gpaImpact}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall GPA: {scenario?.data?.overallGPA}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Percent" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Probability</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{scenario?.data?.probability}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Likelihood of outcome</p>
                </div>
              </div>
              {/* Required Performance */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Required Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenario?.data?.requirements?.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={req?.icon} size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{req?.category}</p>
                        <p className="text-sm text-muted-foreground">{req?.requirement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Key Factors */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Key Success Factors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scenario?.data?.keyFactors?.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        factor?.importance === 'high' ? 'bg-error/10' :
                        factor?.importance === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                      }`}>
                        <Icon 
                          name={factor?.icon} 
                          size={12} 
                          className={
                            factor?.importance === 'high' ? 'text-error' :
                            factor?.importance === 'medium' ? 'text-warning' : 'text-success'
                          } 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{factor?.title}</p>
                        <p className="text-xs text-muted-foreground">{factor?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Action Items */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="CheckSquare" size={16} className="text-primary" />
                  <h4 className="font-medium text-primary">Recommended Actions</h4>
                </div>
                <div className="space-y-2">
                  {scenario?.data?.actions?.map((action, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-primary rounded flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-primary opacity-0" />
                      </div>
                      <span className="text-sm text-foreground">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
      {/* Comparison Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          iconName="GitCompare"
          iconPosition="left"
          className="flex-1"
        >
          Compare All Scenarios
        </Button>
        
        <Button
          variant="outline"
          iconName="Calculator"
          iconPosition="left"
          className="flex-1"
        >
          Run What-If Analysis
        </Button>
        
        <Button
          variant="ghost"
          iconName="Share"
          iconPosition="left"
        >
          Share Scenarios
        </Button>
      </div>
    </motion.div>
  );
};

export default ScenarioTabs;
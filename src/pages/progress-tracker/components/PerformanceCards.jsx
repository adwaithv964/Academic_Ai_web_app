import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceCards = () => {
  const performanceData = [
    {
      id: 1,
      title: "Current GPA",
      value: "3.67",
      change: "+0.23",
      changeType: "positive",
      icon: "TrendingUp",
      description: "vs last semester",
      color: "bg-success/10 text-success border-success/20"
    },
    {
      id: 2,
      title: "Course Average",
      value: "87.4%",
      change: "+5.2%",
      changeType: "positive",
      icon: "BarChart3",
      description: "across all subjects",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      id: 3,
      title: "Assignments Completed",
      value: "24/28",
      change: "85.7%",
      changeType: "neutral",
      icon: "CheckCircle",
      description: "completion rate",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      id: 4,
      title: "Study Hours",
      value: "142h",
      change: "+18h",
      changeType: "positive",
      icon: "Clock",
      description: "this month",
      color: "bg-secondary/10 text-secondary border-secondary/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {performanceData?.map((item) => (
        <div
          key={item?.id}
          className={`
            bg-card border rounded-lg p-6 academic-shadow hover:academic-shadow-lg 
            transition-academic cursor-pointer ${item?.color}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item?.color}`}>
              <Icon name={item?.icon} size={24} />
            </div>
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${item?.changeType === 'positive' ? 'bg-success/10 text-success' : 
                item?.changeType === 'negative'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'}
            `}>
              {item?.change}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{item?.value}</h3>
            <p className="text-sm font-medium text-foreground">{item?.title}</p>
            <p className="text-xs text-muted-foreground">{item?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceCards;
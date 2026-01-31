import React from 'react';
import Icon from '../../../components/AppIcon';

const AICoach = ({ insights }) => {
    if (!insights) return null;

    const { analysis, actionPlan, riskAssessment } = insights;

    return (
        <div className="space-y-6">
            {/* Main Analysis Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                        <Icon name="Brain" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">AI Coach Analysis</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {analysis}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Action Plan */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h4 className="text-base font-semibold flex items-center gap-2 mb-4">
                        <Icon name="CheckSquare" className="w-5 h-5 text-green-500" />
                        Recommended Actions
                    </h4>
                    <div className="space-y-4">
                        {actionPlan?.map((action, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-green-500" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-sm text-foreground">{action.title}</h5>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${action.impact === 'High' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {action.impact} Impact
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h4 className="text-base font-semibold flex items-center gap-2 mb-4">
                        <Icon name="AlertTriangle" className="w-5 h-5 text-amber-500" />
                        Risk Factor
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800/50">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            {riskAssessment}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICoach;

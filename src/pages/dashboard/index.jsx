import React from 'react';
import { Helmet } from 'react-helmet';
import ActiveFocusWidget from './components/ActiveFocusWidget';
import WeeklyStudyFlowWidget from './components/WeeklyStudyFlowWidget';
import UserRankWidget from './components/UserRankWidget';
import PriorityTasksWidget from './components/PriorityTasksWidget';
import AIGradeForecastWidget from './components/AIGradeForecastWidget';
import ProficiencyMatrixWidget from './components/ProficiencyMatrixWidget';
import SyllabusTrackerWidget from './components/SyllabusTrackerWidget';

const Dashboard = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard - Academic Result Predictor</title>
                <meta name="description" content="Your academic command center" />
            </Helmet>

            <div className="h-full space-y-6 pb-6">

                {/* 1. Top Row: "The Snapshot" (Immediate Status) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-48">
                    <ActiveFocusWidget />
                    <WeeklyStudyFlowWidget />
                    <UserRankWidget />
                </div>

                {/* 2. Middle Row: "The Mission" (Actionable Intelligence) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
                    <div className="lg:col-span-2 h-full">
                        <PriorityTasksWidget />
                    </div>
                    <div className="h-full">
                        <AIGradeForecastWidget />
                    </div>
                </div>

                {/* 3. Bottom Row: "The Growth" (Long-term Metrics) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-80">
                    <ProficiencyMatrixWidget />
                    <SyllabusTrackerWidget />
                </div>

            </div>
        </>
    );
};

export default Dashboard;

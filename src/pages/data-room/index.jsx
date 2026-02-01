import React, { useState } from 'react';
import { Backpack, Users, Link } from 'lucide-react';
import DigitalBackpack from './components/DigitalBackpack';
import ProficiencyMatrix from './components/ProficiencyMatrix';
import WebReferenceHub from './components/WebReferenceHub';

const WhatIfAnalysis = () => {
  const [activeTab, setActiveTab] = useState('backpack');

  const tabs = [
    { id: 'backpack', label: 'Digital Backpack', icon: Backpack },
    { id: 'matrix', label: 'Proficiency Matrix', icon: Users },
    { id: 'references', label: 'Web References', icon: Link },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'backpack':
        return <DigitalBackpack />;
      case 'matrix':
        return <ProficiencyMatrix />;
      case 'references':
        return <WebReferenceHub />;
      default:
        return <DigitalBackpack />;
    }
  };

  return (
    <div className="h-full bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Data Room</h1>
              <p className="text-muted-foreground">Central hub for your academic documents, analysis, and progress tracking</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 bg-accent/20 p-1 rounded-lg w-fit overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WhatIfAnalysis;
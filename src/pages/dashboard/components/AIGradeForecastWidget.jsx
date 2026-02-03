import React, { useState, useEffect } from 'react';
import { db } from '../../../services/db';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const AIGradeForecastWidget = () => {
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        const loadPrediction = async () => {
            try {
                // Get latest prediction
                const latest = await db.predictions.orderBy('date').reverse().first();
                if (latest) {
                    setPrediction(latest);
                }
            } catch (e) {
                console.error("Error loading predictions", e);
            }
        };

        loadPrediction();
    }, []);

    // Helper to calculate color based on grade
    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-500';
        if (grade >= 80) return 'text-blue-500';
        if (grade >= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    // Helper for gauge arc
    const calculateRotation = (value) => {
        // Value 0-100 mapped to -90deg to 90deg (180deg span)
        const constrained = Math.min(Math.max(value, 0), 100);
        return (constrained / 100) * 180 - 90;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full relative overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 absolute top-0 left-0 w-full h-1.5" />

            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-indigo-600" />
                    AI Forecast
                </h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-4">
                {prediction ? (
                    <>
                        <div className="relative w-40 h-20 overflow-hidden mb-2">
                            {/* Gauge Background */}
                            <div className="absolute w-40 h-40 rounded-full border-[15px] border-gray-100 top-0 left-0 box-border" />

                            {/* Gauge Fill (Simplified - Using a rotated half-circle mask or SVG would be better, but CSS rotation on a half-masked element works) */}
                            {/* Actually, SVG is easier for arcs */}
                            <svg viewBox="0 0 100 50" className="w-full h-full transform translate-y-[2px]">
                                <path d="M 10 50 A 40 40 0 1 1 90 50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                                <path
                                    d="M 10 50 A 40 40 0 1 1 90 50"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="10"
                                    strokeDasharray={`${(prediction?.predictedGrade || 0) * 1.25}, 125`} // Rough approximation for 0-100 mapping to available arc length
                                // Actually arc length is PI * R = 3.14 * 40 = 125.6
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#22c55e" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="text-center -mt-8 relative z-10">
                            <span className={`text-4xl font-black ${getGradeColor(prediction.predictedGrade || 0)}`}>
                                {prediction.predictedGrade || "--"}%
                            </span>
                            <p className="text-xs text-gray-500 font-medium mt-1 truncate max-w-[150px]">
                                {prediction.courseName}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400 text-sm">
                        No predictions yet.
                        <br />
                        Visit Grade Predictor to start.
                    </div>
                )}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-3 text-center">
                <Link to="/grade-predictor" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1">
                    Manage Subjects <Icon name="ChevronRight" size={12} />
                </Link>
            </div>
        </div>
    );
};

export default AIGradeForecastWidget;

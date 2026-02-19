import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import { db } from '../../../services/db';

const ProficiencyMatrixWidget = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                
                const allPredictions = await db.predictions.toArray();

                
                const latestByCourse = {};
                allPredictions.forEach(p => {
                    const existing = latestByCourse[p.courseName];
                    if (!existing || new Date(p.date) > new Date(existing.date)) {
                        latestByCourse[p.courseName] = p;
                    }
                });

                let chartData = Object.values(latestByCourse).map(p => ({
                    subject: p.courseName,
                    A: p.predictedGrade || 0, 
                    fullMark: 100
                }));

                
                if (chartData.length === 0) {
                    chartData = [
                        { subject: 'No Data', A: 0, fullMark: 100 },
                        { subject: 'Subject 2', A: 0, fullMark: 100 },
                        { subject: 'Subject 3', A: 0, fullMark: 100 },
                    ];
                } else if (chartData.length < 3) {
                    
                    for (let i = chartData.length; i < 3; i++) {
                        chartData.push({ subject: `...`, A: 0, fullMark: 100 });
                    }
                }

                setData(chartData);

            } catch (error) {
                console.error("Failed to fetch proficiency data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <Icon name="Hexagon" size={20} className="text-purple-600" />
                    Proficiency Matrix
                </h3>
            </div>

            <div className="flex-1 w-full min-h-[250px] -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Proficiency"
                            dataKey="A"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="#8b5cf6"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                Based on your Grade Predictions
            </p>
        </div>
    );
};

export default ProficiencyMatrixWidget;

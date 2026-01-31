import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProbabilityDistributionChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-64 bg-card rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Probability Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="grade"
                        tickFormatter={(value) => `${value}%`}
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))'
                        }}
                        formatter={(value) => [`${value} simulations`, 'Frequency']}
                        labelFormatter={(label) => `Grade: ${label}%`}
                    />
                    <Area
                        type="monotone"
                        dataKey="frequency"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-muted-foreground mt-2">
                Based on 2,000 Monte Carlo simulations
            </p>
        </div>
    );
};

export default ProbabilityDistributionChart;

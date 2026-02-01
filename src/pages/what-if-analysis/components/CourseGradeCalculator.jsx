import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getCalicutGrade, calculateCalicutGP } from '../../../utils/gradeScale';

const CourseGradeCalculator = ({ isOpen, onClose, onSave, courseName }) => {
    const [currentGrade, setCurrentGrade] = useState(85);
    const [currentWeight, setCurrentWeight] = useState(70); // 70% completed
    const [finalWeight, setFinalWeight] = useState(30); // 30% remaining
    const [finalScore, setFinalScore] = useState(90);

    useEffect(() => {
        // Auto-adjust weights
        setFinalWeight(100 - currentWeight);
    }, [currentWeight]);

    const calculateFinalGrade = () => {
        const currentPart = (currentGrade * currentWeight) / 100;
        const finalPart = (finalScore * finalWeight) / 100;
        return (currentPart + finalPart).toFixed(1);
    };

    const finalGrade = calculateFinalGrade();
    const letterGrade = getCalicutGrade(finalGrade);
    const gradePoint = calculateCalicutGP(finalGrade);

    const handleSave = () => {
        onSave({
            grade: letterGrade,
            gp: gradePoint,
            score: parseFloat(finalGrade)
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Grade Calculator</h3>
                            <p className="text-sm text-muted-foreground">Simulate final exam impact for {courseName}</p>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Current Grade (%)"
                                type="number"
                                value={currentGrade}
                                onChange={(e) => setCurrentGrade(parseFloat(e.target.value) || 0)}
                            />
                            <Input
                                label="Current Weight (%)"
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Final Exam Score: {finalScore}%</label>
                                <span className="text-xs text-muted-foreground">Weight: {finalWeight}%</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={finalScore}
                                onChange={(e) => setFinalScore(parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />

                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center animate-in fade-in">
                            <p className="text-sm text-muted-foreground mb-1">Projected Course Grade</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-4xl font-bold text-primary">{finalGrade}%</span>
                                <div className="flex flex-col items-start">
                                    <span className="text-xl font-semibold text-foreground/70">{letterGrade}</span>
                                    <span className="text-xs text-muted-foreground">GP: {gradePoint}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Use this Grade</Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CourseGradeCalculator;

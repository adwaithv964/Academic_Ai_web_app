import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../services/db';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDateFormatter } from '../../../hooks/useDateFormatter';

const PredictionHistory = ({ onLoad, selectedId }) => {
    // Fetch predictions from IndexedDB, ordered by date descending
    const predictions = useLiveQuery(
        () => db.predictions.orderBy('date').reverse().toArray()
    );

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this prediction?')) {
            await db.predictions.delete(id);
        }
    };

    const { formatDateTime } = useDateFormatter();

    if (!predictions || predictions.length === 0) {
        return (
            <div className="bg-card rounded-lg border border-border p-6 academic-shadow h-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="History" size={20} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">History</h2>
                        <p className="text-sm text-muted-foreground">Past predictions</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Icon name="Clock" size={48} className="mb-4 opacity-20" />
                    <p>No prediction history yet.</p>
                    <p className="text-sm">Make a prediction to see it here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border p-6 academic-shadow h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="History" size={20} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground">History</h2>
                    <p className="text-sm text-muted-foreground">Your recent predictions</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar" style={{ maxHeight: '600px' }}>
                <AnimatePresence>
                    {predictions.map((prediction) => (
                        <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={() => onLoad(prediction)}
                            className={`
                group relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${selectedId === prediction.id
                                    ? 'bg-primary/5 border-primary shadow-sm'
                                    : 'bg-muted/30 border-transparent hover:bg-muted/50 hover:border-border'
                                }
              `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium text-foreground">{prediction.courseName}</h3>
                                    <p className="text-xs text-muted-foreground">{formatDateTime(prediction.date)}</p>
                                </div>
                                <div className={`
                  px-2 py-1 rounded text-xs font-bold
                  ${prediction.predictedGrade >= 90 ? 'bg-green-100 text-green-700' :
                                        prediction.predictedGrade >= 80 ? 'bg-blue-100 text-blue-700' :
                                            prediction.predictedGrade >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}
                `}>
                                    {prediction.predictedGrade}%
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <div className="text-xs text-muted-foreground">
                                    Current: {prediction.currentGrade}%
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, prediction.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-muted-foreground hover:text-red-600 rounded-md transition-all"
                                    title="Delete prediction"
                                >
                                    <Icon name="Trash2" size={14} />
                                </button>
                            </div>

                            {selectedId === prediction.id && (
                                <div className="absolute inset-x-0 -bottom-px h-px bg-primary animate-pulse" />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PredictionHistory;

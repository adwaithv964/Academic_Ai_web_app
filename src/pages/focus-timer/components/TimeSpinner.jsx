import React, { useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TimeSpinner = ({ totalSeconds, onChange, isDark = false, showHours = true, minMinutes = 0, maxMinutes = 59 }) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const hourRef = useRef(null);
    const minRef = useRef(null);

    const hoursList = Array.from({ length: 24 }, (_, i) => i);
    
    const minutesList = Array.from({ length: 60 }, (_, i) => i)
        .filter(m => m >= minMinutes && m <= maxMinutes);

    const ITEM_HEIGHT = 40; 

    const handleScroll = (type) => {
        const ref = type === 'hours' ? hourRef : minRef;
        if (!ref.current) return;

        const scrollTop = ref.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);

        if (type === 'hours') {
            const newHours = hoursList[index] || 0;
            if (newHours !== hours) {
                onChange((newHours * 3600) + (minutes * 60));
            }
        } else {
            
            const newMinutes = minutesList[index];
            
            if (newMinutes !== undefined && newMinutes !== minutes) {
                onChange((hours * 3600) + (newMinutes * 60));
            }
        }
    };

    const handleIncrement = (type) => {
        if (type === 'hours') {
            const nextHour = (hours + 1) % 24;
            onChange((nextHour * 3600) + (minutes * 60));
        } else {
            
            const currentIndex = minutesList.indexOf(minutes);
            
            const safeIndex = currentIndex === -1 ? 0 : currentIndex;
            const nextIndex = Math.min(safeIndex + 1, minutesList.length - 1);
            const nextMinute = minutesList[nextIndex];
            onChange((hours * 3600) + (nextMinute * 60));
        }
    };

    const handleDecrement = (type) => {
        if (type === 'hours') {
            const prevHour = (hours - 1 + 24) % 24;
            onChange((prevHour * 3600) + (minutes * 60));
        } else {
            const currentIndex = minutesList.indexOf(minutes);
            const safeIndex = currentIndex === -1 ? 0 : currentIndex;
            const prevIndex = Math.max(safeIndex - 1, 0);
            const prevMinute = minutesList[prevIndex];
            onChange((hours * 3600) + (prevMinute * 60));
        }
    };

    
    useEffect(() => {
        if (hourRef.current && showHours) {
            const currentHourIndex = Math.round(hourRef.current.scrollTop / ITEM_HEIGHT);
            if (currentHourIndex !== hours) {
                hourRef.current.scrollTop = hours * ITEM_HEIGHT;
            }
        }
        if (minRef.current) {
            const currentMinScrollIndex = Math.round(minRef.current.scrollTop / ITEM_HEIGHT);
            
            const targetIndex = minutesList.indexOf(minutes);

            
            
            
            const safeIndex = targetIndex >= 0 ? targetIndex : 0;

            if (currentMinScrollIndex !== safeIndex) {
                minRef.current.scrollTop = safeIndex * ITEM_HEIGHT;
            }
        }
    }, [hours, minutes, showHours, minutesList]);

    return (
        <div className={`relative flex items-center justify-center gap-6 h-48 overflow-hidden ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {/* Selection Overlay */}
            <div className={`absolute inset-x-0 top-[76px] h-[40px] pointer-events-none border-y ${isDark ? 'border-gray-600 bg-white/5' : 'border-gray-200 bg-gray-50/5'}`}></div>

            {/* Hours */}
            {showHours && (
                <div className="flex flex-col items-center gap-2">
                    <span className={`text-sm font-bold tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>HOURS</span>
                    <button
                        onClick={() => handleIncrement('hours')}
                        className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        aria-label="Increment hours"
                    >
                        <Icon name="ChevronUp" size={20} />
                    </button>
                    <div
                        ref={hourRef}
                        onScroll={() => handleScroll('hours')}
                        className="h-32 w-16 overflow-y-scroll scrollbar-hide snap-y snap-mandatory py-[44px]"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {hoursList.map(h => (
                            <div key={h} className="h-[40px] flex items-center justify-center snap-center text-3xl font-bold">
                                {h.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => handleDecrement('hours')}
                        className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        aria-label="Decrement hours"
                    >
                        <Icon name="ChevronDown" size={20} />
                    </button>
                </div>
            )}

            {showHours && <span className="text-3xl font-bold self-center">:</span>}

            {/* Minutes */}
            <div className="flex flex-col items-center gap-2">
                <span className={`text-sm font-bold tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>MINS</span>
                <button
                    onClick={() => handleIncrement('minutes')}
                    className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    aria-label="Increment minutes"
                >
                    <Icon name="ChevronUp" size={20} />
                </button>
                <div
                    ref={minRef}
                    onScroll={() => handleScroll('minutes')}
                    className="h-32 w-16 overflow-y-scroll scrollbar-hide snap-y snap-mandatory py-[44px]"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {minutesList.map(m => (
                        <div key={m} className="h-[40px] flex items-center justify-center snap-center text-3xl font-bold">
                            {m.toString().padStart(2, '0')}
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => handleDecrement('minutes')}
                    className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    aria-label="Decrement minutes"
                >
                    <Icon name="ChevronDown" size={20} />
                </button>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default TimeSpinner;

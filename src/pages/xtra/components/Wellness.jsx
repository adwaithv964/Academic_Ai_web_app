import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

// --- CONFIGURATION ---

const THEME = {
    teal: { bg: 'bg-teal-50', circle: 'bg-teal-200/50', circleInner: 'bg-teal-300/50', border: 'border-teal-500', ring: 'ring-teal-500', iconBg: 'bg-teal-100', iconText: 'text-teal-600', text: 'text-teal-900', btn: '!bg-teal-600 hover:!bg-teal-700' },
    indigo: { bg: 'bg-indigo-50', circle: 'bg-indigo-200/50', circleInner: 'bg-indigo-300/50', border: 'border-indigo-500', ring: 'ring-indigo-500', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', text: 'text-indigo-900', btn: '!bg-indigo-600 hover:!bg-indigo-700' },
    amber: { bg: 'bg-amber-50', circle: 'bg-amber-100', circleInner: 'bg-amber-200', border: 'border-amber-500', ring: 'ring-amber-500', iconBg: 'bg-amber-100', iconText: 'text-amber-600', text: 'text-amber-900', btn: '!bg-amber-600 hover:!bg-amber-700' },
    rose: { bg: 'bg-rose-50', circle: 'bg-rose-200/50', circleInner: 'bg-rose-300/50', border: 'border-rose-500', ring: 'ring-rose-500', iconBg: 'bg-rose-100', iconText: 'text-rose-600', text: 'text-rose-900', btn: '!bg-rose-600 hover:!bg-rose-700' },
    orange: { bg: 'bg-orange-50', circle: 'bg-orange-400/30', circleInner: 'bg-orange-500/30', border: 'border-orange-500', ring: 'ring-orange-500', iconBg: 'bg-orange-100', iconText: 'text-orange-600', text: 'text-orange-900', btn: '!bg-orange-600 hover:!bg-orange-700' },
    cyan: { bg: 'bg-cyan-50', circle: 'bg-cyan-200', circleInner: 'bg-cyan-300', border: 'border-cyan-500', ring: 'ring-cyan-500', iconBg: 'bg-cyan-100', iconText: 'text-cyan-600', text: 'text-cyan-900', btn: '!bg-cyan-600 hover:!bg-cyan-700' },
    emerald: { bg: 'bg-emerald-50', circle: 'bg-emerald-200', circleInner: 'bg-emerald-300', border: 'border-emerald-500', ring: 'ring-emerald-500', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', text: 'text-emerald-900', btn: '!bg-emerald-600 hover:!bg-emerald-700' },
    violet: { bg: 'bg-violet-50', circle: 'bg-violet-200/50', circleInner: 'bg-violet-300/50', border: 'border-violet-500', ring: 'ring-violet-500', iconBg: 'bg-violet-100', iconText: 'text-violet-600', text: 'text-violet-900', btn: '!bg-violet-600 hover:!bg-violet-700' },
};

const WELLNESS_MODES = [
    // Mind
    {
        id: 'relax', category: 'Mind', title: 'Relax', subtitle: 'Reduce stress instantly.', icon: 'Wind',
        type: 'breathing',
        technique: 'Box Breathing',
        description: 'Used by Navy SEALs to stay calm. It equalizes breathing rhythm.',
        steps: ['Inhale deeply (4s)', 'Hold full (4s)', 'Exhale slowly (4s)', 'Hold empty (4s)'],
        config: { color: 'teal', pattern: [{ t: 'Inhale', d: 4000 }, { t: 'Hold', d: 4000 }, { t: 'Exhale', d: 4000 }, { t: 'Hold', d: 4000 }] }
    },
    {
        id: 'focus', category: 'Mind', title: 'Focus', subtitle: 'Clear your mind.', icon: 'Smile',
        type: 'breathing',
        technique: '4-7-8 Technique',
        description: 'A rhythmic pattern that reduces anxiety and clears the mind for studying.',
        steps: ['Inhale quietly (4s)', 'Hold breath (7s)', 'Exhale forcefully (8s)'],
        config: { color: 'indigo', pattern: [{ t: 'Inhale through nose', d: 4000, effect: 'expand' }, { t: 'Hold breath', d: 7000, effect: 'pulse' }, { t: 'Whoosh Exhale', d: 8000, effect: 'shrink-slow' }] }
    },
    {
        id: 'confidence', category: 'Mind', title: 'Confidence', subtitle: 'Build exam mindset.', icon: 'TrendingUp',
        type: 'sequence',
        technique: 'Visualization',
        description: 'Positive Affirmations & Imagery to boost pre-exam confidence.',
        steps: ['Close eyes', 'Visualize success', 'Affirm capability'],
        config: { color: 'amber', steps: [{ text: 'Close your eyes and take a deep breath.', d: 5000 }, { text: 'Visualize yourself walking into the exam hall calmly.', d: 10000 }, { text: 'See yourself knowing every answer.', d: 10000 }, { text: 'You are prepared. You are capable.', d: 10000 }] }
    },
    {
        id: 'sos', category: 'Mind', title: 'SOS / Panic', subtitle: 'Calm anxiety fast.', icon: 'AlertCircle',
        type: 'breathing',
        technique: 'Physiological Sigh',
        description: 'The fastest way to offload CO2 and reduce panic instantly.',
        steps: ['Double Inhale (Nose)', 'Long Sigh Exhale (Mouth)', 'Repeat 10 times'],
        config: { color: 'rose', pattern: [{ t: 'Inhale', d: 2000, effect: 'expand' }, { t: 'Sniff!', d: 1000, effect: 'expand-more' }, { t: 'Long Sigh...', d: 6000, effect: 'shrink-slow' }] }
    },

    // Body
    {
        id: 'energize', category: 'Body', title: 'Energize', subtitle: 'Boost alertness instantly.', icon: 'Zap',
        type: 'repetitive',
        technique: 'Bellows Breath',
        description: 'Rapid breathing to increase alertness and heart rate (like a natural espresso).',
        steps: ['Inhale quickly (1s)', 'Exhale quickly (1s)', 'Keep fast pace', 'Final long hold'],
        config: { color: 'orange', pattern: [{ t: 'Inh', d: 1000 }, { t: 'Exh', d: 1000 }], reps: 30, finish: { t: 'Hold breath', d: 999999 } }
    },
    {
        id: 'stretch', category: 'Body', title: 'Stretch', subtitle: 'Relieve desk tension.', icon: 'Move',
        type: 'sequence',
        technique: 'Desk Mobility',
        description: 'Simple movements to release "Coder\'s Neck" and stiffness.',
        steps: ['Neck Tilts', 'Shoulder Rolls', 'Spine Twists'],
        config: { color: 'cyan', steps: [{ text: 'Tilt right ear to right shoulder. Hold.', icon: 'MoveHorizontal', d: 15000 }, { text: 'Switch: Left ear to left shoulder.', icon: 'MoveHorizontal', d: 15000 }, { text: 'Roll shoulders backward in big circles.', icon: 'User', d: 15000 }, { text: 'Twist torso left, look behind.', icon: 'RotateCw', d: 15000 }, { text: 'Twist torso right, look behind.', icon: 'RotateCcw', d: 15000 }] }
    },
    {
        id: 'eye', category: 'Body', title: 'Eye Care', subtitle: 'Rest tired eyes.', icon: 'Eye',
        type: 'sequence',
        technique: '20-20-20 Rule',
        description: 'Prevents digital eye strain and headaches.',
        steps: ['Look away', 'Focus 20ft away (20s)', 'Blink rapidly'],
        config: { color: 'emerald', steps: [{ text: 'Look away from the screen.', d: 3000 }, { text: 'Focus on an object 20 feet away...', timer: 20, d: 21000 }, { text: 'Blink hard 5 times.', d: 5000 }, { text: 'Resume studying.', d: 0 }] }
    },

    // Sleep
    {
        id: 'sleep', category: 'Sleep', title: 'Sleep', subtitle: 'Prepare for rest.', icon: 'Moon',
        type: 'breathing',
        technique: 'Resonance Breathing',
        description: 'Slowing breathing to ~6 breaths per minute to trigger rest & digest.',
        steps: ['Inhale soft (5.5s)', 'Exhale soft (5.5s)', 'Screen fades to black'],
        config: { color: 'violet', pattern: [{ t: 'Inhale slowly...', d: 5500 }, { t: 'Exhale softly...', d: 5500 }], visual: 'darken' }
    },
];


const Wellness = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('Mind');
    const [activeModeId, setActiveModeId] = useState(null);
    const [sessionState, setSessionState] = useState('Idle'); // Idle, Info, Running, Finished

    // Engine State
    const [instruction, setInstruction] = useState('');
    const [subInstruction, setSubInstruction] = useState(''); // For counts/timers
    const [stepIndex, setStepIndex] = useState(0);
    const [repCount, setRepCount] = useState(0);
    const [visualState, setVisualState] = useState('neutral'); // neutral, expand, shrink, pulse, hold
    const bgRef = useRef('light'); // For sleep darkening

    const timerRef = useRef(null);
    const activeMode = activeModeId ? WELLNESS_MODES.find(m => m.id === activeModeId) : null;
    const theme = activeMode ? THEME[activeMode.config.color] : null;

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    // --- SESSION RUNNER ---
    useEffect(() => {
        if (!activeMode || sessionState !== 'Running') return;

        const runStep = async () => {
            const config = activeMode.config;

            // --- BREATHING & REPETITIVE LOGIC ---
            if (activeMode.type === 'breathing' || activeMode.type === 'repetitive') {
                const pattern = config.pattern;
                const currentStep = pattern[stepIndex % pattern.length];

                setInstruction(currentStep.t);

                // Visuals
                if ((currentStep.effect === 'expand') || currentStep.t.includes('Inhale')) setVisualState('expand');
                else if (currentStep.effect === 'expand-more') setVisualState('expand-more');
                else if ((currentStep.effect === 'shrink') || currentStep.t.includes('Exhale')) setVisualState('shrink');
                else if (currentStep.effect === 'shrink-slow') setVisualState('shrink-slow');
                else if (currentStep.effect === 'pulse') setVisualState('pulse');
                else setVisualState('hold');

                // Rep Counters for Energize
                if (activeMode.type === 'repetitive') {
                    setSubInstruction(`${repCount + 1}/${config.reps}`);
                }

                // Wait for duration
                await new Promise(r => timerRef.current = setTimeout(r, currentStep.d));

                // Next Step Calculation
                if (activeMode.type === 'repetitive') {
                    // Check if full cycle (Inhale+Exhale) completed to increment rep
                    if ((stepIndex + 1) % pattern.length === 0) {
                        const newRep = repCount + 1;
                        setRepCount(newRep);
                        if (newRep >= config.reps) {
                            // Finish Repetitive Mode
                            setInstruction(config.finish.t);
                            setVisualState('hold');
                            setSubInstruction('');
                            return; // Stay here until manual stop
                        }
                    }
                    setStepIndex(prev => prev + 1);
                } else {
                    // Standard Breathing Loop
                    setStepIndex(prev => (prev + 1) % pattern.length);
                }
            }

            // --- SEQUENCE LOGIC ---
            else if (activeMode.type === 'sequence') {
                const steps = config.steps;
                if (stepIndex >= steps.length) {
                    setSessionState('Finished'); // End of sequence
                    return;
                }

                const step = steps[stepIndex];
                setInstruction(step.text);
                setVisualState('neutral');

                // Sound Effect for Eye Care? (Mocked by just logic for now)

                if (step.timer) {
                    // Countdown Logic
                    let left = step.timer;
                    setSubInstruction(`${left}s`);
                    const interval = setInterval(() => {
                        left--;
                        setSubInstruction(`${left}s`);
                        if (left <= 0) clearInterval(interval);
                    }, 1000);
                    await new Promise(r => timerRef.current = setTimeout(r, step.d));
                    clearInterval(interval);
                    setSubInstruction('');
                } else {
                    await new Promise(r => timerRef.current = setTimeout(r, step.d));
                }

                if (activeModeId) {
                    if (activeMode.id === 'confidence') {
                        // Confidence Loop? Protocol says visualize steps. Usually looped or manual end.
                        // Let's loop it as affirmations often are.
                        setStepIndex(prev => (prev + 1) % steps.length);
                    } else if (activeMode.id === 'stretch') {
                        // Stretch protocol defines left/right, wait for next. 
                        // One-pass seems appropriate for "Start -> End".
                        if (stepIndex < steps.length - 1) setStepIndex(prev => prev + 1);
                        else setInstruction('Great job!');
                    } else {
                        if (stepIndex < steps.length - 1) setStepIndex(prev => prev + 1);
                        else setInstruction('Session Complete');
                    }
                }
            }
        };

        runStep();

        // Darken Effect for Sleep
        if (activeMode.config.visual === 'darken') {
            const timeout = setTimeout(() => {
                if (bgRef.current !== 'dark') bgRef.current = 'dark'; // Signal to render darker
            }, 5000); // Start darkening sooner
            return () => clearTimeout(timeout);
        }

    }, [activeModeId, sessionState, stepIndex, repCount]);


    // --- HANDLERS ---
    const handleSelectMode = (mode) => {
        setActiveModeId(mode.id);
        setSessionState('Info');
    };

    const handleStartSession = () => {
        setSessionState('Running');
        setStepIndex(0);
        setRepCount(0);
        setInstruction('');
        setSubInstruction('');
        setVisualState('neutral');
        bgRef.current = 'light';
    };

    const handleStop = () => {
        setActiveModeId(null);
        setSessionState('Idle');
        clearTimeout(timerRef.current);
        bgRef.current = 'light';
    };

    // --- RENDER HELPERS ---
    const getCircleClass = () => {
        const base = `transition-all ease-in-out absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
        let anim = '';
        let duration = 'duration-[4000ms]';
        let size = 'w-48 h-48';

        // Custom Timings/Sizes
        if (activeMode?.type === 'breathing' || activeMode?.type === 'repetitive') {
            const step = activeMode.config.pattern[stepIndex % activeMode.config.pattern.length];
            if (step && step.d) duration = `duration-[${step.d}ms]`;
        }

        if (visualState === 'expand') anim = 'scale-150 opacity-100';
        else if (visualState === 'expand-more') anim = 'scale-[1.7] opacity-100'; // Double inhale
        else if (visualState === 'shrink') anim = 'scale-50 opacity-80';
        else if (visualState === 'shrink-slow') anim = 'scale-50 opacity-80';
        else if (visualState === 'pulse') anim = 'scale-110 animate-pulse';
        else anim = 'scale-100';

        if (activeMode?.id === 'energize') size = 'w-64 h-64'; // Bigger visual for intensity

        return `${base} ${theme?.circle} ${size} ${anim} ${duration}`;
    };


    const filteredModes = WELLNESS_MODES.filter(m => m.category === activeTab);

    // --- VIEW: INFO SCREEN ---
    if (sessionState === 'Info' && activeMode) {
        return (
            <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center p-8">
                <div className={`p-4 rounded-full mb-6 ${theme.iconBg} ${theme.iconText}`}>
                    <Icon name={activeMode.icon} size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeMode.title}</h2>
                <h3 className="text-xl text-gray-500 font-medium mb-6">{activeMode.technique}</h3>

                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {activeMode.description}
                </p>

                <div className="bg-gray-50 rounded-xl p-6 text-left w-full mb-8 border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider">How to do it:</h4>
                    <ul className="space-y-3">
                        {activeMode.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${theme.iconBg} ${theme.iconText}`}>{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-4">
                    <Button onClick={handleStop} variant="outline" className="px-8">Back</Button>
                    <Button
                        onClick={handleStartSession}
                        className={`px-10 text-lg text-white shadow-md transition-transform active:scale-95 ${theme?.btn || 'bg-gray-900'}`}
                    >
                        Start Session
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Wellness</h1>
            </div>

            {/* Active Session Area */}
            <div
                className={`rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] border relative overflow-hidden shadow-sm transition-colors duration-1000 
                ${activeMode ? (activeMode.id === 'sleep' ? 'bg-indigo-900 border-indigo-900' : theme.bg + ' ' + theme.border) : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'}`}
            >
                {activeMode && (
                    <button onClick={handleStop} className={`absolute top-4 right-4 p-2 z-20 ${activeMode.id === 'sleep' ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Icon name="X" size={24} />
                    </button>
                )}

                {activeMode ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                        {/* Visuals */}
                        {(activeMode.type === 'breathing' || activeMode.type === 'repetitive') && (
                            <div className="relative mb-12">
                                <div className={getCircleClass()} />
                                <div className={`${getCircleClass()} ${theme.circleInner} scale-75 delay-75`} />
                            </div>
                        )}

                        {/* Sequence Icons */}
                        {(activeMode.type === 'sequence' && activeMode.config.steps[stepIndex]?.icon) && (
                            <div className={`mb-8 p-6 rounded-full ${theme.iconBg} ${theme.iconText} transition-all duration-500`}>
                                <Icon name={activeMode.config.steps[stepIndex].icon} size={64} />
                            </div>
                        )}

                        {/* Text */}
                        <div className="text-center z-10 max-w-lg">
                            <h2 className={`text-4xl font-bold mb-4 transition-all duration-300 ${activeMode.id === 'sleep' ? 'text-indigo-100' : theme.text}`}>
                                {instruction}
                            </h2>
                            {subInstruction && (
                                <p className={`text-2xl font-mono ${activeMode.id === 'sleep' ? 'text-indigo-300' : theme.iconText}`}>
                                    {subInstruction}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <Icon name="Sparkles" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Select a wellness mode below to start</p>
                    </div>
                )}
            </div>

            {/* Categories & Grid */}
            <div>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit mx-auto">
                    {['Mind', 'Body', 'Sleep'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModes.map(mode => {
                        const modeTheme = THEME[mode.config.color];
                        return (
                            <button
                                key={mode.id}
                                onClick={() => handleSelectMode(mode)}
                                className={`text-left p-5 rounded-xl border transition-all hover:shadow-md ${activeModeId === mode.id
                                    ? `${modeTheme.border} ${modeTheme.bg} ring-1 ${modeTheme.ring}`
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${modeTheme.iconBg} ${modeTheme.iconText}`}>
                                    <Icon name={mode.icon} size={20} />
                                </div>
                                <h4 className="font-bold text-gray-900">{mode.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{mode.subtitle}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wellness;

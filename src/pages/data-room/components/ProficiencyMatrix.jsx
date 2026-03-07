import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../../services/api';

const ProficiencyMatrix = () => {
    const [data, setData] = React.useState([
        { subject: 'Theory', A: 0, fullMark: 100 },
        { subject: 'Practical', A: 0, fullMark: 100 },
        { subject: 'Assignments', A: 0, fullMark: 100 },
        { subject: 'Attendance', A: 0, fullMark: 100 },
        { subject: 'Projects', A: 0, fullMark: 100 },
        { subject: 'Quizzes', A: 0, fullMark: 100 },
    ]);
    const [subjects, setSubjects] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [recommendation, setRecommendation] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, predictionsData, tasksData, sessionsData] = await Promise.all([
                    api.courses.list().catch(() => []),
                    api.predictions.list().catch(() => []),
                    api.tasks.list().catch(() => []),
                    api.sessions.list().catch(() => [])
                ]);


                const calculateTaskRate = (subjectName, keywords) => {
                    const subjectTasks = tasksData.filter(t =>
                        t.subject === subjectName &&
                        keywords.some(k => (t.type || t.title).toLowerCase().includes(k))
                    );
                    if (subjectTasks.length === 0) return 0;
                    const completed = subjectTasks.filter(t => t.completed).length;
                    return (completed / subjectTasks.length) * 100;
                };


                const hasTasks = (subjectName, keywords) => {
                    return tasksData.some(t =>
                        t.subject === subjectName &&
                        keywords.some(k => (t.type || t.title).toLowerCase().includes(k))
                    );
                };


                const processedSubjects = coursesData.map(course => {
                    const subjectName = course.name;


                    const pred = predictionsData.find(p => p.courseName === subjectName) || {};
                    const theoryScore = parseFloat(pred.currentGrade || 0);


                    const subjectSessions = sessionsData.filter(s => s.subject === subjectName);
                    const attendanceScore = subjectSessions.length > 0
                        ? (subjectSessions.filter(s => s.isCompleted).length / subjectSessions.length) * 100
                        : 0;


                    const assignmentScore = calculateTaskRate(subjectName, ['assign', 'homework', 'task']);


                    const projectScore = calculateTaskRate(subjectName, ['project', 'presentation', 'report']);


                    const practicalScore = calculateTaskRate(subjectName, ['lab', 'practical', 'experiment']);


                    const quizScore = calculateTaskRate(subjectName, ['quiz', 'test', 'exam']);










                    let validMetrics = [];
                    validMetrics.push(theoryScore);
                    if (subjectSessions.length > 0) validMetrics.push(attendanceScore);
                    if (hasTasks(subjectName, ['assign', 'homework', 'task'])) validMetrics.push(assignmentScore);
                    if (hasTasks(subjectName, ['project', 'presentation', 'report'])) validMetrics.push(projectScore);
                    if (hasTasks(subjectName, ['lab', 'practical', 'experiment'])) validMetrics.push(practicalScore);
                    if (hasTasks(subjectName, ['quiz', 'test', 'exam'])) validMetrics.push(quizScore);

                    const compositeScore = validMetrics.length > 0
                        ? validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length
                        : theoryScore;

                    let comment = 'No data available';
                    let strength = false;

                    if (compositeScore >= 75) { comment = 'Strong performance'; strength = true; }
                    else if (compositeScore >= 50) { comment = 'On track'; strength = true; }
                    else if (compositeScore > 0) { comment = 'Needs attention'; strength = false; }

                    return {
                        name: subjectName,
                        score: Math.round(compositeScore),
                        strength: strength,
                        comment: comment,
                        id: course._id,

                        metrics: { theoryScore, attendanceScore, assignmentScore, projectScore, practicalScore, quizScore }
                    };
                });

                setSubjects(processedSubjects);




                const avgMetric = (metricKey) => {
                    const validSubjects = processedSubjects.filter(s => s.metrics[metricKey] > 0 || hasTasks(s.name, [] /* irrelevant here */));

                    if (processedSubjects.length === 0) return 0;
                    return processedSubjects.reduce((acc, curr) => acc + curr.metrics[metricKey], 0) / processedSubjects.length;
                };

                const globalTheory = avgMetric('theoryScore');
                const globalAttendance = processedSubjects.length > 0
                    ? processedSubjects.reduce((acc, curr) => acc + curr.metrics.attendanceScore, 0) / processedSubjects.length
                    : 0;


                const globalTaskRate = (keywords) => {
                    const relevantTasks = tasksData.filter(t => keywords.some(k => (t.type || t.title).toLowerCase().includes(k)));
                    if (relevantTasks.length === 0) return 0;
                    return (relevantTasks.filter(t => t.completed).length / relevantTasks.length) * 100;
                };

                setData([
                    { subject: 'Theory', A: Math.round(globalTheory), fullMark: 100 },
                    { subject: 'Practical', A: Math.round(globalTaskRate(['lab', 'practical'])), fullMark: 100 },
                    { subject: 'Assignments', A: Math.round(globalTaskRate(['assign', 'homework', 'task'])), fullMark: 100 },
                    { subject: 'Attendance', A: Math.round(globalAttendance), fullMark: 100 },
                    { subject: 'Projects', A: Math.round(globalTaskRate(['project', 'report'])), fullMark: 100 },
                    { subject: 'Quizzes', A: Math.round(globalTaskRate(['quiz', 'test', 'exam'])), fullMark: 100 },
                ]);


                if (processedSubjects.length > 0) {
                    const sorted = [...processedSubjects].sort((a, b) => a.score - b.score);
                    const weakest = sorted[0];
                    const secondWeakest = sorted[1];

                    if (weakest.score < 50) {
                        setRecommendation(
                            <p className="text-sm text-muted-foreground bg-accent/10 p-3 rounded-md">
                                Focus on improving <span className="font-semibold text-amber-600">{weakest.name}</span>
                                {secondWeakest && secondWeakest.score < 50 ? <span> and <span className="font-semibold text-amber-600">{secondWeakest.name}</span></span> : ''}
                                {" "}to boost your overall proficiency.
                            </p>
                        );
                    } else {
                        setRecommendation(
                            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-100">
                                <CheckCircle className="w-4 h-4 inline mr-2 text-green-600" />
                                Great job! You are maintaining good proficiency across all subjects.
                            </p>
                        );
                    }
                } else {
                    setRecommendation(
                        <p className="text-sm text-muted-foreground bg-accent/10 p-3 rounded-md">
                            Add courses and tasks to see personalized recommendations.
                        </p>
                    );
                }

            } catch (err) {
                console.error("Failed to load proficiency data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading analysis...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Chart Section */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Proficiency Radar</h3>
                        <p className="text-sm text-muted-foreground">Visual breakdown of your academic strengths</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className="h-[400px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Performance"
                                dataKey="A"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fill="hsl(var(--primary))"
                                fillOpacity={0.2}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))',
                                    borderRadius: '8px'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Strength & Weakness List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Subject Insights</h3>

                    {subjects.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                            <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                            <p>No subject data found</p>
                            <p className="text-xs mt-1">Add courses to see insights</p>
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {subjects.map((subject, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors border border-transparent hover:border-border">
                                    <div className={`mt-0.5 ${subject.strength ? 'text-green-500' : 'text-amber-500'}`}>
                                        {subject.strength ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium text-foreground">{subject.name}</span>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${subject.score >= 90 ? 'bg-green-100 text-green-700' :
                                                subject.score >= 75 ? 'bg-blue-100 text-blue-700' :
                                                    subject.score >= 50 ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {subject.score}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">{subject.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2">Recommendation</h4>
                        {recommendation}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProficiencyMatrix;

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataArchives = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Physics_II_Syllabus.pdf', type: 'PDF', size: '2.4 MB', date: '2025-01-15', tags: ['Syllabus', 'Physics'] },
        { id: 2, name: 'Transcript_Fall_2024.pdf', type: 'PDF', size: '1.1 MB', date: '2024-12-20', tags: ['Transcript', 'Official'] },
        { id: 3, name: 'Calc_Midterm_Review.docx', type: 'DOCX', size: '450 KB', date: '2025-02-10', tags: ['Study Material', 'Calculus'] }
    ]);

    const historicalData = [
        { id: 1, course: 'Physics II', professor: 'Dr. Sarah Miller', avgGPA: 3.2, aRate: '15%', difficulty: 'High' },
        { id: 2, course: 'Advanced Calculus', professor: 'Prof. James Chen', avgGPA: 2.9, aRate: '10%', difficulty: 'Very High' },
        { id: 3, course: 'Computer Science 101', professor: 'Dr. Alan Turing', avgGPA: 3.5, aRate: '30%', difficulty: 'Medium' },
        { id: 4, course: 'Statistics', professor: 'Prof. David Cox', avgGPA: 3.1, aRate: '20%', difficulty: 'Medium' }
    ];

    const handleDrop = (e) => {
        e.preventDefault();
        // Mock upload functionality
        alert('File upload simulation: File dropped!');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Data Archives</h2>
                    <div className="flex items-center gap-2">
                        <Icon name="Archive" size={20} className="text-primary" />
                        <span className="text-sm text-muted-foreground">Storage & History</span>
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Store your academic documents and review historical course data to make informed decisions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Storage */}
                <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="FileText" size={18} />
                        Document Storage
                    </h3>

                    {/* Drag & Drop Zone */}
                    <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:bg-muted/30 transition-colors cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon name="UploadCloud" size={24} className="text-primary" />
                        </div>
                        <p className="font-medium text-foreground mb-1">Click or drag file to this area to upload</p>
                        <p className="text-sm text-muted-foreground">Support for PDF, DOCX, and IMG files</p>
                    </div>

                    {/* File List */}
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-card rounded flex items-center justify-center border border-border">
                                        <Icon name="File" size={20} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {doc.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{doc.size}</span>
                                            <span>•</span>
                                            <span>{doc.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <Icon name="Download" size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-error">
                                        <Icon name="Trash2" size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historical Data */}
                <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="History" size={18} />
                        Historical Course Data
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg GPA</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Top Grades</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicalData.map((data) => (
                                    <tr key={data.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-foreground">{data.course}</div>
                                            <div className="text-xs text-muted-foreground">{data.professor}</div>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-foreground">{data.avgGPA}</td>
                                        <td className="py-3 px-4 text-success">{data.aRate} A's</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${data.difficulty === 'High' || data.difficulty === 'Very High'
                                                    ? 'bg-error/10 text-error'
                                                    : 'bg-warning/10 text-warning'
                                                }`}>
                                                {data.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/20 text-xs text-muted-foreground flex items-start gap-2">
                        <Icon name="Info" size={14} className="text-primary mt-0.5" />
                        <p>
                            Data is aggregated from past semesters. Use this as a reference guide only; actual grading policies may vary by professor and semester.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataArchives;

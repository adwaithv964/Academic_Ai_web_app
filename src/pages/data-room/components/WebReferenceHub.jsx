import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Globe, Youtube, Book, Filter, Trash2, Search, Edit2, Plus, X, FolderPlus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import api from '../../../services/api';
import Input from '../../../components/ui/Input';


const SubjectManagerModal = ({ isOpen, onClose, onSubjectsUpdated }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (isOpen) fetchCourses();
    }, [isOpen]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await api.courses.list().catch(() => []);
            setCourses(data);
        } catch (err) {
            console.error("Failed to load courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async () => {
        if (!newCourseName.trim()) return;
        try {
            const newCourse = await api.courses.create({ name: newCourseName });
            setCourses([newCourse, ...courses]);
            setNewCourseName('');
            onSubjectsUpdated();
        } catch (err) {
            console.error("Failed to add course:", err);
        }
    };

    const handleUpdateCourse = async (id) => {
        if (!editName.trim()) return;
        try {
            const updated = await api.courses.update(id, { name: editName });
            setCourses(courses.map(c => c._id === id ? updated : c));
            setEditingId(null);
            onSubjectsUpdated();
        } catch (err) {
            console.error("Failed to update course:", err);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Delete this subject?")) return;
        try {
            await api.courses.delete(id);
            setCourses(courses.filter(c => c._id !== id));
            onSubjectsUpdated();
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800">Manage Subjects</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Subject Name..."
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCourse()}
                        />
                        <Button size="sm" onClick={handleAddCourse} disabled={!newCourseName.trim()}>
                            <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-gray-50/30">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Loading subjects...</div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">No subjects found. Add one above!</div>
                    ) : (
                        courses.map(course => (
                            <div key={course._id} className="group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                                {editingId === course._id ? (
                                    <div className="flex-1 flex gap-2 mr-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-2 py-1 text-sm border border-indigo-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdateCourse(course._id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                        />
                                        <button onClick={() => handleUpdateCourse(course._id)} className="text-green-600 hover:text-green-700 font-medium text-xs px-2">Save</button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-xs px-2">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium text-gray-700 text-sm pl-1">{course.name}</span>
                                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                            <button
                                                onClick={() => { setEditingId(course._id); setEditName(course.name); }}
                                                className="p-1.5 hover:bg-indigo-50 text-indigo-500 rounded-md transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const WebReferenceHub = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [adding, setAdding] = useState(false);

    
    const [subjects, setSubjects] = useState([]);
    const [isSubjectManagerOpen, setIsSubjectManagerOpen] = useState(false);

    
    const [newLink, setNewLink] = useState({ url: '', subject: '' });

    
    const [editingLink, setEditingLink] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', url: '', subject: '', type: '' });

    const fetchSubjects = async () => {
        try {
            const data = await api.courses.list().catch(() => []);
            setSubjects(data);
            
            if (data.length > 0 && !newLink.subject) {
                setNewLink(prev => ({ ...prev, subject: data[0].name }));
            }
        } catch (err) {
            console.error("Failed to load subjects", err);
        }
    };

    useEffect(() => {
        loadLinks();
        fetchSubjects();
    }, []);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const data = await api.webReferences.list().catch(() => []);
            
            setLinks(data);
        } catch (err) {
            console.error("Failed to load web references:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async () => {
        if (!newLink.url.trim()) return;

        try {
            setAdding(true);
            
            const type = newLink.url.includes('youtube') || newLink.url.includes('youtu.be') ? 'video' :
                newLink.url.includes('.pdf') ? 'documentation' : 'article';

            const title = newLink.url; 

            const payload = {
                url: newLink.url,
                title: title,
                subject: newLink.subject || 'General',
                type: type,
                dateAdded: new Date().toISOString()
            };

            const created = await api.webReferences.create(payload).catch(e => ({ ...payload, _id: Date.now() })); 
            setLinks([created, ...links]);
            setNewLink({ ...newLink, url: '' }); 
        } catch (err) {
            console.error("Failed to add link:", err);
            alert("Failed to save link");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this link?")) {
            try {
                await api.webReferences.delete(id).catch(e => { }); 
                setLinks(links.filter(l => l._id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    const handleOpenLink = (url) => {
        window.open(url, '_blank');
    };

    const startEdit = (link) => {
        setEditingLink(link);
        setEditForm({
            title: link.title || '',
            url: link.url || '',
            subject: link.subject || 'General',
            type: link.type || 'article'
        });
    };

    const saveEdit = async () => {
        try {
            const updated = await api.webReferences.update(editingLink._id, editForm).catch(e => ({ ...editForm, _id: editingLink._id }));
            setLinks(links.map(l => l._id === editingLink._id ? updated : l));
            setEditingLink(null);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update link");
        }
    };

    const filters = [
        { id: 'all', label: 'All Links' },
        { id: 'video', label: 'Videos' },
        { id: 'article', label: 'Articles' },
        { id: 'documentation', label: 'Docs' },
    ];

    const filteredLinks = links.filter(link => {
        const matchesFilter = activeFilter === 'all' || link.type === activeFilter;
        
        const matchesSearch =
            (link.title && link.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (link.url && link.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (link.subject && link.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getLinkIcon = (type) => {
        switch (type) {
            case 'video': return <Youtube className="text-red-500" />;
            case 'documentation': return <Book className="text-blue-500" />;
            default: return <Globe className="text-green-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <SubjectManagerModal
                isOpen={isSubjectManagerOpen}
                onClose={() => setIsSubjectManagerOpen(false)}
                onSubjectsUpdated={fetchSubjects}
            />

            {/* Input Zone */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Paste URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. https://www.youtube.com/watch?v=..."
                                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-64">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Subject</label>
                            <button
                                onClick={() => setIsSubjectManagerOpen(true)}
                                className="text-[10px] text-primary hover:text-primary/80 font-medium flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded transition-colors"
                            >
                                <Edit2 className="w-3 h-3" /> Manage
                            </button>
                        </div>
                        <div className="relative">
                            <select
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                value={newLink.subject}
                                onChange={(e) => setNewLink({ ...newLink, subject: e.target.value })}
                            >
                                <option value="" disabled>Select Subject...</option>
                                <option value="General">General</option>
                                {subjects.map(s => (
                                    <option key={s._id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                            {/* Custom Arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <Button
                            onClick={handleAddLink}
                            disabled={!newLink.url.trim() || adding}
                            iconName="Plus"
                        >
                            {adding ? 'Saving...' : 'Save Link'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Links List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[200px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-accent/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-5 pl-2">Reference</div>
                    <div className="col-span-3 hidden md:block">Subject</div>
                    <div className="col-span-3 md:col-span-2">Type</div>
                    <div className="col-span-3 md:col-span-2 flex justify-end">Actions</div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading references...</div>
                    ) : filteredLinks.length > 0 ? (
                        filteredLinks.map((link) => (
                            <div key={link._id || Math.random()} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/5 transition-colors group">
                                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg border border-border">
                                        {getLinkIcon(link.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate" title={link.url}>{link.title || link.url}</p>
                                        <p className="text-xs text-muted-foreground md:hidden">{link.subject}</p>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline md:hidden truncate block mt-1">
                                            {link.url}
                                        </a>
                                    </div>
                                </div>

                                <div className="col-span-3 hidden md:block">
                                    <span className="text-sm text-foreground bg-accent/50 px-2 py-0.5 rounded text-xs">{link.subject}</span>
                                </div>

                                <div className="col-span-3 md:col-span-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-secondary text-secondary-foreground`}>
                                        {link.type || 'link'}
                                    </span>
                                </div>

                                <div className="col-span-3 md:col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                                        onClick={() => handleOpenLink(link.url)}
                                        title="Open Link"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(link._id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Link className="w-8 h-8 opacity-40" />
                            </div>
                            <p>No web references found.</p>
                            <p className="text-sm opacity-70">Paste a URL above to save your first link.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebReferenceHub;

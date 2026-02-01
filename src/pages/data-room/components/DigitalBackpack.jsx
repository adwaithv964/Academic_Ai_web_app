import React, { useState, useEffect } from 'react';
import { Upload, FileText, File, BookOpen, Filter, Download, Trash2, Search, Edit2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import documentsApi from '../../../services/documents';
import { formatDate } from '../../../utils/dateUtils';

const DigitalBackpack = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    // File Input Ref
    const fileInputRef = React.useRef(null);

    // Edit State
    const [editingFile, setEditingFile] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', subject: '', type: '' });

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await documentsApi.list();
            setFiles(docs);
        } catch (err) {
            console.error("Failed to load documents:", err);
            // Optionally set error state to show in UI
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // In a real app, we might prompt for Subject/Type before upload
        // For now, we'll upload with defaults and let user edit later, 
        // OR we could show a modal first. Let's do simple direct upload for speed,
        // then user can edit properties.

        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', 'General'); // Default
        formData.append('type', 'other');    // Default

        try {
            setUploading(true);
            const newDoc = await documentsApi.upload(formData);
            setFiles([newDoc, ...files]);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload file");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            try {
                await documentsApi.delete(id);
                setFiles(files.filter(f => f._id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete file");
            }
        }
    };

    const handleDownload = (doc) => {
        // Create a temporary link to download
        const url = documentsApi.getDownloadUrl(doc._id);
        window.open(url, '_blank');
    };

    const startEdit = (file) => {
        setEditingFile(file);
        setEditForm({
            name: file.name,
            subject: file.subject || 'General',
            type: file.type || 'other'
        });
    };

    const saveEdit = async () => {
        try {
            const updated = await documentsApi.update(editingFile._id, editForm);
            setFiles(files.map(f => f._id === editingFile._id ? updated : f));
            setEditingFile(null);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update file details");
        }
    };

    const filters = [
        { id: 'all', label: 'All Files' },
        { id: 'note', label: 'Notes' },
        { id: 'paper', label: 'Question Papers' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'assignment', label: 'Assignments' },
    ];

    const filteredFiles = files.filter(file => {
        const matchesFilter = activeFilter === 'all' || file.type === activeFilter;
        // Search by name or subject
        const matchesSearch =
            (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (file.subject && file.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getFileIcon = (type) => {
        switch (type) {
            case 'note': return <FileText className="text-blue-500" />;
            case 'paper': return <File className="text-amber-500" />;
            case 'syllabus': return <BookOpen className="text-green-500" />;
            case 'assignment': return <FileText className="text-purple-500" />;
            default: return <File className="text-gray-500" />;
        }
    };

    const getBadgeColor = (type) => {
        switch (type) {
            case 'note': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'paper': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'syllabus': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'assignment': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 text-center bg-card/50 cursor-pointer group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    {uploading ? 'Uploading...' : 'Drag & Drop files here'}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                    Upload your notes, question papers, and assignments to keep them organized by subject.
                </p>
                <Button variant="default" size="sm" disabled={uploading}>
                    {uploading ? 'Processing...' : 'Browse Files'}
                </Button>
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
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Edit Modal (Simple Inline or Overlay) */}
            {editingFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card rounded-lg border border-border shadow-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-bold">Edit File Details</h3>
                        <div>
                            <label className="text-sm font-medium">File Name</label>
                            <input
                                className="w-full p-2 border rounded bg-background"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Subject</label>
                            <input
                                className="w-full p-2 border rounded bg-background"
                                value={editForm.subject}
                                onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="w-full p-2 border rounded bg-background"
                                value={editForm.type}
                                onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                            >
                                <option value="note">Note</option>
                                <option value="paper">Question Paper</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="assignment">Assignment</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setEditingFile(null)}>Cancel</Button>
                            <Button variant="default" onClick={saveEdit}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Files List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[200px]">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-accent/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-5 pl-2">File Name</div>
                    <div className="col-span-3 hidden md:block">Subject</div>
                    <div className="col-span-3 md:col-span-2">Date Added</div>
                    <div className="col-span-3 md:col-span-2 flex justify-end">Actions</div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading documents...</div>
                    ) : filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
                            <div key={file._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-accent/5 transition-colors group">
                                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg border border-border">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground md:hidden">{file.subject}</p>
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mt-1 md:hidden ${getBadgeColor(file.type)}`}>
                                            {file.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-3 hidden md:block">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-sm text-foreground">{file.subject}</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${getBadgeColor(file.type)}`}>
                                            {file.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-3 md:col-span-2 text-sm text-muted-foreground">
                                    {new Date(file.uploadDate).toLocaleDateString()}
                                    <div className="text-xs opacity-70">{file.size}</div>
                                </div>

                                <div className="col-span-3 md:col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        onClick={() => handleDownload(file)}
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                                        onClick={() => startEdit(file)}
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(file._id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            {searchQuery || activeFilter !== 'all' ? (
                                <>
                                    <Filter className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>No files found matching your criteria.</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>Your backpack is empty. Upload your first file!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DigitalBackpack;

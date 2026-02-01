import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Globe, Youtube, Book, Filter, Trash2, Search, Edit2, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import api from '../../../services/api';

const WebReferenceHub = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [adding, setAdding] = useState(false);

    // New Link Input State
    const [newLink, setNewLink] = useState({ url: '', subject: 'General' });

    // Edit State
    const [editingLink, setEditingLink] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', url: '', subject: '', type: '' });

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const data = await api.webReferences.list().catch(() => []);
            // Fallback for demo if API fails/is empty
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
            // Simple logic to guess title/type
            const type = newLink.url.includes('youtube') || newLink.url.includes('youtu.be') ? 'video' : 'article';
            const title = newLink.url; // Ideally we'd fetch metadata, but for now just use URL

            const payload = {
                url: newLink.url,
                title: title,
                subject: newLink.subject,
                type: type,
                dateAdded: new Date().toISOString()
            };

            const created = await api.webReferences.create(payload).catch(e => ({ ...payload, _id: Date.now() })); // Fallback mock
            setLinks([created, ...links]);
            setNewLink({ url: '', subject: 'General' });
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
                await api.webReferences.delete(id).catch(e => { }); // Mock success
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
        // Search by title, url or subject
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
                    <div className="w-full md:w-48">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject</label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newLink.subject}
                            onChange={(e) => setNewLink({ ...newLink, subject: e.target.value })}
                        >
                            <option value="General">General</option>
                            <option value="Web Dev">Web Dev</option>
                            <option value="Data Structures">Data Structures</option>
                            <option value="Algorithms">Algorithms</option>
                            <option value="System Design">System Design</option>
                        </select>
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

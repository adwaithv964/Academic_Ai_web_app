import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const Soundscapes = ({ onBack }) => {
    
    
    const sounds = [
        { id: 'lofi', name: 'Lofi Beats', videoId: 'jfKfPfyJRdk', icon: 'Music', color: 'bg-purple-500', desc: 'Chill beats to study to' }, 
        { id: 'classical', name: 'Mozart Effect', videoId: 'Rb0UmrCXxVA', icon: 'Book', color: 'bg-yellow-600', desc: 'Classical focus power' }, 
        { id: 'piano', name: 'Calm Piano', videoId: 'Cnfj6QCGLyA', icon: 'Layout', color: 'bg-blue-400', desc: 'Peaceful melodies' }, 
        { id: 'jazz', name: 'Coffee Jazz', videoId: 'NJuSStkIZBg', icon: 'Coffee', color: 'bg-amber-700', desc: 'Cafe ambience & jazz' }, 
        { id: 'alpha', name: 'Alpha Waves', videoId: 'WPni755-Krg', icon: 'Activity', color: 'bg-indigo-600', desc: 'Deep concentration' }, 
        { id: 'synth', name: 'Synthwave', videoId: '4xDzrJKXOOY', icon: 'Cpu', color: 'bg-pink-600', desc: 'Retro futuristic focus' }, 
    ];

    const [activeSound, setActiveSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customVideoId, setCustomVideoId] = useState(null);

    const toggleSound = (sound) => {
        if (activeSound === sound.id) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveSound(sound.id);
            setCustomVideoId(null);
            setIsPlaying(true);
            setSearchQuery(''); 
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setActiveSound('custom');
            setIsPlaying(true);
            setCustomVideoId(null);
        }
    };

    const currentVideoId = activeSound === 'custom' ? null : (activeSound ? sounds.find(s => s.id === activeSound)?.videoId : null);

    
    
    const embedUrl = activeSound === 'custom'
        ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&controls=1`
        : `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=0&loop=1&playlist=${currentVideoId}&origin=${window.location.origin}`;


    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Focus Soundscapes</h1>
            </div>

            {/* Player / Search Area */}
            <div className="bg-slate-900 rounded-2xl p-6 text-center min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">

                {isPlaying && (activeSound || searchQuery) ? (
                    <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-2xl relative z-10 bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="relative z-10 w-full max-w-sm mx-auto py-8">
                        <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center backdrop-blur-md border border-white/20 text-white">
                            <Icon name="Headphones" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to Focus?</h2>
                        <p className="text-slate-400 text-sm">Select a sound or search YouTube below.</p>
                    </div>
                )}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sounds.map(sound => (
                    <button
                        key={sound.id}
                        onClick={() => toggleSound(sound)}
                        className={`p-4 rounded-xl border text-left transition-all ${activeSound === sound.id && !searchQuery ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-100 bg-white hover:border-indigo-200'}`}
                    >
                        <div className={`w-10 h-10 rounded-lg ${sound.color} text-white flex items-center justify-center mb-3 shadow-sm`}>
                            <Icon name={sound.icon} size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">{sound.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{sound.desc}</p>
                        {activeSound === sound.id && isPlaying && !searchQuery && (
                            <span className="text-xs text-indigo-600 font-medium animate-pulse flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Playing
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Mini Search Iframe Widget */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="Search" className="text-red-600" size={18} />
                    Find on YouTube
                </h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for 'Lo-Fi', 'Study Beats', 'Mozart'..."
                        className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                        Play
                    </Button>
                </form>
                {activeSound === 'custom' && (
                    <div className="mt-4 flex flex-col items-start gap-2">
                        <p className="text-xs text-gray-500">
                            Playing search results for: <span className="font-medium text-gray-900">"{searchQuery}"</span>
                        </p>
                        <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 flex items-center gap-1">
                            <Icon name="AlertCircle" size={12} />
                            If playback fails, click below to open directly.
                        </p>
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Icon name="ExternalLink" size={12} />
                            Open "{searchQuery}" on YouTube
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Soundscapes;

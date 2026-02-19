import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ZenMode = ({ onExit }) => {
    
    
    

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col animate-in fade-in duration-500">
            <div className="absolute top-6 right-6">
                <Button variant="outline" onClick={onExit} className="flex items-center gap-2">
                    <Icon name="LogOut" size={16} />
                    Exit Zen Mode
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto p-8 text-center space-y-8">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Icon name="Feather" size={48} />
                </div>

                <h1 className="text-4xl font-light text-gray-800 tracking-wide">Zen Mode</h1>
                <p className="text-xl text-gray-500 font-light leading-relaxed">
                    Distractions are hidden. The sidebar is gone.<br />
                    It's just you and your work now.
                </p>

                <div className="p-8 border-t border-b border-gray-100 w-full">
                    <p className="text-gray-400 italic">"The successful warrior is the average man, with laser-like focus." — Bruce Lee</p>
                </div>
            </div>
        </div>
    );
};

export default ZenMode;

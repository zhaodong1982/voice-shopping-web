import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
    isListening: boolean;
    onClick: () => void;
}

export function VoiceOrb({ isListening, onClick }: VoiceOrbProps) {
    return (
        <button
            data-testid="voice-orb-button"
            onClick={onClick}
            className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none ${isListening ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/50'
                }`}
        >
            {isListening && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            )}
            <Mic className="w-10 h-10 text-white z-10" />
        </button>
    );
}

import React from 'react';

interface VoiceSelectorProps {
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ voices, selectedVoice, onVoiceChange }: VoiceSelectorProps) {
    // Filter for Chinese voices
    const chineseVoices = voices.filter(v => v.lang.includes('zh') || v.lang.includes('CN'));
    const displayVoices = chineseVoices.length > 0 ? chineseVoices : voices;

    // Gender detection
    const getGender = (voice: SpeechSynthesisVoice): 'Male' | 'Female' | 'Unknown' => {
        const name = voice.name.toLowerCase();
        if (name.includes('female') || name.includes('woman') || name.includes('lili') || name.includes('ting-ting')) return 'Female';
        if (name.includes('male') || name.includes('man') || name.includes('daniel')) return 'Male';
        return 'Unknown';
    };

    const currentGender = selectedVoice ? getGender(selectedVoice) : 'Unknown';

    const selectGender = (gender: 'Male' | 'Female') => {
        const bestMatch = displayVoices.find(v => getGender(v) === gender);
        if (bestMatch) {
            onVoiceChange(bestMatch);
        } else if (displayVoices.length > 0) {
            onVoiceChange(displayVoices[0]);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-2">
            <button
                onClick={() => selectGender('Female')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${currentGender === 'Female'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
            >
                女声
            </button>
            <button
                onClick={() => selectGender('Male')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${currentGender === 'Male'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
            >
                男声
            </button>
        </div>
    );
}

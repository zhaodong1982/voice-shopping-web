import React from 'react';

interface VoiceSelectorProps {
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ voices, selectedVoice, onVoiceChange }: VoiceSelectorProps) {
    // Filter for Chinese voices
    const chineseVoices = voices.filter(v => v.lang.includes('zh') || v.lang.includes('CN'));
    // Fallback to all if no Chinese voices found
    const displayVoices = chineseVoices.length > 0 ? chineseVoices : voices;

    // Improved gender heuristic
    const getGender = (voice: SpeechSynthesisVoice): 'Male' | 'Female' | 'Unknown' => {
        const name = voice.name.toLowerCase();
        if (name.includes('female') || name.includes('woman') || name.includes('lili') || name.includes('ting-ting') || name.includes('meijia') || name.includes('samantha') || name.includes('victoria') || name.includes('karen')) return 'Female';
        if (name.includes('male') || name.includes('man') || name.includes('daniel') || name.includes('fred') || name.includes('sin-ji')) return 'Male';
        return 'Unknown';
    };

    const currentGender = selectedVoice ? getGender(selectedVoice) : 'Unknown';

    const selectGender = (gender: 'Male' | 'Female') => {
        // Find the first voice of the requested gender
        const bestMatch = displayVoices.find(v => getGender(v) === gender);
        if (bestMatch) {
            onVoiceChange(bestMatch);
        } else {
            // Fallback: just pick the first one if no match (or maybe show alert? nah, just fallback)
            if (displayVoices.length > 0) onVoiceChange(displayVoices[0]);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            {/* Quick Toggles */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-1 flex gap-1">
                <button
                    onClick={() => selectGender('Female')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        currentGender === 'Female'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 font-medium'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                >
                    👩 女声
                </button>
                <button
                    onClick={() => selectGender('Male')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        currentGender === 'Male'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                >
                    👨 男声
                </button>
            </div>

            {/* Advanced Selector (Collapsible or just small) */}
            <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    if (voice) onVoiceChange(voice);
                }}
                className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-1 shadow-sm"
            >
                {displayVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                        {voice.name.replace('Google', '').replace('Microsoft', '').trim()}
                    </option>
                ))}
            </select>
        </div>
    );
}

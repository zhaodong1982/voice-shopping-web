import { useCallback, useState, useEffect } from 'react';

export function useVoiceOutput() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Try to set a default "Male" sounding voice
                // "Daniel" is a good male voice on Mac
                // "Google US English" is often female, but let's look for "Male" in name
                const defaultVoice = availableVoices.find(v => v.name.includes('Daniel')) ||
                    availableVoices.find(v => v.name.includes('Google US English')) ||
                    availableVoices[0];

                if (defaultVoice) {
                    setSelectedVoice(defaultVoice);
                }
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            window.speechSynthesis.speak(utterance);
        }
    }, [selectedVoice]);

    return { speak, voices, selectedVoice, setSelectedVoice };
}

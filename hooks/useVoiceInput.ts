import { useState, useEffect, useCallback } from 'react';

export function useVoiceInput() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if running on HTTPS or localhost
            const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';

            if (!isSecureContext) {
                setError('Voice recognition requires HTTPS. Please use https:// or localhost.');
                return;
            }

            if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = 'zh-CN';

                recognitionInstance.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                recognitionInstance.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setError(`语音识别错误: ${event.error}`);
                    setIsListening(false);
                };

                setRecognition(recognitionInstance);
            } else {
                setError('您的浏览器不支持语音识别功能');
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (error) {
            alert(error);
            return;
        }

        if (recognition) {
            try {
                recognition.start();
                setIsListening(true);
                setTranscript('');
                setError(null);
            } catch (e) {
                console.error("Recognition already started", e);
            }
        }
    }, [recognition, error]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    return { isListening, transcript, startListening, stopListening, error };
}

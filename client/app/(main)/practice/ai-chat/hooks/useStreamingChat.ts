import { useState, useRef, useCallback } from 'react';

export function useStreamingChat() {
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
    }, []);

    const sendMessage = useCallback(
        async (
            messages: { role: string; content: string }[],
            topic: string,
            onChunk: (chunk: string) => void,
            onDone: () => void,
            onError: (err: string) => void
        ) => {
            abortControllerRef.current = new AbortController();
            setIsStreaming(true);

            try {
                const response = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages, topic }),
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    const err = await response.json();
                    onError(err.error || 'Failed to connect to AI');
                    setIsStreaming(false);
                    return;
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    onError('No response stream');
                    setIsStreaming(false);
                    return;
                }

                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6).trim();
                            if (data === '[DONE]') {
                                onDone();
                                setIsStreaming(false);
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                const delta = parsed?.choices?.[0]?.delta?.content;
                                if (delta) {
                                    onChunk(delta);
                                }
                            } catch {
                                // Ignore parse errors for partial chunks
                            }
                        }
                    }
                }

                onDone();
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    onError(err.message || 'Stream error');
                }
            } finally {
                setIsStreaming(false);
            }
        },
        []
    );

    return { isStreaming, sendMessage, stopStreaming };
}

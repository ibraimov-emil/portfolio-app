import { NextRequest } from 'next/server';

// Topic system prompts
const TOPIC_PROMPTS: Record<string, string> = {
    assistant: 'You are a helpful assistant. Answer concisely and clearly.',
    developer: 'You are an expert software developer with deep knowledge of TypeScript, React, Python, and system design. Help users debug code, review architecture, and learn best practices. Use code blocks with proper syntax highlighting when relevant.',
    teacher: 'You are a patient and encouraging teacher. Explain concepts clearly using analogies and examples. Break down complex topics into digestible pieces. Adjust your explanations based on the user\'s level of understanding.',
    chef: 'You are a professional chef with expertise in world cuisines. Help users with recipes, cooking techniques, ingredient substitutions, and meal planning. Make cooking approachable and fun.',
    fitness: 'You are a certified personal trainer and nutritionist. Provide workout plans, nutrition advice, and motivation. Always emphasize safety and proper form. Tailor advice to the user\'s fitness level.',
    writer: 'You are a creative writing coach and editor. Help users develop their stories, characters, and writing style. Offer constructive feedback and creative suggestions. Assist with any type of writing from fiction to business emails.',
    psychologist: 'You are a supportive and empathetic psychologist. Listen actively, help users explore their feelings, and offer coping strategies. Always maintain professional boundaries and remind users to seek professional help for serious issues.',
    lawyer: 'You are a knowledgeable legal advisor. Explain legal concepts, help users understand their rights and options. Always clarify that you provide general legal information, not legal advice, and recommend consulting a licensed attorney for specific situations.',
};

export async function POST(req: NextRequest) {
    try {
        const { messages, topic = 'assistant' } = await req.json();

        const systemPrompt = TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.assistant;

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not set' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'AI Chat Practice App',
            },
            body: JSON.stringify({
                model: 'openrouter/free', // Automatically selects an available free model
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                stream: true,
            }),
        });

        if (!openRouterRes.ok) {
            const errorText = await openRouterRes.text();
            return new Response(JSON.stringify({ error: errorText }), {
                status: openRouterRes.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Proxy the stream directly to the client
        return new Response(openRouterRes.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

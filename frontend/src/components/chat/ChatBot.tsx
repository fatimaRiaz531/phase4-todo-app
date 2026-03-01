
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Send, Bot, User, Loader2, Sparkles, LogIn } from 'lucide-react';
import { useAuth, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useClerkApi } from '@/lib/api/clerk-client';

// Define message type
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolCalls?: any[];
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isSignedIn, isLoaded } = useAuth();
    const apiClient = useClerkApi();
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!isSignedIn) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now()).toString(),
                    role: 'assistant',
                    content: 'Please sign in to chat with me. Click the "Log In" button in the navigation bar.',
                },
            ]);
            setInput('');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await apiClient.post<any>('/chat', { message: userMessage.content });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || "I processed your request.",
                toolCalls: data.tool_calls
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMessage = error.message || 'Sorry, I encountered an error. Please try again.';
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: errorMessage.includes('HTTP error') ? `Backend error: ${errorMessage}` : errorMessage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
            >
                <Sparkles className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] shadow-2xl flex flex-col overflow-hidden border-2 border-pink-100 z-50">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    <CardTitle className="text-lg">Todo AI Assistant</CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                >
                    <span className="sr-only">Close</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 18 18" />
                    </svg>
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-2">
                        <Bot className="h-12 w-12 opacity-20" />
                        <p className="text-sm">
                            I can help you manage your tasks.
                            <br />
                            Try "Add a task to buy milk"
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`flex gap-2 max-w-[85%] ${msg.role === 'user'
                                    ? 'flex-row-reverse'
                                    : 'flex-row'
                                    }`}
                            >
                                <div
                                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-pink-100 text-pink-600'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="h-5 w-5" />
                                    ) : (
                                        <Bot className="h-5 w-5" />
                                    )}
                                </div>
                                <div
                                    className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>

                                    {/* Tool Call Visualization */}
                                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                                        <div className="mt-2 text-xs border-t border-gray-100 pt-2 opacity-75">
                                            <p className="font-semibold mb-1">Actions:</p>
                                            {msg.toolCalls.map((tool, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded p-1 mb-1 font-mono text-[10px] truncate">
                                                    🔧 {tool.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="flex gap-2 max-w-[85%] flex-row">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                                <span className="text-xs text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 h-10 shadow-none"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="rounded-full bg-purple-600 hover:bg-purple-700 text-white h-9 w-9 shrink-0 shadow-sm"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}

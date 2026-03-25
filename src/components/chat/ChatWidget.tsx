"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, Phone } from "lucide-react";
import Link from "next/link";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<"menu" | "bot">("menu");
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
        { role: "bot", text: "Hello! I'm Riddhi AI. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setActiveChat("menu");
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Thank you for your message. Our team will get back to you shortly. In the meantime, feel free to browse our treatments." }
            ]);
        }, 1000);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeChat]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-lg shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {activeChat === "bot" && <Sparkles className="h-4 w-4 text-yellow-200" />}
                            <h3 className="font-medium tracking-wide uppercase text-sm">
                                {activeChat === "menu" ? "Contact Us" : "Riddhi AI"}
                            </h3>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-stone-800" onClick={toggleOpen}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-stone-50 p-4">
                        {activeChat === "menu" ? (
                            <div className="space-y-4 h-full flex flex-col justify-center">
                                <p className="text-center text-stone-600 mb-4">How would you like to connect?</p>

                                <Link href="https://wa.me/15147544499" target="_blank" className="w-full">
                                    <Button variant="outline" className="w-full justify-start gap-3 h-14 text-lg font-light hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all">
                                        <Phone className="h-5 w-5" />
                                        WhatsApp
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 h-14 text-lg font-light hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all"
                                    onClick={() => setActiveChat("bot")}
                                >
                                    <Sparkles className="h-5 w-5" />
                                    Chat with Riddhi AI
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === "user"
                                                    ? "bg-stone-900 text-white rounded-br-none"
                                                    : "bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area (only for bot chat) */}
                    {activeChat === "bot" && (
                        <div className="p-4 bg-white border-t border-stone-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="rounded-full bg-stone-50 focus-visible:ring-stone-400"
                                />
                                <Button type="submit" size="icon" className="rounded-full bg-stone-900 hover:bg-stone-800 shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <Button
                                variant="link"
                                size="sm"
                                className="w-full mt-2 text-xs text-stone-400 h-auto p-0"
                                onClick={() => setActiveChat("menu")}
                            >
                                Back to Menu
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <Button
                onClick={toggleOpen}
                className="h-14 w-14 rounded-full bg-stone-900 hover:bg-stone-800 shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
}

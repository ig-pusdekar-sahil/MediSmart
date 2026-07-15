import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function Chatbot() {
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hello! I'm your medical AI assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e, overrideInput = null) => {
        if (e) e.preventDefault();
        const textToSubmit = overrideInput || input;
        if (!textToSubmit.trim()) return;

        const userMessage = { role: 'user', content: textToSubmit };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: input,
                history: history
            });

            const botMessage = { role: 'model', content: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            { role: 'model', content: "Hello! I'm your medical AI assistant. How can I help you today?" }
        ]);
        setInput('');
    };

    return (
        <div className="App">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

                <header className="header compact">
                    <h1 className="title small">
                        <span className="icon">💬</span>
                        Medical Chatbot
                    </h1>
                </header>

                <div className="main-content chat-container-card">
                    <div className="chat-header-bar">
                        <div className="assistant-info">
                            <span className="assistant-status-dot"></span>
                            <span className="assistant-status-text">AI Pharmacist Online</span>
                        </div>
                        <button className="clear-chat-btn" onClick={handleClearChat} title="Clear chat history">
                            🧹 Clear Conversation
                        </button>
                    </div>

                    <div className="messages-area-scroll">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.role}`}>
                                {msg.role === 'model' && (
                                    <div className="avatar-circle">💊</div>
                                )}
                                <div className={`message-bubble ${msg.role}`}>
                                    {msg.role === 'model' && (
                                        <div className="assistant-role-badge">AI Assistant</div>
                                    )}
                                    <div className="message-content">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="message-wrapper model">
                                <div className="avatar-circle">💊</div>
                                <div className="message-bubble model">
                                    <div className="message-content typing-dots">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-pill-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a medical or prescription query..."
                            disabled={loading}
                            className="chat-pill-input"
                        />
                        <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
                            Send ⚡
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;

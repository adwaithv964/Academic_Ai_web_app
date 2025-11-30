import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import { useAI } from '../hooks/useAI';

/**
 * AI Chat Component for Academic Assistance
 * Provides real-time AI tutoring and academic support
 */
const AIChat = ({ subject = 'general', isOpen = false, onClose = () => { } }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm your AI academic assistant. I can help you with ${subject} questions, study strategies, and academic planning. How can I assist you today?`,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { loading, error, startTutoringSession, resetState } = useAI();

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage?.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);

    // Create AI response placeholder
    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      await startTutoringSession(
        userMessage?.content,
        subject,
        (chunk) => {
          setMessages(prev =>
            prev?.map(msg =>
              msg?.id === aiMessageId
                ? { ...msg, content: msg?.content + chunk }
                : msg
            )
          );
        }
      );
    } catch (error) {
      setMessages(prev =>
        prev?.map(msg =>
          msg?.id === aiMessageId
            ? {
              ...msg,
              content: 'Sorry, I encountered an error. Please try again.',
              error: true
            }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
      setMessages(prev =>
        prev?.map(msg =>
          msg?.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Chat cleared! I'm here to help with your ${subject} questions. What would you like to discuss?`,
        timestamp: new Date(),
      }
    ]);
    resetState();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 bottom-[60px] sm:top-auto sm:left-auto sm:bottom-4 sm:right-4 w-full sm:w-96 h-auto sm:h-[600px] bg-card border-0 sm:border border-border sm:rounded-lg shadow-xl z-[400] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Academic Assistant</h3>
              <p className="text-xs text-muted-foreground capitalize">{subject} Tutor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              iconName="RotateCcw"
              className="h-8 w-8 p-0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              className="h-10 w-10 p-0"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <motion.div
              key={message?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message?.type === 'user' ? 'bg-primary text-primary-foreground'
                  : message?.error
                    ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted text-muted-foreground'
                  }`}
              >
                {/* Custom Message Formatter */}
                <div className="text-sm leading-relaxed">
                  {message?.content?.split('\n').map((line, i) => {
                    // Handle bullet points
                    const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
                    const cleanLine = isBullet ? line.trim().substring(2) : line;

                    // Handle bold text (**text**)
                    const parts = cleanLine.split(/\*\*(.*?)\*\*/g);

                    return (
                      <div key={i} className={`min-h-[1.5em] ${isBullet ? 'flex gap-2 ml-1' : ''}`}>
                        {isBullet && <span className="text-primary/70">•</span>}
                        <span className="break-words">
                          {parts.map((part, j) =>
                            // Even indices are normal text, odd are bold (captured groups)
                            j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
                          )}
                        </span>
                      </div>
                    );
                  })}
                  {message?.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-current opacity-50 animate-pulse ml-1">|</span>
                  )}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                <Icon name="AlertCircle" size={14} className="inline mr-2" />
                {error}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={`Ask about ${subject}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e?.target?.value)}
              onKeyDown={handleKeyPress}
              disabled={loading || isStreaming}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage?.trim() || loading || isStreaming}
              iconName={loading || isStreaming ? 'Loader2' : 'Send'}
              className={loading || isStreaming ? 'animate-spin' : ''}
            />
          </div>

          {(loading || isStreaming) && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Icon name="Brain" size={12} className="animate-pulse" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, RotateCcw, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `👋 Hi! I'm the **Metro Industrial Park** AI assistant.\n\nI can help you with:\n- 🏭 Shed availability & unit sizes\n- 📍 Location & connectivity\n- 💰 Pricing & investment returns\n- 📋 Amenities & specifications\n- 📞 How to book a site visit\n\nWhat would you like to know?`,
  id: 'welcome',
};

const SUGGESTED_QUESTIONS = [
  'What shed sizes are available?',
  'How is the location connected?',
  'What is the rental price range?',
  'What amenities are included?',
];

function MessageBubble({ message, isDark }) {
  const isUser = message.role === 'user';

  // Simple markdown-lite renderer: bold, newlines, bullet-ish lines
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 items-end ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ${
          isUser ? 'bg-red-600' : 'bg-gray-700'
        }`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-red-600 text-white rounded-br-sm'
            : isDark
            ? 'bg-gray-700 text-gray-100 rounded-bl-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {renderContent(message.content)}
      </div>
    </motion.div>
  );
}

function TypingIndicator({ isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-2.5 items-end"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white shadow-sm">
        <Bot size={13} />
      </div>
      <div
        className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-500"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Track scroll position to show scroll-down button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollDown(distFromBottom > 80);
  };

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      setInput('');
      setError(null);

      const userMessage = { role: 'user', content: trimmed, id: Date.now().toString() };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Build history (exclude welcome message)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to get a response.');
        }

        const assistantMessage = {
          role: 'assistant',
          content: data.reply,
          id: Date.now().toString() + '_ai',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    setError(null);
    setIsLoading(false);
  };

  const hasSuggestions = messages.length === 1;

  return (
    <>
      {/* ─── Chat Toggle Button ─── */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-red-600 text-white shadow-2xl flex items-center justify-center border border-white/20"
        aria-label={isOpen ? 'Close chat' : 'Open Metro AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-red-400"
          />
        )}
      </motion.button>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed bottom-[9rem] right-6 z-50 w-[22rem] sm:w-[26rem] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
              isDark
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
            style={{ maxHeight: 'calc(100dvh - 12rem)', minHeight: '420px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-none">Metro AI Assistant</p>
                <p className="text-xs text-red-200 mt-0.5">Metro Industrial Park · Changodar</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Reset conversation"
                  title="Start over"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
              style={{ overscrollBehavior: 'contain' }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isDark={isDark} />
              ))}

              {/* Suggested Questions */}
              {hasSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all hover:border-red-500 hover:text-red-600 ${
                        isDark
                          ? 'border-gray-600 text-gray-300 hover:bg-red-950'
                          : 'border-gray-300 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Loading */}
              <AnimatePresence>
                {isLoading && <TypingIndicator isDark={isDark} />}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-500 px-1 py-1.5 flex items-center gap-1.5"
                  >
                    <span>⚠️ {error}</span>
                    <button
                      onClick={() => setError(null)}
                      className="underline hover:no-underline"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-down button */}
            <AnimatePresence>
              {showScrollDown && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={scrollToBottom}
                  className={`absolute bottom-[72px] right-4 p-1.5 rounded-full shadow-md border ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-gray-300'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown size={14} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div
              className={`px-3 py-3 border-t flex-shrink-0 ${
                isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'
              }`}
            >
              <div
                className={`flex items-end gap-2 rounded-xl border px-3 py-2 transition-colors focus-within:border-red-500 ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sheds, pricing, location…"
                  rows={1}
                  disabled={isLoading}
                  className={`flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed max-h-24 ${
                    isDark ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  } disabled:opacity-60`}
                  style={{ fieldSizing: 'content' }}
                  aria-label="Chat message input"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                </button>
              </div>
              <p className={`text-[10px] mt-1.5 px-1 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Powered by Google Gemini · AI may make mistakes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

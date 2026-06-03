// ChatBot.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, RotateCcw, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Rate limit config ───
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_PER_WINDOW = 3;             // max 3 requests per 5 min
const RATE_LIMIT_DAILY = 15;                 // max 15 requests per day

function getRateLimitState() {
  try {
    const raw = sessionStorage.getItem('metro_ai_rl');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { windowStart: Date.now(), windowCount: 0, dayKey: todayKey(), dayCount: 0 };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function saveRateLimitState(state) {
  try { sessionStorage.setItem('metro_ai_rl', JSON.stringify(state)); } catch {}
}

function checkRateLimit() {
  let state = getRateLimitState();
  const now = Date.now();
  const today = todayKey();

  // Reset window if expired
  if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) {
    state.windowStart = now;
    state.windowCount = 0;
  }
  // Reset day count if new day
  if (state.dayKey !== today) {
    state.dayKey = today;
    state.dayCount = 0;
  }

  if (state.dayCount >= RATE_LIMIT_DAILY) {
    return { allowed: false, reason: 'daily' };
  }
  if (state.windowCount >= RATE_LIMIT_PER_WINDOW) {
    const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - state.windowStart)) / 1000);
    const waitMin = Math.ceil(waitSec / 60);
    return { allowed: false, reason: 'window', waitMin };
  }

  // Increment
  state.windowCount++;
  state.dayCount++;
  saveRateLimitState(state);
  return { allowed: true, remaining: RATE_LIMIT_PER_WINDOW - state.windowCount, dayRemaining: RATE_LIMIT_DAILY - state.dayCount };
}

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `👋 Hi! I'm the **Metro Industrial Park** AI assistant.\n\nI can help you with:\n- 🏭 Shed availability & unit sizes\n- 📍 Location & connectivity\n- 📋 Amenities & specifications\n- 📞 How to book a site visit\n\nWhat would you like to know?`,
  id: 'welcome',
};

const SUGGESTED_QUESTIONS = [
  'What shed sizes are available?',
  'How is the location connected?',
  'Which shed suits 1200–1500 yd²?',
  'What amenities are included?',
];

function MessageBubble({ message, isDark }) {
  const isUser = message.role === 'user';

  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm ${
        isUser ? 'bg-red-600' : 'bg-gray-600'
      }`}>
        {isUser ? <User size={11} /> : <Bot size={11} />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
        isUser
          ? 'bg-red-600 text-white rounded-br-sm'
          : isDark
          ? 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
      }`}>
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
      exit={{ opacity: 0 }}
      className="flex gap-2 items-end"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white">
        <Bot size={11} />
      </div>
      <div className={`rounded-2xl rounded-bl-sm px-3 py-2.5 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'
      }`}>
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-500"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const ChatBot = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([WELCOME_MESSAGE]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [rateLimitInfo, setRateLimitInfo]   = useState(null); // { remaining, dayRemaining }
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const messagesEndRef       = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef             = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 400);
      // Show current usage on open
      const state = getRateLimitState();
      const now = Date.now();
      const today = todayKey();
      const windowExpired = now - state.windowStart > RATE_LIMIT_WINDOW_MS;
      const windowCount = windowExpired ? 0 : state.windowCount;
      const dayCount = state.dayKey === today ? state.dayCount : 0;
      setRateLimitInfo({
        remaining: RATE_LIMIT_PER_WINDOW - windowCount,
        dayRemaining: RATE_LIMIT_DAILY - dayCount,
      });
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    // ─ Check rate limit before sending ─
    const limit = checkRateLimit();
    if (!limit.allowed) {
      const msg = limit.reason === 'daily'
        ? `You’ve reached the daily limit of ${RATE_LIMIT_DAILY} messages. The limit resets at midnight. For immediate help, WhatsApp +91 98242 35642 💬`
        : `You’ve sent ${RATE_LIMIT_PER_WINDOW} messages in the last 5 minutes. Please wait ${limit.waitMin} minute${limit.waitMin > 1 ? 's' : ''} and try again, or WhatsApp +91 98242 35642 💬`;
      setInput('');
      setMessages((p) => [...p,
        { role: 'user', content: trimmed, id: Date.now().toString() },
        { role: 'assistant', content: msg, id: Date.now() + '_rl' },
      ]);
      return;
    }

    setRateLimitInfo({ remaining: limit.remaining, dayRemaining: limit.dayRemaining });
    setInput('');
    const userMsg = { role: 'user', content: trimmed, id: Date.now().toString() };
    setMessages((p) => [...p, userMsg]);
    setIsLoading(true);

    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      const replyText = data.reply || 'Something went wrong. Please WhatsApp us at +91 98242 35642';
      setMessages((p) => [...p, { role: 'assistant', content: replyText, id: Date.now() + '_ai' }]);
    } catch {
      setMessages((p) => [...p, {
        role: 'assistant',
        content: 'Unable to connect right now. Please WhatsApp us at +91 98242 35642 for immediate help.',
        id: Date.now() + '_err',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleWindowKeyDown = (e) => { e.stopPropagation(); };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    setIsLoading(false);
  };

  const hasSuggestions = messages.length === 1;

  const surfaceBg    = isDark ? 'bg-[#0a0a0a]'   : 'bg-white';
  const surfaceBorder= isDark ? 'border-gray-800' : 'border-gray-200';
  const msgsBg       = isDark ? 'bg-[#0d0d0d]'   : 'bg-gray-50';
  const inputAreaBg  = isDark ? 'bg-[#0a0a0a]'   : 'bg-white';
  const inputBorder  = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputFieldBg = isDark ? 'bg-[#111111]'   : 'bg-gray-50';

  return (
    <>
      {/* ─── Chat FAB ─── */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-red-600 text-white shadow-2xl flex items-center justify-center border border-white/20"
        aria-label={isOpen ? 'Close chat' : 'Open Metro AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
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
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onKeyDown={handleWindowKeyDown}
            className={`
              fixed z-50 flex flex-col overflow-hidden border
              ${surfaceBg} ${surfaceBorder}
              bottom-0 left-0 right-0 rounded-t-2xl rounded-b-none
              max-h-[82dvh]
              sm:bottom-[5rem] sm:right-6 sm:left-auto
              sm:w-[26rem] sm:rounded-2xl sm:rounded-b-2xl
              sm:max-h-[calc(100dvh-7rem)] sm:min-h-[400px]
              shadow-2xl
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white flex-shrink-0 relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/30 sm:hidden" />
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bot size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-none">Metro AI Assistant</p>
                <p className="text-[11px] text-red-200 mt-0.5">Metro Industrial Park · Moraiya</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={resetChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Reset conversation">
                  <RotateCcw size={13} />
                </button>
                <button onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className={`flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3 overscroll-contain ${msgsBg}`}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isDark={isDark} />
              ))}

              {hasSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button key={q} onClick={() => sendMessage(q)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all
                        hover:border-red-500 hover:text-red-500 ${
                        isDark
                          ? 'border-gray-700 text-gray-400 hover:bg-red-950/40'
                          : 'border-gray-300 text-gray-500 hover:bg-red-50'
                      }`}>
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <AnimatePresence>
                {isLoading && <TypingIndicator isDark={isDark} />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-down button */}
            <AnimatePresence>
              {showScrollDown && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={scrollToBottom}
                  className={`absolute bottom-[68px] right-3.5 p-1.5 rounded-full shadow-lg border ${
                    isDark ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <ChevronDown size={13} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className={`px-3 py-2 border-t flex-shrink-0 ${inputAreaBg} border-${isDark ? 'gray-800' : 'gray-100'}
              pb-[max(0.5rem,env(safe-area-inset-bottom))]`}
            >
              <div className={`flex items-end gap-2 rounded-xl border px-3 py-2
                transition-colors focus-within:border-red-500 ${inputFieldBg} ${inputBorder}`}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sheds, availability, location…"
                  rows={1}
                  disabled={isLoading}
                  className={`flex-1 resize-none bg-transparent outline-none text-[13px] leading-relaxed
                    max-h-20 ${
                    isDark ? 'text-gray-100 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'
                  } disabled:opacity-50`}
                  style={{ fieldSizing: 'content' }}
                  aria-label="Chat message"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center
                    hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                </button>
              </div>
              {/* Usage hint */}
              <div className="flex items-center justify-between mt-1 px-0.5">
                <p className={`text-[10px] ${
                  isDark ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  Powered by Gemini AI · Responses may not always be accurate
                </p>
                {rateLimitInfo && (
                  <p className={`text-[10px] tabular-nums ${
                    rateLimitInfo.remaining <= 1
                      ? 'text-amber-500'
                      : isDark ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {rateLimitInfo.remaining}/{RATE_LIMIT_PER_WINDOW} · {rateLimitInfo.dayRemaining} today
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

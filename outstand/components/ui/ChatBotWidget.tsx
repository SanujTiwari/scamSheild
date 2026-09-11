'use client';

import React, { useState } from 'react';
import styles from './ChatBotWidget.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your JobShield AI Security Assistant. Ask me anything about job scams, recruiter domain checks, or fee verification.',
    },
  ]);

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    if (!userText) setInput('');

    // Generate intelligent AI Scam Advisor response
    setTimeout(() => {
      let botReply = 'I analyzed your query. Legitimate employers NEVER ask for advance payments, registration fees, or gift card purchases. Always verify recruiter emails against official corporate domains.';
      const lower = textToSend.toLowerCase();

      if (lower.includes('fee') || lower.includes('deposit') || lower.includes('payment')) {
        botReply = '⚠️ RED FLAG DETECTED: 100% of upfront payment requests (training fee, laptop deposit, background check cost) in remote job offers are fraudulent. Do not send funds!';
      } else if (lower.includes('gmail') || lower.includes('telegram') || lower.includes('whatsapp')) {
        botReply = '🔍 CAUTION: Scammers often conduct interviews strictly via Telegram or WhatsApp using @gmail.com accounts. Request a video call or corporate email confirmation before proceeding.';
      } else if (lower.includes('check') || lower.includes('overpaid')) {
        botReply = '🚨 FAKE CHECK SCAM WARNING: If an employer sends you a physical/digital check to buy equipment, it will bounce after a few days. Never wire money back!';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.chatWindow} data-border="true">
          <div className={styles.chatHeader}>
            <div className={styles.botTitleGroup}>
              <span className={styles.pulseDot} />
              <div>
                <h4 className={styles.botName}>JobShield AI Assistant</h4>
                <span className={styles.botSub}>Real-Time Threat Advisor</span>
              </div>
            </div>
            <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((m, i) => (
              <div key={i} className={m.sender === 'user' ? styles.userBubble : styles.botBubble}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className={styles.quickPrompts}>
            <button type="button" onClick={() => handleSend('Is asking for a $89 training fee a scam?')}>
              Is a $89 training fee fake?
            </button>
            <button type="button" onClick={() => handleSend('How do I verify a Telegram recruiter?')}>
              Verify Telegram recruiter
            </button>
          </div>

          <div className={styles.chatInputRow}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Ask AI Scam Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button type="button" className={styles.sendBtn} onClick={() => handleSend()}>
              Send
            </button>
          </div>
        </div>
      )}

      <button type="button" className={styles.triggerBtn} onClick={() => setOpen((prev) => !prev)}>
        🛡️ AI Security Chat
      </button>
    </div>
  );
}

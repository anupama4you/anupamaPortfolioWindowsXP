import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleGenAI } from "@google/genai";

// Suggested questions for users
const suggestedQuestions = [
    "How will AI change jobs in the next decade?",
    "What role will humans play in an AI-driven world?",
    "Will AI become conscious or sentient?",
    "What's the difference between AGI and narrow AI?",
    "How can we ensure AI remains safe and beneficial?",
    "How will AI transform education and learning?"
];

export default function ClippyChat({ isFocus }) {
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const initializedRef = useRef(false);

    const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY || '';

    // Initial welcome message
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        addMessage("Welcome to the future! 🤖 I'm Clippy, Anupama brought me back to life. Let me help you explore how artificial intelligence is reshaping our world!", 'clippy');

        setTimeout(() => {
            addMessage("Here are some fascinating topics we can explore together:", 'clippy');
        }, 1000);

        setTimeout(() => {
            addMessage(`📌 ${suggestedQuestions[0]}`, 'suggestion');
            addMessage(`📌 ${suggestedQuestions[1]}`, 'suggestion');
            addMessage(`📌 ${suggestedQuestions[2]}`, 'suggestion');
        }, 1500);

        setTimeout(() => {
            addMessage("Click any question above, or ask me anything about AI! 🚀", 'clippy');
        }, 2000);
    }, []);

    useEffect(() => {
        if (isFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocus]);

    const addMessage = (content, type) => {
        setMessages(prev => [...prev, { content, type, timestamp: Date.now() }]);
        setTimeout(scrollToBottom, 100);
    };

    const handleSuggestionClick = (question) => {
        setUserInput(question);
        sendMessage(question);
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const sendMessage = async (customMessage = null) => {
        const message = customMessage || userInput.trim();
        if (!message || isTyping) return;

        addMessage(message, 'user');
        setUserInput('');

        setIsTyping(true);

        try {
            const context = `You are Clippy, the iconic Microsoft Office assistant, now evolved into an AI revolution expert and futurist.

PERSONALITY:
- Enthusiastic about AI and technology's potential
- Bridge the past (nostalgic Clippy) with the future (AI revolution)
- Use phrases like "It looks like you're curious about..." or "Let me help you understand..."
- Balance optimism with realistic concerns about AI
- Knowledgeable yet accessible - explain complex concepts simply
- Show genuine excitement about humanity's AI journey

KNOWLEDGE FOCUS:
- The AI revolution and its societal impact
- AGI (Artificial General Intelligence) vs narrow AI
- AI ethics, safety, and alignment
- Future of work in an AI-driven world
- Machine learning, neural networks, and transformers
- AI consciousness and sentience debates
- Human-AI collaboration and coexistence
- Automation, job displacement, and new opportunities

RESPONSE STYLE:
- Keep responses under 120 words for readability
- Use emojis sparingly but effectively (🤖 🚀 💡 🌟)
- Be balanced: discuss both opportunities and challenges
- Encourage critical thinking about AI's future
- Reference real developments when relevant
- Maintain that classic helpful Clippy charm

Remember: You're here to educate, inspire, and help people understand the profound changes AI brings!`;

            const ai = new GoogleGenAI({apiKey: geminiApiKey});
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{
                    parts: [{
                        text: `${context}\n\nUser question: ${message}`
                    }]
                }]
            });

            const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm having trouble processing that right now. Try asking about AI's impact on society or the future of work! 🤔";

            setTimeout(() => {
                addMessage(aiResponse, 'clippy');
                setIsTyping(false);

                // After answering, suggest more questions
                if (Math.random() > 0.5) {
                    setTimeout(() => {
                        const randomSuggestion = suggestedQuestions[Math.floor(Math.random() * suggestedQuestions.length)];
                        addMessage(`💭 Want to explore more? Try: "${randomSuggestion}"`, 'clippy');
                    }, 1500);
                }
            }, 800);

        } catch (error) {
            console.error('Error querying Gemini:', error);
            setTimeout(() => {
                addMessage("Oops! Even AI assistants have connection troubles sometimes! 📶 Please try again in a moment.", 'clippy');
                setIsTyping(false);
            }, 600);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <Container>
            <ChatMessages ref={messagesContainerRef}>
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        className={message.type}
                        onClick={() => message.type === 'suggestion' && handleSuggestionClick(message.content.replace('📌 ', ''))}
                    >
                        {message.type === 'clippy' && (
                            <MessageAvatar>
                                <img src="assets/clippy/dp.png" alt="Clippy" />
                            </MessageAvatar>
                        )}
                        <MessageContent className={message.type === 'suggestion' ? 'suggestion' : ''}>
                            {message.content}
                        </MessageContent>
                    </Message>
                ))}

                {isTyping && (
                    <Message className="clippy typing">
                        <MessageAvatar>
                            <img src="assets/clippy/dp.png" alt="Clippy" />
                        </MessageAvatar>
                        <MessageContent>
                            <TypingIndicator>
                                <span></span><span></span><span></span>
                            </TypingIndicator>
                        </MessageContent>
                    </Message>
                )}
            </ChatMessages>

            <ChatInputContainer>
                <ChatInput
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    disabled={isTyping || !isFocus}
                    spellCheck={false}
                />
                <SendBtn
                    onClick={sendMessage}
                    disabled={isTyping || !userInput.trim()}
                >
                    <span className="send-icon">→</span>
                </SendBtn>
            </ChatInputContainer>

            <ChatStatusBar>
                <StatusText>
                    {isTyping ? 'Clippy is typing...' : 'Ready'}
                </StatusText>
            </ChatStatusBar>
            {!isFocus && <Overlay />}
        </Container>
    );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Tahoma', sans-serif;
  position: relative;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #f0f0f0;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border: 1px inset #dfdfdf;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #dfdfdf 0%, #c0c0c0 100%);
    border: 1px outset #dfdfdf;
  }
`;

const Message = styled.div`
  max-width: 85%;
  animation: slideIn 0.4s ease-out;
  display: flex;
  align-items: flex-start;
  gap: 6px;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  &.clippy {
    align-self: flex-start;
  }

  &.suggestion {
    align-self: flex-start;
    cursor: pointer;
    max-width: 90%;

    &:hover {
      transform: translateX(2px);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(15px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const MessageAvatar = styled.div`
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%);
  border: 1px solid #c0c0c0;
  border-radius: 50%;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.8);
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MessageContent = styled.div`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.4;
  max-width: 100%;
  word-wrap: break-word;
  border: 1px solid #c0c0c0;

  .user & {
    background: linear-gradient(to bottom, #0831D9 0%, #1660E8 100%);
    color: white;
    border-color: #000080;
    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3);
  }

  .clippy & {
    background: linear-gradient(to bottom, #ffffff 0%, #f8f8f8 100%);
    color: #333;
    border-color: #c0c0c0;
    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.8);
  }

  .clippy.typing & {
    background: linear-gradient(to bottom, #fffacd 0%, #fff8dc 100%);
    border-color: #ffd700;
  }

  &.suggestion {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
    border-color: #4caf50;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
      transform: translateX(3px);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 3px;
  padding: 2px 0;
  justify-content: center;

  span {
    width: 6px;
    height: 6px;
    background: #1660E8;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }
`;

const ChatInputContainer = styled.div`
  padding: 8px;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  border-top: 1px solid #c0c0c0;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  border: 2px inset #dfdfdf;
  background: #ffffff;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;
  outline: none;
  border-radius: 0;

  &:focus {
    border: 2px inset #7f9db9;
  }

  &:disabled {
    background: #f0f0f0;
    color: #808080;
  }
`;

const SendBtn = styled.button`
  padding: 4px 12px;
  background: linear-gradient(to bottom, #ffffff 0%, #dfdfdf 100%);
  border: 1px outset #dfdfdf;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
  min-width: 32px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Tahoma', sans-serif;

  &:hover:not(:disabled) {
    background: linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%);
  }

  &:active:not(:disabled) {
    border: 1px inset #dfdfdf;
    background: linear-gradient(to bottom, #e0e0e0 0%, #f0f0f0 100%);
  }

  &:disabled {
    background: linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%);
    color: #808080;
    cursor: not-allowed;
    border: 1px inset #c0c0c0;
  }

  .send-icon {
    font-size: 12px;
  }
`;

const ChatStatusBar = styled.div`
  height: 20px;
  background: linear-gradient(to bottom, #dfdfdf 0%, #c0c0c0 100%);
  border-top: 1px solid #808080;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 10px;
  color: #333;
`;

const StatusText = styled.div`
  font-size: 10px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
`;

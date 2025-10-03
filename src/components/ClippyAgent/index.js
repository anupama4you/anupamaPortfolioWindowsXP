import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { GoogleGenAI } from "@google/genai";

// Enhanced welcome messages focused on AI revolution
const welcomeMessages = [
    "Ready to explore the future of AI? Let's dive into the revolution!",
    "Curious about how AI will transform our world? Ask me anything!",
    "From assistant to intelligence - witness the AI evolution with me!",
    "The future is here! Let's discuss the AI revolution together!",
    "I've seen the future of AI, and it's fascinating! Want to know more?",
    "Join me in exploring how AI will reshape everything we know!",
    "From code to consciousness - let's talk about AI's journey!"
];

const WELCOME_INTERVALS = [12000, 18000, 25000, 30000, 40000];

// Suggested questions for users
const suggestedQuestions = [
    "How will AI change jobs in the next decade?",
    "What role will humans play in an AI-driven world?",
    "Will AI become conscious or sentient?",
    "What's the difference between AGI and narrow AI?",
    "How can we ensure AI remains safe and beneficial?",
    "How will AI transform education and learning?"
]; 

export default function ClippyAgent({
    spriteUrl = 'assets/clippy/clippy-sprite.png',
    definitionUrl = 'assets/clippy/clippyAnimations.json',
    scale = 1,
    origin = 'bottom left',
    title = 'Clippy AI Assistant - Click me!',
    geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY || ''
}) {
    // DOM refs
    const elRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const rafIdRef = useRef(null);
    const welcomeTimerRef = useRef(null);
    const currentIntervalIndexRef = useRef(0);

    // Animation state
    const [def, setDef] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(null);
    const [idx, setIdx] = useState(0);
    const lastRef = useRef(0);
    const elapsedRef = useRef(0);

    // Chat state
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [speechBubble, setSpeechBubble] = useState({
        show: false,
        text: '',
        type: 'welcome',
        animated: false
    });

    // Load definition
    useEffect(() => {
        async function loadDefinition() {
            try {
                const res = await fetch(definitionUrl);
                const data = await res.json();
                setDef(data);
            } catch (error) {
                console.error('Failed to load definition:', error);
            }
        }
        loadDefinition();
    }, [definitionUrl]);

    // Set frame
    const setFrame = useCallback((i) => {
        if (!current || !elRef.current) return;
        const frame = current.frames[i];
        if (!frame || !frame.images?.length) return;
        const [x, y] = frame.images[0];
        elRef.current.style.backgroundPosition = `-${x}px -${y}px`;
    }, [current]);

    // Animation tick
    const tick = useCallback((t) => {
        if (!current) return;

        if (!lastRef.current) lastRef.current = t;
        const dt = t - lastRef.current;
        lastRef.current = t;
        elapsedRef.current += dt;

        const dur = current.frames[idx].duration ?? 100;
        if (elapsedRef.current >= dur) {
            elapsedRef.current = 0;
            const newIdx = idx + 1;

            if (newIdx >= current.frames.length) {
                setPlaying(false);
                setIsActive(false);
                return;
            }

            setIdx(newIdx);
            setFrame(newIdx);
        }
        rafIdRef.current = requestAnimationFrame(tick);
    }, [current, idx, setFrame]);

    // Play animation
    const play = useCallback((name) => {
        if (!def) return;
        const anim = def.animations?.[name];
        if (!anim) {
            console.warn('No animation named:', name);
            return;
        }

        // Cancel current animation
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        setCurrent(anim);
        setIdx(0);
        lastRef.current = 0;
        elapsedRef.current = 0;
        setPlaying(true);
        setIsActive(true);

        setTimeout(() => {
            setIsActive(false);
        }, anim.frames.length * 150);
    }, [def]);

    // Animation loop
    useEffect(() => {
        if (playing && current) {
            rafIdRef.current = requestAnimationFrame(tick);
        }
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [playing, current, tick]);

    // Set initial frame
    useEffect(() => {
        if (current && idx === 0) {
            setFrame(0);
        }
    }, [current, idx, setFrame]);

    // Welcome message system
    const clearWelcomeTimer = useCallback(() => {
        if (welcomeTimerRef.current) {
            clearTimeout(welcomeTimerRef.current);
            welcomeTimerRef.current = null;
        }
    }, []);

    const showEnhancedSpeechBubble = useCallback((text, type = 'info', animated = false) => {
        setSpeechBubble({ show: true, text, type, animated });
        setTimeout(() => {
            setSpeechBubble(prev => ({ ...prev, show: false }));
        }, type === 'welcome' ? 4000 : 3000);
    }, []);

    const triggerWelcomeMessage = useCallback(() => {
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        showEnhancedSpeechBubble(randomMessage, 'welcome', true);
        play('GetAttention');
        setTimeout(() => {
            play('Wave');
        }, 1000);
    }, [play, showEnhancedSpeechBubble]);

    const scheduleNextWelcome = useCallback(() => {
        clearWelcomeTimer();
        if (!showChat) {
            const interval = WELCOME_INTERVALS[currentIntervalIndexRef.current % WELCOME_INTERVALS.length];
            currentIntervalIndexRef.current++;

            welcomeTimerRef.current = setTimeout(() => {
                if (!showChat && !isTyping) {
                    triggerWelcomeMessage();
                }
                scheduleNextWelcome();
            }, interval);
        }
    }, [showChat, isTyping, triggerWelcomeMessage, clearWelcomeTimer]);

    // Initial welcome sequence
    useEffect(() => {
        if (def) {
            setTimeout(() => {
                play('GetAttention');
            }, 500);

            setTimeout(() => {
                triggerWelcomeMessage();
            }, 2000);

            setTimeout(() => {
                scheduleNextWelcome();
            }, 5000);
        }

        return () => {
            clearWelcomeTimer();
        };
    }, [def, play, triggerWelcomeMessage, scheduleNextWelcome, clearWelcomeTimer]);

    // Manage welcome messages based on chat state
    useEffect(() => {
        if (!showChat) {
            setTimeout(() => {
                scheduleNextWelcome();
            }, 2000);
        } else {
            clearWelcomeTimer();
        }
    }, [showChat, scheduleNextWelcome, clearWelcomeTimer]);

    // Chat functions
    const toggleChat = () => {
        setShowChat(prev => !prev);
        if (!showChat) {
            play('Explain');
            setSpeechBubble(prev => ({ ...prev, show: false }));

            if (messages.length === 0) {
                setTimeout(() => {
                    addMessage("Welcome to the future! 🤖 I'm Clippy, Anupama brought me back to life. Let me help you explore how artificial intelligence is reshaping our world!", 'clippy');
                }, 500);

                // Show suggested questions after welcome
                setTimeout(() => {
                    addMessage("Here are some fascinating topics we can explore together:", 'clippy');
                }, 1500);

                setTimeout(() => {
                    addMessage(`📌 ${suggestedQuestions[0]}`, 'suggestion');
                    addMessage(`📌 ${suggestedQuestions[1]}`, 'suggestion');
                    addMessage(`📌 ${suggestedQuestions[2]}`, 'suggestion');
                }, 2000);

                setTimeout(() => {
                    addMessage("Click any question above, or ask me anything about AI! 🚀", 'clippy');
                }, 2500);
            }
            setTimeout(scrollToBottom, 100);
        } else {
            play('Wave');
        }
    };

    const handleClippyClick = () => {
        if (!showChat) {
            play('Wave');
            toggleChat();
        } else {
            play('GetAttention');
        }
    };

    const onInputFocus = () => {
        play('Thinking');
    };

    const addMessage = (content, type) => {
        setMessages(prev => [...prev, { content, type, timestamp: Date.now() }]);
        setTimeout(scrollToBottom, 100);

        // Trigger animation based on message type
        if (type === 'clippy') {
            play('Explain');
        } else if (type === 'suggestion') {
            play('GetAttention');
        }
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

    const determineAnimation = (response) => {
        const lowerResponse = response.toLowerCase();
        if (lowerResponse.includes('project') || lowerResponse.includes('work') || lowerResponse.includes('portfolio')) {
            return 'Explain';
        } else if (lowerResponse.includes('hello') || lowerResponse.includes('hi') || lowerResponse.includes('welcome')) {
            return 'Wave';
        } else if (lowerResponse.includes('skill') || lowerResponse.includes('technology') || lowerResponse.includes('code')) {
            return 'GetAttention';
        } else if (lowerResponse.includes('sorry') || lowerResponse.includes('trouble') || lowerResponse.includes('error')) {
            return 'GetAttention';
        }
        return 'Thinking';
    };

    const sendMessage = async (customMessage = null) => {
        const message = customMessage || userInput.trim();
        if (!message || isTyping) return;

        addMessage(message, 'user');
        setUserInput('');

        setIsTyping(true);
        play('Thinking');

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

console.log("Hello", geminiApiKey);
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

            const animation = determineAnimation(aiResponse);
            play(animation);

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
            play('GetAttention');
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

    // Sprite style
    const spriteStyle = {
        width: def ? `${def.framesize[0]}px` : '124px',
        height: def ? `${def.framesize[1]}px` : '93px',
        backgroundImage: `url("${spriteUrl}")`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        transform: `scale(${scale})`,
        transformOrigin: origin,
        cursor: 'pointer',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
    };

    return (
        <ClippyAgentWrapper>
            {/* Chat Interface */}
            {showChat && (
                <ChatInterface className={showChat ? 'chat-open' : ''}>
                    <ChatHeader>
                        <ChatHeaderContent>
                            <ChatIcon>📎</ChatIcon>
                            <ChatTitle>AI Expert Clippy</ChatTitle>
                        </ChatHeaderContent>
                        <CloseBtn onClick={toggleChat}>
                            <span className="close-x">×</span>
                        </CloseBtn>
                    </ChatHeader>

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
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={onInputFocus}
                            placeholder="Type your question here..."
                            disabled={isTyping}
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
                        <ResizeGrip />
                    </ChatStatusBar>
                </ChatInterface>
            )}

            {/* Clippy Sprite */}
            <ClippyWrapper onClick={handleClippyClick}>
                <ClippyGlow className={isActive ? 'active' : ''} />
                <div
                    ref={elRef}
                    className="clippy"
                    style={spriteStyle}
                    title={title}
                    role="img"
                    aria-label="Clippy AI Assistant"
                />

                {/* Speech Bubble */}
                {speechBubble.show && (
                    <SpeechBubble
                        className={`${speechBubble.type} ${speechBubble.animated ? 'animated' : ''}`}
                    >
                        <BubbleContent>{speechBubble.text}</BubbleContent>
                        <BubbleTail className={speechBubble.type} />
                    </SpeechBubble>
                )}
            </ClippyWrapper>
        </ClippyAgentWrapper>
    );
}

// Styled Components
const ClippyAgentWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  font-family: 'Tahoma', 'Trebuchet MS', sans-serif;
`;

const ClippyWrapper = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ClippyGlow = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(24, 100, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;

  &.active {
    opacity: 1;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
`;

const SpeechBubble = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%);
  border: 2px solid #7f9db9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 15px;
  max-width: 250px;
  min-width: 180px;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.25),
    inset 1px 1px 0 rgba(255,255,255,0.8);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1001;

  &.animated {
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), 
               wobble 2s ease-in-out 0.6s;
  }

  &.welcome {
    background: linear-gradient(135deg, #FFE066 0%, #FF8E53 100%);
    border-color: #E67E22;
    color: #2C3E50;
    font-weight: bold;
    box-shadow: 
      0 6px 12px rgba(0,0,0,0.3),
      inset 1px 1px 0 rgba(255,255,255,0.9);
  }

  &.info {
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    border-color: #2196F3;
    color: #1565C0;
  }

  @keyframes bounceIn {
    0% {
      transform: translateY(20px) scale(0.3);
      opacity: 0;
    }
    50% {
      transform: translateY(-10px) scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(1deg); }
    75% { transform: rotate(-1deg); }
  }
`;

const BubbleContent = styled.div`
  line-height: 1.4;
  word-wrap: break-word;
`;

const BubbleTail = styled.div`
  position: absolute;
  top: 100%;
  right: 25px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #7f9db9;

  &.welcome {
    border-top-color: #E67E22;
  }

  &.info {
    border-top-color: #2196F3;
  }
`;

const ChatInterface = styled.div`
  position: fixed;
  bottom: 180px;
  right: 20px;
  width: 380px;
  height: 450px;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  border: 1px solid #7f9db9;
  border-radius: 8px 8px 0 0;
  box-shadow:
    0 8px 25px rgba(0,0,0,0.4),
    inset 1px 1px 0 rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  font-family: 'Tahoma', sans-serif;
  transform: translateY(30px) scale(0.9);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;

  &.chat-open {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  @media (max-width: 480px) {
    width: calc(100vw - 20px);
    height: 70vh;
    right: 10px;
    bottom: 120px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(to bottom, 
    #0831D9 0%, 
    #1660E8 50%, 
    #0831D9 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: bold;
  border-bottom: 1px solid #000080;
`;

const ChatHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChatIcon = styled.div`
  font-size: 14px;
`;

const ChatTitle = styled.span`
  font-size: 11px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
`;

const CloseBtn = styled.button`
  background: linear-gradient(to bottom, #ff6b6b 0%, #dc3545 100%);
  border: 1px solid #dc3545;
  border-radius: 2px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 8px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3);

  &:hover {
    background: linear-gradient(to bottom, #ff5252 0%, #c62828 100%);
    transform: scale(1.05);
  }

  .close-x {
    font-weight: bold;
    line-height: 1;
  }
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

const ResizeGrip = styled.div`
  width: 12px;
  height: 12px;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 1px,
    #808080 1px,
    #808080 2px
  );
  opacity: 0.7`;
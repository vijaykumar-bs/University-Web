// ABC University AI Admissions Chatbot
console.log("UniBot AI Chatbot script loaded.");

function initChatbot() {
    console.log("Initializing Chatbot UI...");
    // 1. Inject Chatbot HTML
    const chatbotHTML = `
        <div id="ai-chatbot-container" class="chatbot-container">
            <button id="chatbot-toggle" class="chatbot-toggle-btn" title="Chat with UniBot AI">
                <i class="bi bi-robot"></i>
                <span class="btn-label">AI Help</span>
            </button>
            
            <div id="chatbot-window" class="chatbot-window d-none">
                <div class="chatbot-header">
                    <div>
                        <i class="bi bi-robot me-2"></i>
                        <strong>UniBot AI</strong>
                    </div>
                    <button id="chatbot-close" class="btn-close btn-close-white"></button>
                </div>
                
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="message bot-message">
                        Hello! I am UniBot, the ABC University AI Assistant. How can I help you today?
                        <div class="mt-3">
                            <span class="badge bg-light text-dark chat-suggestion p-2 mb-1">Admissions</span>
                            <span class="badge bg-light text-dark chat-suggestion p-2 mb-1">Fee Structure</span>
                            <span class="badge bg-light text-dark chat-suggestion p-2 mb-1">Placements</span>
                        </div>
                    </div>
                </div>
                
                <div class="chatbot-input">
                    <input type="text" id="chatbot-text-input" placeholder="Ask me anything..." autocomplete="off">
                    <button id="chatbot-send-btn"><i class="bi bi-send-fill"></i></button>
                </div>
            </div>
        </div>

        <style>
            .chatbot-container {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 100000;
                font-family: 'Outfit', sans-serif;
            }
            .chatbot-toggle-btn {
                min-width: 60px;
                height: 60px;
                border-radius: 30px;
                background: linear-gradient(135deg, #800000, #4A0F0F);
                color: white;
                border: 2px solid #C9A96E;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                font-size: 1.8rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 15px;
                gap: 10px;
            }
            .chatbot-toggle-btn .btn-label {
                font-size: 0.9rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .chatbot-toggle-btn:hover {
                transform: scale(1.05) translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            }
            .chatbot-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.1);
                animation: slideUp 0.4s ease-out;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .chatbot-header {
                background: linear-gradient(90deg, #800000, #4A0F0F);
                color: white;
                padding: 18px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 700;
                font-size: 1.1rem;
            }
            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #F8F4F1;
                display: flex;
                flex-direction: column;
                gap: 15px;
                scrollbar-width: thin;
            }
            .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            .bot-message {
                background: white;
                color: #333;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .user-message {
                background: #800000;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
                box-shadow: 0 2px 8px rgba(128, 0, 0, 0.2);
            }
            .chatbot-input {
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            .chatbot-input input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 25px;
                padding: 10px 18px;
                outline: none;
                font-size: 0.95rem;
                background: #f9f9f9;
            }
            .chatbot-input input:focus {
                border-color: #800000;
                background: white;
            }
            .chatbot-input button {
                background: #800000;
                color: white;
                border: none;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .chatbot-input button:hover {
                transform: scale(1.1);
            }
            .chat-suggestion {
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid rgba(0,0,0,0.1) !important;
            }
            .chat-suggestion:hover {
                background: #800000 !important;
                color: white !important;
            }
            .typing-indicator {
                display: flex;
                gap: 5px;
                padding: 15px;
                background: white;
                border-radius: 15px;
                align-self: flex-start;
                width: fit-content;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .typing-dot {
                width: 7px;
                height: 7px;
                background: #800000;
                opacity: 0.4;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out both;
            }
            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                40% { transform: scale(1); opacity: 1; }
            }
            @media (max-width: 480px) {
                .chatbot-window {
                    width: calc(100vw - 40px);
                    right: -10px;
                    height: 450px;
                }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const windowEl = document.getElementById('chatbot-window');
    const inputEl = document.getElementById('chatbot-text-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const messagesContainer = document.getElementById('chatbot-messages');

    let isOpen = false;

    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        windowEl.classList.toggle('d-none', !isOpen);
        if(isOpen) inputEl.focus();
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        windowEl.classList.add('d-none');
    });

    const knowledgeBase = [
        {
            keywords: ['admission', 'apply', 'join', 'process', 'enroll'],
            response: 'You can apply for admissions directly through our portal! The process is entirely online. <a href="apply.html" style="font-weight:bold; color:#800000">Click here to Apply Now</a>.'
        },
        {
            keywords: ['fee', 'cost', 'price', 'structure', 'amount', 'fees'],
            response: `
                <strong>Our Detailed Fee Structure (Per Year):</strong><br>
                <ul class="mt-2 mb-2 p-0" style="list-style:none; font-size: 0.9rem;">
                    <li><strong>B.Tech (CS):</strong> ₹1,50,000</li>
                    <li><strong>B.Tech (Engineering):</strong> ₹1,20,000</li>
                    <li><strong>B.Com / BBA:</strong> ₹85,000</li>
                    <li><strong>Allied Healthcare:</strong> ₹95,000</li>
                    <li><strong>Yoga & Humanities:</strong> ₹65,000</li>
                    <li><strong>PhD Programs:</strong> ₹50,000</li>
                </ul>
                <em>Note: Hostel and examination fees are additional.</em><br>
                <a href="admissions.html" class="btn btn-sm btn-outline-danger mt-2" style="font-size:0.8rem">Download Full Fee PDF</a>
            `
        },
        {
            keywords: ['placement', 'job', 'salary', 'package', 'company', 'recruit'],
            response: 'We have a 98% placement rate! The highest package this year was 24 LPA, with an average of 8.5 LPA. <a href="placements.html">View Placement Records</a>.'
        },
        {
            keywords: ['course', 'program', 'degree', 'study', 'offer'],
            response: 'We offer a wide range of programs in Computer Science, Engineering, Commerce, Healthcare, and Yoga. Check out our <a href="academics.html">Academics</a> section.'
        },
        {
            keywords: ['contact', 'phone', 'email', 'reach', 'address'],
            response: 'You can reach our admissions desk at +91-8762996815 or email us at info@abcuniversity.edu.in.'
        },
        {
            keywords: ['hello', 'hi', 'hey', 'morning'],
            response: 'Hello! Welcome to ABC University. How can I help you today?'
        }
    ];

    function getAIResponse(text) {
        text = text.toLowerCase();
        for (let item of knowledgeBase) {
            if (item.keywords.some(kw => text.includes(kw))) {
                return item.response;
            }
        }
        return "I'm sorry, I don't have the exact answer to that right now. Could you try asking about admissions, fees, or placements? Or visit our <a href='contact.html'>Contact page</a>.";
    }

    function appendMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleUserInput() {
        const text = inputEl.value.trim();
        if (!text) return;

        appendMessage(text, true);
        inputEl.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator bot-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            if (document.getElementById('typing-indicator')) {
                document.getElementById('typing-indicator').remove();
            }
            const response = getAIResponse(text);
            appendMessage(response, false);
        }, 1500);
    }

    sendBtn.addEventListener('click', handleUserInput);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-suggestion')) {
            inputEl.value = e.target.innerText;
            handleUserInput();
        }
    });
}

// Ensure execution
if (document.readyState === "complete" || document.readyState === "interactive") {
    initChatbot();
} else {
    document.addEventListener("DOMContentLoaded", initChatbot);
}

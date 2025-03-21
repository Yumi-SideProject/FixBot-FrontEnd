import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/chat.css";
import { sendMessageToOpenAI } from "../services/api.js";

function ChatBot() {
    const [searchParams] = useSearchParams();
    const brand = searchParams.get("brand") || "알 수 없음";
    const category = searchParams.get("category") || "알 수 없음";
    const question = searchParams.get("question") || "알 수 없음";

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: `🤖 안녕하세요! 😊 저는 FixBot입니다.\n` +
                `📌 고객님께서 입력하신 정보를 확인할게요!\n` +
                `🏷 브랜드: ${brand} | 🔧 카테고리: ${category}\n❓ 질문: ${question}\n` +
                `🔍 맞다면 아래에서 선택해주세요!`
        }
    ]);

    const [input, setInput] = useState("");
    const [conversationCount, setConversationCount] = useState(0);
    const [showOptions, setShowOptions] = useState(true);

    const sendOption = async (option) => {
        let message = "";
        let botResponse = "";

        if (option === "confirm") {
            message = "✅ 네, 맞아요!";
            botResponse = "이 원인이 맞는지 확인하고, 해결 방법을 알려주세요.";
        } else if (option === "uncertain") {
            message = "🤔 아니요, 잘 모르겠어요.";
            botResponse = "이 원인이 잘못되었을 가능성이 높습니다. 다른 가능성은 무엇인가요?";
        } else {
            console.error("⚠️ sendOption: 알 수 없는 옵션!", option);
            return;
        }

        setMessages([...messages, { sender: "user", text: message }]);
        const aiResponse = await sendMessageToOpenAI(botResponse, brand, category, question);
        setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: aiResponse }]);
        setConversationCount(conversationCount + 1);

        if (conversationCount + 1 >= 5) {
            setShowOptions(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");

        const aiResponse = await sendMessageToOpenAI(input, brand, category, question);
        setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: aiResponse }]);
        setConversationCount(conversationCount + 1);

        if (conversationCount + 1 >= 5) {
            setShowOptions(false);
        }
    };

    return (
        <div className="chat-container">
            <button className="top-right" onClick={() => window.history.back()}>🔙 뒤로 가기</button>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
                        {msg.sender === "bot" ? "🤖" : "👤"} {msg.text.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                ))}
            </div>

            {showOptions && (
                <div className="button-options">
                    <button onClick={() => sendOption("confirm")}>✅ 네, 맞아요!</button>
                    <button onClick={() => sendOption("uncertain")}>🤔 아니요, 잘 모르겠어요.</button>
                </div>
            )}

            <div className="input-area">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="문제에 대해 더 자세히 설명해주세요..." />
                <button onClick={sendMessage}>📩 전송</button>
            </div>
        </div>
    );
}

export default ChatBot;
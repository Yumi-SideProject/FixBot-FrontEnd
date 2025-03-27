import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/chat.css";
import { sendMessageToOpenAI } from "../services/api.js";
import { uploadImageToSupabase } from "../services/upload";

function ChatBot() {
    const [searchParams] = useSearchParams();
    const brand = searchParams.get("brand") || "알 수 없음";
    const category = searchParams.get("category") || "알 수 없음";
    const subcategory = searchParams.get("subcategory") || "알 수 없음";
    const question = searchParams.get("question") || "알 수 없음";

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState(null);
    const [pendingSearchQuery, setPendingSearchQuery] = useState(null);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: `안녕하세요! 😊 저는 FixBot입니다.\n` +
                `고객님께서 입력하신 정보를 확인할게요!\n` +
                `브랜드: ${brand} | 카테고리: ${category} | 세부 카테고리: ${subcategory}\n`+
                `질문: ${question}\n` +
                `🔍 맞다면 아래 창에 대답해주세요!`
        }
    ]);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const [messageQueue, setMessageQueue] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const flushQueue = () => {
        const combined = [...messageQueue];
        const lastWithQuery = combined.find((msg) =>
            msg.sender === "bot" && msg.text.includes("##검색어:")
        );

        if (lastWithQuery) {
            const queryLine = lastWithQuery.text
                .split("\n")
                .find((line) => line.trim().startsWith("##검색어:"));

            if (queryLine) {
                const query = queryLine.replace("##검색어:", "").trim();
                console.log("🎯 최종 검색어 감지됨:", query);
                setPendingSearchQuery(query);
            }
        }

        setMessages(prev => [...prev, ...combined]);
        setMessageQueue([]);
    };

    useEffect(() => {
        const saved = sessionStorage.getItem("fixbot_messages");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setMessages(parsed);
                }
            } catch (e) {
                console.error("세션 메시지 복원 실패:", e);
            }
        }
    }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem("fixbot_messages");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setMessages(parsed);
                }
            } catch (e) {
                console.error("세션 메시지 복원 실패:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (pendingSearchQuery) {
            setSearchQuery(pendingSearchQuery);
            setPendingSearchQuery(null);
        }
    }, [pendingSearchQuery]);

    useEffect(() => {
        if (messageQueue.length > 0 && !isTyping) {
            flushQueue();
        }
    }, [messageQueue, isTyping]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setInput("");
        setIsTyping(true);

        let imageUrl = null;

        if (imageFile) {
            try {
                imageUrl = await uploadImageToSupabase(imageFile, "chat");
                console.log("📷 이미지 업로드 완료:", imageUrl);

                const imageMessage = { sender: "user", text: "", imageUrl };
                setMessages((prev) => [...prev, userMessage, imageMessage]);

            } catch (err) {
                console.error("이미지 업로드 실패:", err.message);

                setMessages((prev) => [...prev, userMessage, {
                    sender: "system",
                    text: "⚠️ 이미지 업로드에 실패했어요. 다시 시도해 주세요.",
                }]);
            }
            setImageFile(null);
            setImagePreviewUrl(null);
        } else {
            setMessages((prev) => [...prev, userMessage]);
        }

        const aiResponse = await sendMessageToOpenAI(input, brand, category, subcategory, question, imageUrl);
        console.log("🧠 FixBot 응답 내용:", aiResponse);

        setMessageQueue(prev => [...prev, {
            sender: "bot",
            text: aiResponse,
        }]);

        setIsTyping(false);
    };

    return (
        <div className="chat-container">
            <button className="top-right" onClick={() => window.history.back()}>
                🔙 뒤로 가기
            </button>

            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
                        {msg.sender === "bot" ? "🤖" : "👤"} {msg.text && msg.text.split("\n").map((line, i) => <p key={i}>{line}</p>)} {msg.imageUrl && (
                        <div className="chat-image">
                            <img src={msg.imageUrl} alt="업로드 이미지" />
                        </div>
                    )}
                    </div>
                ))}
                {isTyping && (
                    <div className="bot-message">🤖 <p>입력 중...</p></div>
                )}
            </div>

            {searchQuery ? (
                <div className="button-options">
                    <button onClick={() => navigate(`/results?query=${encodeURIComponent(searchQuery)}`)}>
                        🔍 검색 결과 보기
                    </button>
                    <button
                        onClick={() => {
                            setSearchQuery(null);
                            setMessages([
                                {
                                    sender: "bot",
                                    text: `안녕하세요! 😊 저는 FixBot입니다.\n` +
                                        `고객님께서 입력하신 정보를 확인할게요!\n` +
                                        `브랜드: ${brand} | 카테고리: ${category} | 세부 카테고리: ${subcategory}\n` +
                                        `질문: ${question}\n` +
                                        `🔍 맞다면 아래 창에 대답해주세요!`
                                }
                            ]);
                        }}
                    >
                        💬 다시 물어보기
                    </button>
                </div>
            ) : (
                <div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={input}
                            maxLength={1000}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length > 1000) {
                                    alert("❗입력은 최대 1000자까지 가능합니다.");
                                    return;
                                }
                                setInput(value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isTyping) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="문제에 대해 더 자세히 설명해주세요..."
                        />
                        <button onClick={sendMessage} disabled={isTyping}>
                            {isTyping ? "⌛ 처리 중..." : "📩 전송"}
                        </button>
                    </div>

                    <div className="image-upload-area">
                        <label className="upload-button">
                            📎 이미지 첨부
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>
                        {imagePreviewUrl && (
                            <div className="image-preview">
                                <img src={imagePreviewUrl} alt="미리보기" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBot;

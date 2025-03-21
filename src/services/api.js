export async function sendMessageToOpenAI(message, brand, category, question) {
    try {
        const response = await fetch("http://localhost:8080/chat/ai-response", { // ✅ /chat/ai-response로 요청
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                brand,
                category,
                question
            })
        });

        if (!response.ok) {
            throw new Error("⚠️ 서버 응답 오류");
        }

        const data = await response.json();
        return data.answer || "⚠️ AI 응답을 가져올 수 없습니다.";
    } catch (error) {
        console.error("🔴 OpenAI API 호출 오류:", error);
        return "⚠️ AI 서비스 오류 발생. 다시 시도해주세요.";
    }
}

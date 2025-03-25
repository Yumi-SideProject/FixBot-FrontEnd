export async function sendMessageToOpenAI(message, brand, category, subcategory, question, imageUrl) {
    try {
        const response = await fetch("http://localhost:8080/chat/ai-response", { // ✅ /chat/ai-response로 요청
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                brand,
                category,
                subcategory,
                question,
                imageUrl
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

// 🌐 Google API → 백엔드 연결
export async function fetchGoogleResults(query) {
    try {
        console.log("📤 Google 검색 요청:", query);

        const response = await fetch(`http://localhost:8080/search/google?query=${encodeURIComponent(query)}`);

        console.log("📥 Google 응답 상태:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ 구글 API 실패:", errorText);
            throw new Error("구글 검색 실패");
        }

        const data = await response.json();
        console.log("✅ 구글 응답 데이터:", data);
        return data;
    } catch (error) {
        console.error("🔴 구글 API 호출 오류:", error);
        return [];
    }
}

// 📺 YouTube API → 백엔드 연결
export async function fetchYoutubeResults(query) {
    try {
        console.log("📤 YouTube 검색 요청:", query);

        const response = await fetch(`http://localhost:8080/search/youtube?query=${encodeURIComponent(query)}`);

        console.log("📥 YouTube 응답 상태:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ 유튜브 API 실패:", errorText);
            throw new Error("유튜브 검색 실패");
        }

        const data = await response.json();
        console.log("✅ 유튜브 응답 데이터:", data);
        return data;
    } catch (error) {
        console.error("🔴 유튜브 API 호출 오류:", error);
        return [];
    }
}
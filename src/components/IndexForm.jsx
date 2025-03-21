import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

function IndexForm() {
    const navigate = useNavigate();
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [question, setQuestion] = useState("");

    // 🔹 페이지가 로드될 때 스크롤 최상단으로 이동
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100); // 0.1초 후 실행
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!brand || !category) {
            alert("⚠ 브랜드와 카테고리를 선택해주세요!");
            return;
        }

        if (!question.trim()) {
            alert("⚠ 질문을 입력해주세요!");
            return;
        }

        navigate(`/chat?brand=${encodeURIComponent(brand)}&category=${encodeURIComponent(category)}&question=${encodeURIComponent(question)}`);
    };

    return (
        <div className="container">
            {/* FixBot 로고 및 설명 */}
            <div className="header">
                <img src="/fixbot-logo.png" alt="FixBot 로고" className="logo" />
                <h1>FixBot 고객 지원센터</h1>
                <p>가전제품 문제를 해결해드립니다! 브랜드 및 제품을 선택하고 궁금한 점을 입력하세요.</p>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>🏷 제품 브랜드 선택</label>
                    <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                        <option value="">-- 브랜드 선택 --</option>
                        <option value="삼성">삼성</option>
                        <option value="LG">LG</option>
                        <option value="대우">대우</option>
                        <option value="소니">소니</option>
                        <option value="애플">애플</option>
                        <option value="샤오미">샤오미</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>📌 제품 카테고리 선택</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">-- 카테고리 선택 --</option>
                        <option value="냉장고">냉장고</option>
                        <option value="세탁기">세탁기</option>
                        <option value="스마트폰">스마트폰</option>
                        <option value="에어컨">에어컨</option>
                        <option value="PC">PC</option>
                        <option value="TV">TV</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>❓ 궁금한 점 입력</label>
                    <textarea placeholder="예: 냉장고가 갑자기 차가워지지 않아요. 원인이 뭘까요?"
                              value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
                </div>

                <button type="submit" className="submit-button">🔍 원인을 찾아보자!</button>
            </form>
        </div>
    );
}

export default IndexForm;
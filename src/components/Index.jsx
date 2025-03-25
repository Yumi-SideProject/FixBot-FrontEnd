import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoryData } from "../data/categoryData"; // 경로는 프로젝트에 맞게 조정
import "../styles/index.css";
import fixbotLogo from '../styles/assets/fixbot-logo.png';

function Index() {
    const navigate = useNavigate();
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [question, setQuestion] = useState("");

    const categories = brand ? Object.keys(categoryData[brand] || {}) : [];
    const subcategories = brand && category ? categoryData[brand][category] || [] : [];

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!brand || !category || !subcategory) {
            alert("⚠ 브랜드, 카테고리, 세부 카테고리를 모두 선택해주세요!");
            return;
        }

        if (!question.trim()) {
            alert("⚠ 문제 설명을 입력해주세요!");
            return;
        }

        navigate(`/chat?brand=${encodeURIComponent(brand)}&category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}&question=${encodeURIComponent(question)}`);
    };

    return (
        <div className="fixbot-wrapper">
            <div className="fixbot-card">
                <img src={fixbotLogo} alt="FixBot 로고" className="fixbot-logo" />
                <h1>FixBot</h1>
                <p className="subtitle">당신의 가전제품 수리 도우미</p>

                <div className="steps">
                    <div className="step active">❓어떤 문제인가요?</div>
                    <div className="step">🔎양질의 정보를 찾아요</div>
                    <div className="step">🤖AI가 해결해드릴게요</div>
                </div>

                <form onSubmit={handleSubmit} className="fixbot-form">
                    <label>브랜드 선택</label>
                    <select value={brand} onChange={(e) => {
                        setBrand(e.target.value);
                        setCategory("");
                        setSubcategory("");
                    }}>
                        <option value="">브랜드를 선택하세요</option>
                        {Object.keys(categoryData).map((brandOption) => (
                            <option key={brandOption} value={brandOption}>{brandOption}</option>
                        ))}
                    </select>

                    <label>카테고리 선택</label>
                    <select value={category} onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                    }} disabled={!brand}>
                        <option value="">카테고리를 선택하세요</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>세부 카테고리 선택</label>
                    <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} disabled={!category}>
                        <option value="">세부 카테고리를 선택하세요</option>
                        {subcategories.map((subcat) => (
                            <option key={subcat} value={subcat}>{subcat}</option>
                        ))}
                    </select>

                    <label>문제 설명</label>
                    <textarea
                        placeholder="어떤 문제가 있으신가요? 자세히 설명해 주세요."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>

                    <button type="submit">다음 단계로 ➜</button>
                </form>

                <div className="fixbot-footer">
                    고객센터: 1588-0000 (평일 09:00-18:00)<br />
                    이메일: support@fixbot.kr
                </div>
            </div>
        </div>
    );
}

export default Index;

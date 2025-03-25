import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchGoogleResults, fetchYoutubeResults } from "../services/api";
import "../styles/results.css";

function Results() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const [googleResults, setGoogleResults] = useState([]);
    const [youtubeResults, setYoutubeResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            if (!query) return;

            setLoading(true);
            const gg = await fetchGoogleResults(query);
            const yt = await fetchYoutubeResults(query);
            setGoogleResults(gg.slice(0, 10)); // ✅ 구글 최대 10개
            setYoutubeResults(yt.slice(0, 6)); // ✅ 유튜브 최대 6개
            setLoading(false);
        }

        fetchResults();
    }, [query]);

    return (
        <>
            <div className="results-wrapper">
                <div className="results-card">
                    <div className="back-button-wrapper">
                        <button className="back-button" onClick={handleBack}>🔙 뒤로 가기</button>
                    </div>

                    <h2>🔍 검색 결과: "{query}"</h2>

                {loading ? (
                    <p>로딩 중...</p>
                ) : (
                    <>
                        <section>
                            <h3>🌐 구글 검색</h3>
                            <div className="google-list">
                                {googleResults.map((item, idx) => (
                                    <div key={idx} className="google-item">
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            <strong>{item.title}</strong>
                                        </a>
                                        <p>{item.snippet}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="more-link">
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    🔗 더 많은 구글 검색 보기
                                </a>
                            </div>
                        </section>
                        <section>
                            <h3>📺 유튜브 영상</h3>
                            <div className="youtube-grid">
                                {youtubeResults.map((item, idx) => (
                                    <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="video-item">
                                        <img src={item.thumbnail} alt="썸네일" />
                                        <p>{item.title}</p>
                                    </a>
                                ))}
                            </div>
                            <div className="more-link">
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    🔗 더 많은 유튜브 결과 보기
                                </a>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    </>
    );
}

export default Results;

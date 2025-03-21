import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexForm from "./components/IndexForm";
import ChatBot from "./components/ChatBot";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IndexForm />} />
                <Route path="/chat" element={<ChatBot />} />
            </Routes>
        </Router>
    );
}

export default App;

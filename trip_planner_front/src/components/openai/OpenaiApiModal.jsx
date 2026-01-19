/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import * as s from "./styles";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css";
import { HashLoader } from "react-spinners";
import { MdUpload } from "react-icons/md";
import { sendTextOpenai } from "./openapiApi";

function TypingEffect({text, speed = 30}){
    const [displayText, setDisplayText] = useState("");
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayText("");
        indexRef.current = 0;
        const chars = Array.from(text || "");
        const timer = setInterval(() => {
            if(indexRef.current < chars.length){
                setDisplayText((prev) => prev + chars[indexRef.current++]);
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {displayText}
        </ReactMarkdown>
    );
}

function OpenaiApiModal() {
    const [inputValue, setInputValue] = useState("");
    const [chatData, setChatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatData, isLoading]);

    // 1. prompt 대신 buildPrompt로 이름 변경 (기본 함수와 충돌 방지)
    const buildPrompt = (message, max = 8) => {
        const t = message.slice(-max);
        const history = t
            .map((m) => `${m.type === "question" ? "사용자" : "제주 여행지 상담사"}: ${m.content}`)
            .join("\n");

        return [
            "당신은 제주도의 구석구석을 잘 아는 '제주 여행지 추천 전문가'입니다.",
            "사용자에게 뻔한 동선 위주의 일정보다는, 사용자의 취향에 딱 맞는 매력적인 여행지, 맛집, 카페를 테마별로 추천해 주는 데 집중하세요.",
            "추천할 때는 해당 장소가 왜 좋은지, 어떤 사람에게 어울리는지 이유를 상세하고 친절하게 설명해 주세요.",
            "답변은 항상 한국어로 작성하고, 마치 친한 친구에게 보물 같은 장소를 알려주듯 다정하게 답변해 주세요.",
            "",
            history, // 2. historyText에서 history로 변수명 일치시킴
            "제주 여행지 상담사:"
        ].join("\n");
    };

    const handleSend = () => {
        if (!inputValue.trim() || isLoading) return;
        const question = inputValue;
        setChatData((prev) => [
            ...prev,
            { type: "question", content: question },
        ]);
        setInputValue("");
        setIsLoading(true);
    };

    useEffect(() => {
        const last = chatData[chatData.length - 1];
        if (!last || last.type !== "question") return;

        // 3. buildPrompt 호출 및 인자 전달
        const p = buildPrompt(chatData, 10);
        
        sendTextOpenai(p).then((r) => {
            // 4. API 응답 구조에 맞춰 데이터 추출 (보통 r.choices[0].message.content)
            // 만약 이전 답변 형식을 유지하신다면 r.output_text 그대로 사용
            const aiResponse = r.choices ? r.choices[0].message.content : r.output_text;
            
            setChatData((prev) => [
                ...prev,
                {
                    type: "answer",
                    content: aiResponse ?? "",
                },
            ]);
        }).catch((error) => {
            console.error("open ai error", error);
            setChatData((prev) => [
                ...prev,
                { type: "answer", content: "⚠️ 답변을 가져오는 중 오류가 발생했습니다." },
            ]);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [chatData]);

    const handleKeyDown = (e) => {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div css={s.layout}>
            <div css={s.chatContainer}>
                {chatData.map((data, index) => {
                    if (data.type === "question") {
                        return (
                            <div key={index} css={s.question}>{data.content}</div>
                        );
                    }
                    // 마지막 답변만 타이핑 효과 적용
                    if (index === chatData.length - 1 && data.type === "answer") {
                        return (
                            <div key={index} css={s.answer}>
                                {!isLoading && data.content && (
                                    <TypingEffect text={data.content} speed={15} />
                                )}
                            </div>
                        );
                    }
                    return (
                        <div key={index} css={s.answer}>
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {data.content}
                            </ReactMarkdown>
                        </div>
                    );
                })}
                {isLoading && (
                    <div style={{ margin: "10px auto" }}>
                        <HashLoader size={30} color="#ff4d4d" />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            
            <div css={s.inputContainer}>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="제주도 여행지에 대해 물어보세요!"
                />
                <button type="button" disabled={isLoading} onClick={handleSend}>
                    <MdUpload />
                </button>
            </div>
        </div>
    );
}

export default OpenaiApiModal;
/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import * as s from "./styles";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css";
import { HashLoader } from "react-spinners";
import spotsData from "../../data/jeju_spot.json";
import { sendTextOpenai } from "./openapiApi";
import { BsFillSendFill } from "react-icons/bs";

function TypingEffect({text, speed = 30}){
    const [displayText, setDisplayText] = useState("");// 화면에 보여줄 타이핑 된 문자열
    const indexRef = useRef(0); //렌더링 바뀌어도 값 유지 , 몇번째 글자까지 썼는지 기억하는것

    useEffect(() => {
        setDisplayText(""); // 빈 문자열로 초기화
        indexRef.current = 0;//인덱스 0으로 초기화 => 이젠 타이핑 리셋
        const chars = Array.from(text || ""); // 문자열을 한 글자씩 쪼갬  
        const timer = setInterval(() => {
            if(indexRef.current < chars.length){
                setDisplayText((prev) => prev + chars[indexRef.current++]);
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]); // 텍스트가 바뀌면 실행

    return (
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {displayText}
        </ReactMarkdown>
    );
}

function OpenaiApiModal() {
    const [inputValue, setInputValue] = useState(""); // 입력하고 있는 값
    const [chatData, setChatData] = useState([]); // 채팅한 기록을 담는 배열
    const [isLoading, setIsLoading] = useState(false); 
    const chatEndRef = useRef(null);// 채팅을 맨 아래로 내리는 상태값

    const getContextData=(question)=>{
        let filtered = [];
       if (question.includes("맛집") || question.includes("식당") || question.includes("먹을")) {
            filtered = spotsData.filter(s => s.category === "식당");
        } else if (question.includes("체험") || question.includes("체험") || question.includes("박물관")) {
            filtered = spotsData.filter(s => s.category === "문화•체험");
        
        }else if (question.includes("카페") || question.includes("커피") || question.includes("디저트") || question.includes("차")) {
            filtered = spotsData.filter(s => s.category === "카페");
    } 
        else if (question.includes("바다") || question.includes("오름") || question.includes("풍경") || question.includes("자연")) {
            filtered = spotsData.filter(s => s.category === "자연");
        } else {
            // 키워드가 없으면 전체에서 랜덤하게 혹은 상위 10개
            filtered = spotsData;
        }

        // 최대 10개만 추출 (토큰 절약 및 정확도 향상)
        return filtered.slice(0, 10).map(s => ({ // 걸러진 여행지를 10개씩 가져옴
            name: s.title,
            addr: s.address,
            desc: s.description,
            price: s.price
        }));
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatData, isLoading]);
  

const buildPrompt = (message, context) => {
        const lastQuestion = message[message.length - 1].content;
        
        return [
            "당신은 제주도 여행 전문가입니다.",
            "사용자의 질문에 대해 아래 [참고 데이터]에 있는 장소들을 우선적으로 활용해서 추천해 주세요.",
            "데이터에 없는 장소라도 제주도 전문가로서 추가 제안은 가능하지만, 데이터 내 장소는 상세히 설명해 주세요.",
            "말투는 민아 님에게 이야기하듯 아주 다정하고 친근하게 하세요.",
            "",
            "### [참고 데이터] ###",
            JSON.stringify(context, null, 2),
            "",
            "### [사용자 질문] ###",
            lastQuestion,
            "",
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

        // 🌟 중요: 질문(last.content)을 기반으로 컨텍스트를 먼저 가져와야 합니다!
        const context = getContextData(last.content); 
        
        // buildPrompt에 숫자 10이 아니라 실제 context 배열을 넘겨줍니다.
        const p = buildPrompt(chatData, context); 
        
        sendTextOpenai(p).then((r) => {
            const aiResponse = r.choices ? r.choices[0].message.content : r.output_text;
            
            setChatData((prev) => [
                ...prev,
                { type: "answer", content: aiResponse ?? "" },
            ]);
        }).catch((error) => {
            console.error("open ai error", error);
            setChatData((prev) => [
                ...prev,
                { type: "answer", content: "답변을 가져오는 중 오류가 발생했습니다." },
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
                    <BsFillSendFill />
                </button>
            </div>
        </div>
    );
}

export default OpenaiApiModal;
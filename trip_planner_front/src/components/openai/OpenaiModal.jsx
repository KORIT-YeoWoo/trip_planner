/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import OpenaiApiModal from "./OpenaiApiModal";
import * as s from "./styles";

function OpenaiModal({ open, onClose }) {
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div css={s.aiChatLayout(open)} onClick={onClose}>
          
            <div 
                css={s.aiChatContainer} 
                onClick={(e) => e.stopPropagation()} 
            >
                
                <div css={s.chatTopbar}>
                    <div css={s.topelement}>
                        <span style={{ fontSize: '20px' }}>🦊</span>
                        <span css={s.chatTitle}>여우 AI 가이드</span>
                    </div>
                    
                    <button css={s.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

         
                <OpenaiApiModal />

            </div>
        </div>
    );
}

export default OpenaiModal;
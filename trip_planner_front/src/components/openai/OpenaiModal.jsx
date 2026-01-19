/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import OpenaiApiModal from "./OpenaiApiModal";
import * as s from "./styles";
function OpenaiModal({open,onClose}) {
    useEffect(()=>{
        if(!open) return;
        const handleEsc = (e)=> e.key ==="Escape" && onClose();
        document.addEventListener("keydown",handleEsc);
        return ()=> document.removeEventListener("keydown",handleEsc);
    },[open,onClose]);

    if(!open) return null;

    return( 
    <div css={s.aiChatLayout(open)} onClick={onClose}>
            {/* ✅ 실제 모달창: 클릭해도 닫히지 않도록 e.stopPropagation() 추가 */}
            <div 
                css={s.aiChatContainer} 
                onClick={(e) => e.stopPropagation()} 
                style={{ position: 'relative' }} // 닫기 버튼 배치를 위해 추가
            >
                <OpenaiApiModal />
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '15px', 
                        right: '15px', 
                        cursor: 'pointer',
                        zIndex: 10001 // 챗봇 내용보다 위에
                    }}
                >
                    닫기
                </button>
            </div>
        </div> );
}

export default OpenaiModal;
/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import { FiX, FiStar } from "react-icons/fi";
import * as s from "./styles";

function SpotDetailModal({ isOpen, spot, onClose, children }) {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const title = spot?.title ?? spot?.name ?? "관광지";
    const rawImageUrl = spot?.spotImg ?? spot?.mainImage ?? spot?.firstImage ?? spot?.imageUrl ?? "";
    const imageUrl = rawImageUrl
        ? rawImageUrl.startsWith("http")
            ? rawImageUrl
            : `${baseURL}${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`
            : "";
    const description = spot?.description ?? spot?.overview ?? "설명이 아직 없어요.";
    const avgRating = Number(spot?.avgRating ?? spot?.ratingAvg ?? 0);
    const ratingText = `${avgRating.toFixed(1)}/0`;
    const tags = spot?.tags ?? spot?.tagList ?? [];

    const handleOverlayClick = () => onClose?.();
    const handleModalClick = (e) => e.stopPropagation();

    return (
        <div css={s.overlay} onClick={handleOverlayClick} role="presentation">
            <div css={s.modal} onClick={handleModalClick} role="dialog" aria-modal="true">
                {/* LEFT: 이미지 */}
                <div css={s.left}>
                    {imageUrl ? (
                        <img css={s.image} src={imageUrl} alt={title} />
                    ) : (
                        <div css={s.imagePlaceholder}>이미지가 없어요</div>
                    )}
                </div>

                {/* RIGHT: 정보 + (children 슬롯) */}
                <div css={s.right}>
                    <div css={s.topRow}>
                        <div css={s.titleBlock}>
                            <div css={s.title}>{title}</div>
                            <div css={s.ratingRow}>
                                <FiStar size={18} />
                                <span css={s.ratingText}>{ratingText}</span>
                            </div>
                        </div>

                        <button css={s.closeBtn} onClick={onClose} aria-label="닫기">
                            <FiX size={18} />
                        </button>
                    </div>

                    <div css={s.tagRow}>
                        {tags?.length ? tags.map((t) => <span css={s.tag} key={t}>{t}</span>) : null}
                    </div>

                    <div css={s.desc}>{description}</div>

                    {/* ✅ 여기부터 댓글/추가기능을 “외부에서 끼우는 영역” */}
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SpotDetailModal;
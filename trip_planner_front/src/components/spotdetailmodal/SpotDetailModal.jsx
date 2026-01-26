/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import * as s from "./styles";
import { IoSend } from "react-icons/io5";

function SpotDetailModal({ isOpen, spot, onClose, children, isLoading = false, onSubmitReview }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(""); 
    

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

    useEffect(() => {
        if (!isOpen) return;
        setRating(0);
        setHoverRating(0);
        setComment("");
    }, [isOpen, spot?.spotId]);

    if (!isOpen) return null;

    const previewValue = hoverRating > 0 ? hoverRating : rating;

    const title = spot?.title ?? spot?.name ?? "관광지";
    const rawImageUrl =
        spot?.spotImg ?? spot?.mainImage ?? spot?.firstImage ?? spot?.imageUrl ?? "";

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    const imageUrl = rawImageUrl
        ? rawImageUrl.startsWith("http")
        ? rawImageUrl
        : `${API_BASE}${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`
        : "";

    const description = spot?.description ?? spot?.overview ?? "";
    const hasDescription = typeof description === "string" ? description.trim().length > 0 : !!description;
    const avgRating = Number(spot?.avgRating ?? spot?.ratingAvg ?? 0);
    const ratingText = `${avgRating.toFixed(1)}/0`;
    const tags = spot?.tags ?? spot?.tagList ?? [];

    const handleOverlayClick = () => onClose?.();
    const handleModalClick = (e) => e.stopPropagation();

    const canSubmit = rating > 0 || comment.trim().length > 0;

    const submitReview = async () => {
        if (!canSubmit) return;

        const payload = {
        spotId: spot?.spotId ?? spot?.id,
        rating,
        content: comment.trim(),
        };

        try {
        if (onSubmitReview) {
            await onSubmitReview(payload);
        } else {
            console.log("review payload:", payload);
        }
        setRating(0);
        setComment("");
        } catch (e) {
        console.error(e);
        alert("리뷰 등록 중 문제가 발생했어요.");
        }
    };

    const onCommentKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitReview();
        }
    };

    return (
        <div css={s.overlay} onClick={handleOverlayClick} role="presentation">
        <div css={s.modal} onClick={handleModalClick} role="dialog" aria-modal="true">
            {/* LEFT */}
            <div css={s.left}>
            {imageUrl ? (
                <img css={s.image} src={imageUrl} alt={title} />
            ) : (
                <div css={s.imagePlaceholder}>이미지가 없어요</div>
            )}
            </div>

            {/* RIGHT */}
            <div css={s.right}>
            <div css={s.topRow}>
                <div css={s.titleBlock}>
                <div css={s.title}>{title}</div>
                <div css={s.ratingRow}>
                    <FaStar size={16} />
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

            <div css={s.desc}>
                {isLoading ? "설명 불러오는 중..." : hasDescription ? description : "설명이 아직 없어요."}
            </div>

            {/* 기존 슬롯 유지 */}
            {children}
            <div css={s.reviewSection}>
                <div
                    css={s.starInputRow}
                    aria-label="별점 선택"
                    onMouseLeave={() => setHoverRating(0)} // ✅ 별 영역 벗어나면 프리뷰 해제
                >
                    {[1, 2, 3, 4, 5].map((n) => {
                        const active = previewValue >= n; // ✅ 프리뷰 기준으로 채우기
                        const Icon = active ? FaStar : FaRegStar;

                        return (
                            <button
                                key={n}
                                type="button"
                                css={s.starBtn(active)}
                                onMouseEnter={() => setHoverRating(n)} // ✅ 호버 프리뷰
                                onFocus={() => setHoverRating(n)}      // ✅ 키보드 접근성
                                onBlur={() => setHoverRating(0)}
                                onClick={() => {
                                setRating((prev) => (prev === n ? 0 : n));
                                setHoverRating(0);
                                }}
                                aria-label={`${n}점`}
                            >
                                <Icon size={30} />
                            </button>
                        );
                    })}
                </div>

                    <div css={s.commentBar}>
                        <textarea
                            css={s.commentInput}
                            placeholder="리뷰를 작성해보세요."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={onCommentKeyDown}
                            rows={1}
                        />
                            <button
                                type="button"   
                                css={s.sendBtn(canSubmit)}
                                onClick={submitReview}
                                aria-label="댓글 전송"
                            >
                                <IoSend size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default SpotDetailModal;
function ScheduleItemCard({ item, onDurationChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newDuration, setNewDuration] = useState(item.duration);

    return <div>
        <div>
            <h3>{item.name}</h3>
            <span>{item.arrivalTime} - {item.departureTime}</span>
            <span>({item.duration}분)</span>
        </div>

        {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
            편집
            </button>
        ) : (
            <div>
            <input
                type="range"
                min="0"
                max="240"
                step="1"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
            />
            <span>{newDuration}분</span>
            <button onClick={() => onDurationChange(item.itemId, newDuration)}>
                저장
            </button>
            <button onClick={() => setIsEditing(false)}>
                취소
            </button>
            </div>
        )}

        {item.duration !== item.originalDuration && (
            <div>
            기본 {item.originalDuration}분 → {item.duration}분
            </div>
        )}
    </div>
}

export default ScheduleItemCard;
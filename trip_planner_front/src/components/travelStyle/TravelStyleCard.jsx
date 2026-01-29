/** @jsxImportSource @emotion/react */
import * as s from './styles';

// 타입별 이미지 매핑
const typeImages = {
    INFLUENCER: '/images/styles/influencer.png',
    FOODIE: '/images/styles/foodie.png',
    EXPLORER: '/images/styles/explorer.png',
    DRIVER: '/images/styles/driver.png',
    FLEX: '/images/styles/flex.png',
    VACATION: '/images/styles/vacation.png',
    COST_EFFECTIVE: '/images/styles/cost-effective.png',
    HEALING: '/images/styles/healing.png',
    BALANCE: '/images/styles/balance.png'
};

function TravelStyleCard({ type, typeName, description }) {
    return (
        <div css={s.styleCard}>
            <div css={s.characterSection}>
                <img 
                    src={typeImages[type] || '/images/styles/default.png'} 
                    alt={typeName}
                    css={s.characterImage}
                />
            </div>

            <div css={s.infoSection}>
                <h2 css={s.typeName}>{typeName}</h2>
                <p css={s.typeDescription}>{description}</p>
            </div>
        </div>
    );
}

export default TravelStyleCard;
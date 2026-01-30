/** @jsxImportSource @emotion/react */
import * as s from './styles';

import influencerImg from '../../assets/influencer.png';
import foodieImg from '../../assets/foodie.png';
import explorerImg from '../../assets/explorer.png';
import driverImg from '../../assets/driver.png';
import flexImg from '../../assets/flex.png';
import vacationImg from '../../assets/vacation.png';
import costEffectiveImg from '../../assets/cost-effective.png';
import healingImg from '../../assets/healing.png';
import balanceImg from '../../assets/balance.png';

const typeImages = {
    INFLUENCER: influencerImg,
    FOODIE: foodieImg,
    EXPLORER: explorerImg,
    DRIVER: driverImg,
    FLEX: flexImg,
    VACATION: vacationImg,
    COST_EFFECTIVE: costEffectiveImg,
    HEALING: healingImg,
    BALANCE: balanceImg
};

function TravelStyleCard({ type, typeName, description }) {
    return (
        <div css={s.leftCard}>
            <div css={s.characterCircle}>
                <img 
                    src={typeImages[type] || driverImg} 
                    alt={typeName}
                    css={s.characterImg}
                />
            </div>
            <h2 css={s.cardTypeName}>{typeName}</h2>
            <p css={s.cardDescription}>{description}</p>
        </div>
    );
}

export default TravelStyleCard;
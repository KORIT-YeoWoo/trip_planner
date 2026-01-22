/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import instance from "../../configs/axios";
import { HiOutlineLocationMarker, HiOutlineHeart } from "react-icons/hi";
import { MdOutlineGridView, MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function MyPageCategory() {
    const navigate = useNavigate();

    const [user,setUser]=useState({
        name:"민아",
        email:"mina@mina.com"
    });

    // useEffect(()=>{
    //     const getUserData = async()=>{
    //         try{
    //             const resp = await instance.get("/api/users/me");
    //             console.log("받아온 유저 데이터:", resp);
    //             if(resp){
    //                 setUser(resp);
    //             }
    //         }catch(error){
    //             console.log("사용자 목록을 불러오는데 문제가 생겼습니다.");
    //         }
            
    //     };
    //     getUserData();
    // },[]);

//나중에 로그인 다 구현되면 작동될 예정 comming soon!
    
    
    return (<div css={s.container}>
        <div css={s.hi}>
            <h2>{user.name}님의 마이페이지</h2>
        </div>
        <div css={s.booking}><HiOutlineLocationMarker />저장된 일정</div>
        <div css={s.favorite} onClick={()=> {navigate("/favorites"); console.log("이동 버튼 클릭됨!");}}><HiOutlineHeart />관심 여행지</div>
        <div css={s.myTripStyle}><MdOutlineGridView />내 여행 스타일은?</div>
        <div css={s.logout}><MdOutlineLogout />로그아웃</div>
        
    </div>);
}

export default MyPageCategory;
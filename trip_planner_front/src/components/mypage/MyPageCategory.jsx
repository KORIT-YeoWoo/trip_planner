/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import instance from "../../configs/axios";


function MyPageCategory() {

    const [user,setUser]=useState({
        name:"",
        email:""
    });

    useEffect(()=>{
        const getUserData = async()=>{
            try{
                const resp = await instance.get("/api/users/me");
                console.log("받아온 유저 데이터:", resp);
                if(resp){
                    setUser(resp);
                }
            }catch(error){
                console.log("사용자 목록을 불러오는데 문제가 생겼습니다.");
            }
            
        };
        getUserData();
    },[]);

    
    
    return (<div css={s.container}>
        <div></div>
        <div>저장된 일정</div>
        <div>관심 여행지</div>
        <div>내 여행 스타일</div>
        <div>로그아웃</div>
        
    </div>);
}

export default MyPageCategory;
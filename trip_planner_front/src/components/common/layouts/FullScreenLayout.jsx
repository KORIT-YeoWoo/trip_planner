/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import Header from "../header/Header";
import { Outlet } from "react-router-dom";

function FullScreenLayout(){
    return <div css={s.layout}>
      <Header />
      <div css={s.main}>
        <Outlet />
      </div>
    </div>
}

export default FullScreenLayout;
/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

function MainLayout(){
    return <div css={s.layout}>
      <Header />
      <div css={s.main}>
        <Outlet />
      </div>
      <Footer />
    </div>
}

export default MainLayout;
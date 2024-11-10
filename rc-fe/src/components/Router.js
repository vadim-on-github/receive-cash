import {BrowserRouter, Route, Routes, useNavigate, useParams} from "react-router-dom";
import React from "react";
import App from "./App";

function AppWrapper(props) {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <App params={params} navigate={navigate} body={props.body}/>
  );
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path={"/"}
               element={<AppWrapper body='home'/>}/>
        <Route path={"/:pageSlug"}
               element={<AppWrapper body='cryptos'/>}/>
        <Route path={"/:pageSlug/:cryptoSymbol"}
               element={<AppWrapper body='cryptos'/>}/>
        <Route path={"/user/pages"}
               element={<AppWrapper body='userPages'/>}/>
        <Route path={"/privacy"}
               element={<AppWrapper body='privacy'/>}/>
        <Route path={"/about"}
               element={<AppWrapper body='about'/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Router

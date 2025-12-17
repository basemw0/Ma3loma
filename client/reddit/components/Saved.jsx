import React from "react";

import "./content/Content.css";
import MainBar from "./content/main-bar/MainBar";

export default function Saved() {
  return (
    <div className="content">
      <div className="bars-wrapper">
        <div className="bars-wrapper-inside">
          <MainBar search = "" saved ={true} />
        </div>
      </div>
    </div>
  );
}
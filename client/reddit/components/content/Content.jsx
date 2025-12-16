import React from "react";

import "./Content.css";
import MainBar from "./main-bar/MainBar";

export default function Content({search}) {
  return (
    <div className="content">
      <div className="bars-wrapper">
        <div className="bars-wrapper-inside">
          <MainBar />
        </div>
      </div>
    </div>
  );
}
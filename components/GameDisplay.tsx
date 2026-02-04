"use client";
import React from "react";
import { gameDataRender } from "../lib/definitions";

const GameDisplay: React.FC<{
  currentData: gameDataRender;
  image?: string;
}> = ({ currentData, image = "" }) => {
  return (
    <>
      {!currentData.assets.image && (
        <img src={image} className="absolute w-60 h-61 -bottom-2" alt="" />
      )}

      <span
        className={`font-sans text-4xl font-medium text-black z-99 mb-14 ${currentData.is_aho ? "!font-['Gloria_Hallelujah'] !text-red-700" : ""}`}
      >
        {currentData.assets.text || currentData.value}
      </span>
      {currentData.assets.image && (
        <img
          src={currentData.assets.image}
          className="absolute w-60 h-60 -bottom-2"
          alt=""
        />
      )}
      {currentData.assets.sound && (
        <audio
          src={currentData.assets.sound}
          key={currentData.value}
          autoPlay
        />
      )}
    </>
  );
};

export default GameDisplay;

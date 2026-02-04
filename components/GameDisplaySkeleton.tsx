import React from "react";

const GameDisplaySkeleton = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="z-20 mb-14 animate-pulse flex flex-col items-center">
        <div className="h-16 w-40 bg-gray-200 rounded-2xl shadow-sm"></div>
      </div>
      <div className="absolute w-60 h-60 -bottom-2 animate-pulse z-10">
        <div className="w-full h-full bg-gray-100 rounded-full border-[6px] border-white shadow-inner"></div>
      </div>
    </div>
  );
};

export default GameDisplaySkeleton;
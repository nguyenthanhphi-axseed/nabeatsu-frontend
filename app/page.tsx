"use client";
import React, { useEffect, useState, useRef } from "react";

import Button from "../components/Button";
import GameDisplay from "../components/GameDisplay";
import SettingsModal from "../components/SettingsModal";
import GameDisplaySkeleton from "../components/GameDisplaySkeleton";
import axios from "axios";
import { gameData, gameDataRender } from "../lib/definitions";
import { Profile } from "@/components/Profile";

export default function Home() {
  // States
  const [gameData, setGameData] = useState<gameData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // UI States
  const [showSettings, setShowSettings] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  // Fetch game data from backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchGameData = async () => {
    let max_retry = 5;
    setLoading(true);
    for (let i = 1; i <= max_retry; i++) {
      console.log("Fetch attempt:", i);
      try {
        const res = await axios.get(`${API_URL}/api/game-data`);
        setGameData(res.data);
        setCurrentIndex(0);
        setLoading(false);
        return;
      } catch (error) {
        if (i < max_retry) {
          console.log("Retrying to fetch game data... Attempt:", i + 1);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else console.error("Error fetching game data:", error);
      }
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const isFinished = gameData && currentIndex === gameData.sequence.length - 1;
  const targetNum = parseInt(jumpInput);
  const startNum = gameData?.config?.start || 0;
  const endNum = gameData?.config?.end || 0;
  const isValidJump =
    !isNaN(targetNum) &&
    jumpInput !== "" &&
    targetNum >= startNum &&
    targetNum <= endNum;

  const handleNext = () => {
    if (!gameData || isFinished) return;
    if (gameData && currentIndex < gameData.sequence.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!gameData || isFinished) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJump = () => {
    if (!gameData || isFinished) return;
    const startNum = gameData.config.start;
    const endNum = gameData.config.end;
    const targetNum = parseInt(jumpInput, 10);
    if (targetNum >= startNum && targetNum <= endNum) {
      const targetIndex = gameData.sequence.findIndex(
        (item: gameDataRender) => item.value == targetNum,
      );
      setJumpInput("");
      setCurrentIndex(targetIndex);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setJumpInput("");
  };

  const renderDisplayContent = () => {
    const currentData = gameData?.sequence[currentIndex];
    if (loading || !gameData) {
      return <GameDisplaySkeleton />;
    }
    if (currentData) {
      if (currentIndex == gameData.sequence.length - 1) {
        return <GameDisplay currentData={currentData} image="/nabeatu1.png" />;
      }
      if (currentData.is_aho) {
        return <GameDisplay currentData={currentData} image="/nabeatu3.png" />;
      }
      return <GameDisplay currentData={currentData} image="/nabeatu2.png" />;
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex flex-col items-center justify-center">
      {/* Main Game Container */}
      <div className="w-[95%] md:w-[800px] min-h-[65vh] md:h-[600px] opacity-90 bg-gray-100 border-2 border-gray-400 rounded-xl p-6 relative flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-red-500">Nabeatsu Game</h1>
          <Button
            label="設定"
            image="/settings-btn.png"
            className=""
            onClick={() => setShowSettings(true)}
            disabled={isFinished ? true : false}
          />
        </div>

        {/* Middle: Display Area */}
        <div className="bg-[url('/game-container-bg.jpg')] bg-cover bg-center relative flex-1 my-6 border-1 border-yellow-400 flex items-center justify-center">
          {renderDisplayContent()}
        </div>

        {/* --- BOTTOM CONTROLS (FIXED LAYOUT) --- */}
        <div className="flex items-center justify-between px-2 relative h-16">
          {/* Left: Empty Space (Flexible width) */}
          <div className="flex-1">
            {gameData && currentIndex == gameData.sequence.length - 1 && (
              <Button
                image="/restart-btn.png"
                className=""
                onClick={() => handleRestart()}
              />
            )}
          </div>

          {/* Center: Navigation Buttons */}
          <div className="flex gap-4 justify-center w-auto mx-4">
            <Button
              label="<"
              disabled={isFinished ? true : false}
              onClick={() => handlePrev()}
            />
            <Button
              label=">"
              disabled={isFinished ? true : false}
              onClick={() => handleNext()}
            />
          </div>

          {/* Right: Jump Section (Flexible width + End alignment) */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Label: Prevent text wrapping */}
            <span className="text-gray-700 font-medium whitespace-nowrap">
              No.指定:
            </span>

            {/* Input Box */}
            <input
              type="text"
              className="w-12 h-10 border border-gray-500 p-1 text-center bg-white"
              value={jumpInput}
              onChange={(e) => {
                if (!isFinished) setJumpInput(e.target.value);
              }}
              placeholder="No."
            />

            {/* Jump Button */}
            <button
              onClick={handleJump}
              disabled={!isValidJump}
              className={`px-3 py-1 h-10 border rounded shadow text-sm leading-tight whitespace-nowrap transition-colors
                ${
                  isValidJump
                    ? "bg-yellow-200 hover:bg-yellow-300 text-black border-gray-400 cursor-pointer"
                    : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                }
              `}
            >
              GO
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSaveSuccess={fetchGameData}
          currentConfig={gameData?.config}
        />
      )}
      <Profile />
    </div>
  );
}

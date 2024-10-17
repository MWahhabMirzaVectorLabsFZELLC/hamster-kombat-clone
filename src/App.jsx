import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

const App = () => {
  const levelNames = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Epic",
    "Legendary",
    "Master",
    "GrandMaster",
    "Lord"
  ];

  const levelMinPoints = [
    0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(0); // Set initial points to 0
  const [clicks, setClicks] = useState([]);
  const pointsToAdd = 10;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("00:00");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("00:00");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("00:00");

  // Define the durations in milliseconds
  const dailyRewardDuration = 24 * 60 * 60 * 1000; // 24 hours
  const dailyCipherDuration = 24 * 60 * 60 * 1000; // 72 hours
  const dailyComboDuration = 24 * 60 * 60 * 1000; // 48 hours

  const calculateTimeLeft = (duration) => {
    const now = new Date().getTime();
    const targetTime = now + duration; // Set target time for the next reward
    const diff = targetTime - now; // Calculate remaining time

    if (diff <= 0) {
      return "00:00"; // Time expired
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(dailyRewardDuration));
      setDailyCipherTimeLeft(calculateTimeLeft(dailyCipherDuration));
      setDailyComboTimeLeft(calculateTimeLeft(dailyComboDuration));
    };

    updateCountdowns(); // Initialize countdowns
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleCardClick = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd); // Increase points by clicking
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex]);

  const formatProfitPerHour = (profit) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  // Assuming profit per hour is calculated as points multiplied by some rate
  const profitPerHour = points * 10; // Example profit calculation

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025] shadow-lg"> {/* Add shadow here */}
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">Wahhab (CEO)</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Settings className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
              </div>
            </div>

            <div className="relative mt-12 mx-4" onClick={handleCardClick}>
              <div className="click-card max-w-[300px] mx-auto flex flex-col items-center justify-center rounded-full p-8 pb-6 overflow-hidden relative cursor-pointer z-10 ">
                <img src={mainCharacter} alt="Main Character" className="main-character z-20 relative" />
                <div className="bg-[#1d2025] w-full h-full absolute left-0 top-0 opacity-20 rounded-full"></div>
              </div>
              {clicks.map(click => (
                <div
                  key={click.id}
                  className="coin-fall absolute"
                  onAnimationEnd={() => handleAnimationEnd(click.id)}
                  style={{ left: `${click.x}px`, top: `${click.y}px` }}
                >
                  {/* <img src={hamsterCoin} alt="Hamster Coin" /> */}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-4 mt-6">
              <Mine className="w-[34px] h-[34px]" />
              <div className="flex items-center bg-[#272a2f] rounded-xl p-3 font-bold px-4 py-2 text-[14px]">
                <Coins className="w-[24px] h-[24px]" />
                <p className="text-white text-sm">{points}</p>
              </div>
              <Friends className="w-[34px] h-[34px]" />
              <Info className="w-[34px] h-[34px]" />
              <Settings className="w-[34px] h-[34px]" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
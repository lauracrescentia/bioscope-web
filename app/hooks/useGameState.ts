import { useEffect, useState } from "react";

export default function useGameState() {
  const [lives, setLives] = useState(10);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [powerUsed, setPowerUsed] = useState(0);
  const [showPower, setShowPower] = useState(false);

  // TIMER
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (started) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [started]);

  // POWER UP muncul saat nyawa 3
  useEffect(() => {
    if (lives === 3 && powerUsed < 2) {
      setShowPower(true);
    }
  }, [lives, powerUsed]);

  // KURANGI NYAWA
  const loseLife = () => {
    setLives((prev) => {
      if (prev <= 1) {
        resetGame();
        return 10;
      }
      return prev - 1;
    });
  };

  // POWER UP
  const usePower = () => {
    if (powerUsed < 2) {
      setLives((prev) => prev + 2);
      setPowerUsed((p) => p + 1);
      setShowPower(false);
    }
  };

  // RESET GAME
  const resetGame = () => {
    setLives(10);
    setTime(0);
    setStarted(false);
    setPowerUsed(0);
    setShowPower(false);
  };

  return {
    lives,
    time,
    started,
    setStarted,
    loseLife,
    usePower,
    showPower,
    resetGame,
  };
}
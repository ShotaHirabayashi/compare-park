"use client";

import { useState, useEffect } from "react";

interface MyCar {
  slug: string;
  name: string;
  makerName: string;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  weightKg?: number;
}

const STORAGE_KEY = "tomepita_my_car";

export function useMyCar() {
  const [myCar, setMyCar] = useState<MyCar | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMyCar(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse my car from storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存
  const saveMyCar = (car: MyCar) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(car));
    setMyCar(car);
  };

  // 削除
  const removeMyCar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMyCar(null);
  };

  return { myCar, isLoaded, saveMyCar, removeMyCar };
}

"use client";

import { useEffect, useState } from "react";
import "./heartLoading.css";
import { Target } from "lucide-react";

type HeartLoadingProps = {
  size?: "small" | "medium" | "large";
  inline?: boolean;
};

export default function HeartLoading({
  size = "small",
  inline = false,
}: HeartLoadingProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const iconSize = size === "small" ? 24 : size === "medium" ? 32 : 40;

  const content = (
    <>
      <div className="heart-spin">
        <Target className="heart-icon" size={iconSize} strokeWidth={2.5} />
      </div>
      <div className="loading-text">
        იტვირთება
        <span className="dots">{dots}</span>
      </div>
    </>
  );

  return inline ? (
    <span className={`heart-loading ${size} inline`}>{content}</span>
  ) : (
    <div className={`heart-loading ${size}`}>{content}</div>
  );
}

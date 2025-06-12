"use client";

import "./pattern.css";
import Image from "next/image";
import rect from "../../assets/Rectangle 11.png";
import { CSSProperties } from "react";

interface PatternProps {
  imageSize?: number;
  className?: string;
}

const Pattern = ({ 
  imageSize = 200,
  className = ""
}: PatternProps) => {
  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: -imageSize/2, // ნეგატიური offset ზევით
    left: -imageSize/2, // ნეგატიური offset მარცხნივ
    right: -imageSize/2, // დამატებითი დაფარვა მარჯვნივ
    bottom: -imageSize/2, // დამატებითი დაფარვა ქვევით
    overflow: 'hidden',
    zIndex: -1,
    pointerEvents: 'none',
  };

  const colors = [
    'default',
    'color-2E5730',
    'color-787039',
    'color-E1D798',
    'color-555D50'
  ];

  const cols = 20; // გავზარდეთ რაოდენობა
  const rows = 20; // გავზარდეთ რაოდენობა
  const totalPatterns = cols * rows;

  const patterns = Array.from({ length: totalPatterns }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    style: {
      position: 'absolute' as const,
      left: `${(i % cols) * (100 / cols)}%`,
      top: `${Math.floor(i / cols) * (100 / rows)}%`,
      width: `${imageSize}px`,
      height: `${imageSize}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
      zIndex: Math.floor(Math.random() * 10),
    } as CSSProperties
  }));

  return (
    <div style={containerStyle} className={className}>
      {patterns.map((pattern) => (
        <Image
          key={pattern.id}
          src={rect}
          width={imageSize}
          height={imageSize}
          className={`pattern-image ${pattern.color}`}
          alt="pattern"
          style={pattern.style}
        />
      ))}
    </div>
  );
};

export default Pattern;


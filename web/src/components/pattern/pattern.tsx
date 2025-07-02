"use client";

import "./pattern.css";
import Image from "next/image";
import rect from "../../assets/Rectangle 11.png";
import { CSSProperties, useEffect, useState } from "react";

interface PatternProps {
  imageSize?: number;
  className?: string;
}

// Pattern ერთეულის ინტერფეისი
interface PatternItem {
  id: number;
  color: string;
  style: CSSProperties;
}

// ეს ფუნქცია დეტერმინისტულად აბრუნებს "შემთხვევით" რიცხვებს seed-ის მიხედვით
const generatePseudoRandom = (seed: number): () => number => {
  return () => {
    // Simple xorshift algorithm
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return Math.abs(seed) / 2147483647;
  };
};

const Pattern = ({ 
  imageSize = 200,
  className = ""
}: PatternProps) => {
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  
  // ერთხელ შექმნის patterns ფრონტ-ზე გადასვლისას
  useEffect(() => {
    const cols = 20;
    const rows = 20;
    const totalPatterns = cols * rows;
    const colors = [
      'default',
      'color-2E5730',
      'color-787039',
      'color-E1D798',
      'color-555D50'
    ];

    // უცვლელი seed იქნება ყოველი რენდერის დროს
    const seedGenerator = generatePseudoRandom(42);

    const patternsData = Array.from({ length: totalPatterns }, (_, i) => {
      // დეტერმინისტული "შემთხვევითი" რიცხვები
      const rotation = seedGenerator() * 360; 
      const zValue = Math.floor(seedGenerator() * 10);
      
      return {
        id: i,
        color: colors[i % colors.length],
        style: {
          position: 'absolute' as const,
          left: `${(i % cols) * (100 / cols)}%`,
          top: `${Math.floor(i / cols) * (100 / rows)}%`,
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          transform: `rotate(${rotation}deg)`,
          zIndex: zValue,
        } as CSSProperties
      };
    });
    
    setPatterns(patternsData);
  }, [imageSize]);

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: -imageSize/2,
    left: -imageSize/2,
    right: -imageSize/2,
    bottom: -imageSize/2,
    overflow: 'hidden',
    zIndex: -1,
    pointerEvents: 'none',
  };

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


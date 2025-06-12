"use client";
import Link from "next/link";
import Beep from "../../../components/beep/beep";
import Pattern from "../../../components/pattern/pattern";
import React from "react";

export default function AboutPage() {
  const soundPath = "_button-beep-2.wav";
  const soundPath2 = "beep.wav";

  return (
    <div className="container"> {/* დავამატეთ relative და overflow-hidden */}
      <Pattern imageSize={250}/>
      <div className="relative z-10"> {/* დავამატეთ wrapper კონტენტისთვის */}
        <h1 className="text-2xl font-bold mb-6">ჩვენს შესახებ</h1>
        
        <div className="mb-8">
          <p>
            Fish Hunt არის პლატფორმა, რომელიც აერთიანებს თევზაობის მოყვარულებს და 
            პროფესიონალ მეთევზეებს. ჩვენი მიზანია შევქმნათ ერთიანი სივრცე, სადაც 
            შეძლებთ იპოვოთ ყველაფერი, რაც თევზაობისთვის გჭირდებათ.
          </p>
        </div>

        <div className="mb-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-4">გახდით გამყიდველი</h2>
          <p className="mb-4">
            გსურთ გახსნათ საკუთარი ონლაინ მაღაზია? გახდით ჩვენი პლატფორმის ნაწილი 
            და გაყიდეთ თქვენი პროდუქცია მარტივად.
          </p>
          <Link 
            href="/sellers-register" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
          >
            დარეგისტრირდით როგორც გამყიდველი
          </Link>
        </div>

        {/* <Beep soundSrc={soundPath} /> */}
        <Beep soundSrc={soundPath} shape="heart" />
        <Beep soundSrc={soundPath2} shape="star" />
      </div>
    </div>
  );
}
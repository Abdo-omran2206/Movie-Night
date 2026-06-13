"use client";
import dynamic from "next/dynamic";

const NightGuide = dynamic(() => import("./NightGuide"), { 
  ssr: false,
  loading: () => null // Optional: show nothing while loading the heavy chatbot
});

export default function DynamicNightGuide() {
  return <NightGuide />;
}

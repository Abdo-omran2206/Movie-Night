"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const NightGuide = dynamic(() => import("./NightGuide"), { 
  ssr: false,
  loading: () => null // Optional: show nothing while loading the heavy chatbot
});

export default function DynamicNightGuide() {
  const pathname = usePathname();
  if (pathname === "/maintenance") {
    return null;
  }
  return <NightGuide />;
}

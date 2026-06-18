import { Metadata } from "next";
import { siteUrl } from "@/constant/main";
import LoginPage from "./loginClient";

export const metadata: Metadata = {
  title: "Login - Movie Night",
  description:
    "Login to your Movie Night account and continue watching your favorite movies.",
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  openGraph: {
    title: "Login - Movie Night",
    description: "Login to your Movie Night account.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <LoginPage />;
}

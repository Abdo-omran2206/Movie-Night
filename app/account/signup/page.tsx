import { Metadata } from "next";
import SignupPage from "./signupClient";
import { siteUrl } from "@/constant/main";

export const metadata: Metadata = {
  title: "Sign Up - Movie Night",
  description: "Create a new Movie Night account and start watching your favorite movies.",
  alternates: {
    canonical: `${siteUrl}/signup`,
  },
  openGraph: {
    title: "Sign Up - Movie Night",
    description: "Create your Movie Night account.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignupPage />;
}
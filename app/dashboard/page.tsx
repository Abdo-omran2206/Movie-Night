import { Metadata } from "next";
import { siteUrl } from "@/constant/main";
import DashboardPage from "./dashboardClient";

export const metadata: Metadata = {
  title: "Dashboard - Movie Night",
  description: "Manage your watchlist, bookmarks, and account settings on Movie Night.",
  alternates: {
    canonical: `${siteUrl}/dashboard`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <DashboardPage />;
}
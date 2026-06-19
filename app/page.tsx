import Navbar from "@/components/ui/Navbar";
import Banner from "@/components/layout/Banner";
import Section from "@/components/layout/sections";
import Footer from "@/components/ui/Footer";
import { supabaseClient } from "@/lib/supabase";
import { getRegion } from "@/lib/getRegion";
import { SectionData } from "@/constant/types";
import { MAINSECTIONS, regions } from "@/constant/main";

export const revalidate = 3600;

export default async function Home() {
  const region = await getRegion();
  // Ensure we use a region code that we have a name for, or fallback to US
  const regionCode = (region && regions[region.region]) ? region.region : "US";
  const countryName = regions[regionCode];

  const { data, error } = await supabaseClient
    .from("sections_content")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching sections:", error);
  }

  // Determine which sections to use: from DB if available, or hardcoded fallback
  const sectionsList: SectionData[] = (data && data.length > 0) ? (data as SectionData[]) : MAINSECTIONS
  // Process sections to replace placeholders with real values (useful for DB content)
  const sections = sectionsList.map((section: SectionData) => ({
    ...section,
    title: section.title
      .replace("${countryName}", countryName || "USA")
      .replace("{countryName}", countryName || "USA"),
    endpoint: section.endpoint
      .replace("${region}", regionCode)
      .replace("{region}", regionCode),
  }));

  return (
    <div className="overflow-x-hidden bg-black">
      <Navbar />
      <main className="min-h-screen">
        <Banner />
        {sections.map((section: SectionData) => (
          <Section
            key={section.endpoint}
            endpoint={section.endpoint}
            title={section.title}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

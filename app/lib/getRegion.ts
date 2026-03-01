export async function getRegion() {
  try {
    // Try ipwho.is first
    const response = await fetch("https://ipwho.is/");
    const data = await response.json();
    if (data && data.country_code) {
      return {
        region: data.country_code,
        language: "en",
      };
    }
  } catch (error) {
    console.warn("ipwho.is failed, trying fallback...", error);
  }

  try {
    // Fallback to ip-api.com
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();
    if (data && data.countryCode) {
      return {
        region: data.countryCode,
        language: "en",
      };
    }
  } catch (error) {
    console.error("All region fetchers failed:", error);
  }

  // Final fallback
  return {
    region: "US",
    language: "en",
  };
}
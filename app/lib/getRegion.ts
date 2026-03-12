interface IPResponse {
  country_code?: string;
  countryCode?: string;
}

interface Provider {
  url: string;
  parse: (d: string | IPResponse) => string | null | undefined;
  isText?: boolean;
}

export async function getRegion() {
  // 1️⃣ Check if region is already set in store (persisted in AsyncStorage or Cookies)
  if (typeof window !== "undefined") {
    const storedRegion = localStorage.getItem("Region");
    if (storedRegion) {
      return { region: storedRegion, language: "en" };
    }
  }

  // 2️⃣ Server-side: Check headers (Next.js)
  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const headersList = await headers();
      const country = 
         headersList.get("x-vercel-ip-country") || 
         headersList.get("cf-ipcountry") ||
         headersList.get("x-appengine-country");
      
      if (country) {
        return { region: country.toUpperCase(), language: "en" };
      }
    } catch {
      // Ignore if headers() is not available or fails
    }
  }

  const providers: Provider[] = [
    {
      url: "https://ipwho.is/",
      parse: (d) => (d as IPResponse).country_code,
    },
    {
      url: "https://ipapi.co/json/",
      parse: (d) => (d as IPResponse).country_code,
    },
    {
      url: "https://extreme-ip-lookup.com/json/",
      parse: (d) => (d as IPResponse).countryCode,
    },
    {
      url: "https://cloudflare.com/cdn-cgi/trace",
      parse: (d) => {
        const lines = (d as string).split("\n");
        const loc = lines.find((line) => line.startsWith("loc="));
        return loc ? loc.split("=")[1] : null;
      },
      isText: true,
    }
  ];

  for (const provider of providers) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(provider.url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) continue;

      const data = provider.isText ? await response.text() : await response.json();
      const code = provider.parse(data);

      if (code && typeof code === "string") {
        const finalRegion = code.toUpperCase();
        
        if (typeof window !== "undefined") {
          localStorage.setItem("Region", finalRegion);
        }

        return {
          region: finalRegion,
          language: "en",
        };
      }
    } catch (err) {
      console.warn(`Region fetcher ${provider.url} failed:`, err);
    }
  }

  // Final fallback if everything fails
  console.error("All region fetchers failed, using default (US)");
  return {
    region: "US",
    language: "en",
  };
}
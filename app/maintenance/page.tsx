import Image from "next/image";
import AppConfig from "@/lib/services/configManager";

export async function generateMetadata() {
  return {
    title: "Under Maintenance — Movie Night",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Maintenance({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  let forceMessage = params?.message;
  if (!forceMessage) {
    forceMessage = await AppConfig();
  }

  const displayMessage =
    forceMessage ||
    "We are currently performing scheduled maintenance. Please check back soon.";

  return (
    <div
      className="min-h-screen bg-[#070707] text-white overflow-hidden relative fixed inset-0 z-50 overflow-y-auto"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.6; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .float-anim { animation: float 5s ease-in-out infinite; }
        .ring-pulse::before {
          content: '';
          position: absolute;
          inset: -12px;
          border-radius: 9999px;
          border: 2px solid rgba(239,68,68,0.5);
          animation: pulse-ring 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ef4444 0%, #f87171 40%, #fca5a5 50%, #f87171 60%, #ef4444 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .film-strip {
          background-image: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 18px,
            rgba(255,255,255,0.06) 18px,
            rgba(255,255,255,0.06) 24px
          );
        }
      `}</style>
        {/* === BACKGROUND LAYER === */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base radial gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(153,27,27,0.12) 0%, transparent 70%)",
            }}
          />
          {/* Floating orbs */}
          <div className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-red-900/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[8%] w-72 h-72 rounded-full bg-red-800/15 blur-[100px]" />
          <div className="absolute top-[60%] left-[60%] w-48 h-48 rounded-full bg-rose-900/10 blur-[80px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* === TOP FILM STRIP BAR === */}
        <div className="absolute top-0 left-0 right-0 h-10 film-strip flex items-center px-6 border-b border-white/5 z-20">
          <div className="flex items-center gap-6 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-5 h-6 bg-white/5 rounded-sm border border-white/8"
              />
            ))}
          </div>
        </div>

        {/* === BOTTOM FILM STRIP BAR === */}
        <div className="absolute bottom-0 left-0 right-0 h-10 film-strip flex items-center px-6 border-t border-white/5 z-20">
          <div className="flex items-center gap-6 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-5 h-6 bg-white/5 rounded-sm border border-white/8"
              />
            ))}
          </div>
        </div>

        {/* === MAIN CONTENT === */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16 gap-10">
          {/* Top brand bar */}
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Movie Night"
              width={36}
              height={36}
              className="rounded-xl opacity-90"
            />
            <span className="text-white/40 text-[11px] font-bold uppercase tracking-[0.35em]">
              Movie Night
            </span>
          </div>

          {/* Mascot + Glow */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse ring */}
            <div className="ring-pulse relative">
              {/* Glow blob */}
              <div className="absolute inset-[-30px] rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
              {/* Image */}
              <Image
                src="/NightGuide.png"
                alt="NightGuide mascot"
                width={200}
                height={200}
                className="float-anim relative z-10 rounded-[2rem] shadow-[0_0_60px_rgba(239,68,68,0.25)] ring-1 ring-red-500/20"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
          </div>

          {/* Text block */}
          <div className="flex flex-col items-center gap-4 max-w-sm text-center">
            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/60 bg-red-950/30 backdrop-blur-md">
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.7)]"
                style={{ animation: "pulse-ring 2s ease infinite" }}
              />
              <span className="text-red-400 text-[10px] font-bold uppercase tracking-[0.28em]">
                System Maintenance
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl font-extrabold tracking-wider leading-none"
              style={{ fontFamily: "var(--font-bebas, system-ui)" }}
            >
              <span className="shimmer-text">We&apos;ll Be Back</span>
              <br />
              <span className="text-white">Soon!</span>
            </h1>

            {/* Message */}
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light mt-1">
              {displayMessage}
            </p>
          </div>

          {/* Divider line + footer */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />
            <div className="flex items-center gap-2 text-[11px] text-white/25 font-medium tracking-wide">
              <Image
                src="/favicon.png"
                alt=""
                width={13}
                height={13}
                className="rounded opacity-40"
              />
              <span>
                © {new Date().getFullYear()} Movie Night — Thank you for your
                patience
              </span>
            </div>
          </div>
        </div>
    </div>
  );
}

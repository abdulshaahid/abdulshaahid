import { ImageResponse } from "next/og";

export const alt = "Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          border: "12px solid #18181b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              backgroundColor: "#1fd38a",
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            Portfolio // 2026
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            Mohamed Abdul Shahid
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#1fd38a",
              letterSpacing: "-0.01em",
            }}
          >
            Frontend Developer & UI/UX Designer
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Crafting purposeful digital experiences, high-performance web systems, and scalable design architectures.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid #27272a",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Design Systems"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  fontSize: 16,
                  color: "#d4d4d8",
                  fontFamily: "monospace",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: "monospace",
              color: "#71717a",
            }}
          >
            @abdulshaahid
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "トメピタ - 車種×駐車場マッチングサービス";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1B65A6 100%)",
        }}
      >
        {/* Logo + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          {/* Pin icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50% 50% 50% 0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-45deg)",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#1B65A6",
                transform: "rotate(45deg)",
              }}
            >
              P
            </span>
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            トメピタ
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            color: "#cbd5e1",
            textAlign: "center",
          }}
        >
          あなたの車、その駐車場に停められる？
        </div>

        {/* Tag line */}
        <div
          style={{
            fontSize: "20px",
            color: "#64748b",
            marginTop: "20px",
            padding: "8px 24px",
            border: "1px solid #334155",
            borderRadius: "999px",
          }}
        >
          車種 × 駐車場マッチングサービス
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";
import { getModelBySlug, getDimensionsByModelId } from "@/lib/queries";

export const runtime = "edge";
export const alt = "車種の寸法と駐車場適合 | トメピタ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff", fontSize: 48 }}>
        トメピタ
      </div>,
      { ...size }
    );
  }

  const dimension = await getDimensionsByModelId(model.id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1B65A6 100%)",
          padding: "60px",
        }}
      >
        {/* Header: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50% 50% 50% 0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-45deg)",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#1B65A6", transform: "rotate(45deg)" }}>P</span>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#94a3b8" }}>トメピタ</span>
        </div>

        {/* Car name */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: "24px", color: "#94a3b8", marginBottom: "8px" }}>
            {model.maker_name}
          </div>
          <div style={{ fontSize: "64px", fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>
            {model.name}
          </div>
          <div style={{ fontSize: "28px", color: "#cbd5e1", marginTop: "16px" }}>
            の寸法と駐車場適合
          </div>
        </div>

        {/* Dimensions bar */}
        {dimension && (
          <div
            style={{
              display: "flex",
              gap: "32px",
              padding: "20px 28px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px",
            }}
          >
            {dimension.length_mm != null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px", color: "#94a3b8" }}>全長</span>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>
                  {dimension.length_mm.toLocaleString()}mm
                </span>
              </div>
            )}
            {dimension.width_mm != null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px", color: "#94a3b8" }}>全幅</span>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>
                  {dimension.width_mm.toLocaleString()}mm
                </span>
              </div>
            )}
            {dimension.height_mm != null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px", color: "#94a3b8" }}>全高</span>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>
                  {dimension.height_mm.toLocaleString()}mm
                </span>
              </div>
            )}
            {dimension.weight_kg != null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px", color: "#94a3b8" }}>重量</span>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}>
                  {dimension.weight_kg.toLocaleString()}kg
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

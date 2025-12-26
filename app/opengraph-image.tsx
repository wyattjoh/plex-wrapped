import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "Plex Wrapped - Your year in Plex"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  const iconData = await readFile(join(process.cwd(), "public/icon.png"))
  const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #000000, #18181b, #000000)",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <img
          src={iconBase64}
          width={140}
          height={140}
          style={{
            marginBottom: "40px",
            borderRadius: "28px",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Plex{" "}
          <span style={{ color: "#E5A00D", marginLeft: "16px" }}>Wrapped</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Discover your watching habits from the past year
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "20px",
              color: "#d4d4d8",
            }}
          >
            Top Movies
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "20px",
              color: "#d4d4d8",
            }}
          >
            Top Shows
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "20px",
              color: "#d4d4d8",
            }}
          >
            Watch Time
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

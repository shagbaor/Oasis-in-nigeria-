import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FULL_NAME } from "@/lib/identity";
import { SHARE_IMAGE } from "@/lib/seo";

// The picture shown when a link to the site is shared (WhatsApp, Facebook,
// LinkedIn, X, Slack…). Generated once at build time.
export const alt = SHARE_IMAGE.alt;
export const size = { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height };
export const contentType = "image/png";

const FOREST = "#22493C";
const PALE_TERRACOTTA = "#E9C9B8";
const CREAM = "#F5EEE6";

const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// Repeat an SVG tile across an area using an SVG <pattern>.
function tiled(tileSvg: string, tileWidth: number, tileHeight: number, width: number, height: number, background = "none") {
  const inner = tileSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<defs><pattern id="p" width="${tileWidth}" height="${tileHeight}" patternUnits="userSpaceOnUse">${inner}</pattern></defs>` +
      `<rect width="100%" height="100%" fill="${background}"/><rect width="100%" height="100%" fill="url(#p)"/></svg>`
  );
}

export default async function OpenGraphImage() {
  const [regular, bold, italic, logo, tile, band] = await Promise.all([
    readFile(join(process.cwd(), "assets/og-fonts/pagella-regular.otf")),
    readFile(join(process.cwd(), "assets/og-fonts/pagella-bold.otf")),
    readFile(join(process.cwd(), "assets/og-fonts/pagella-italic.otf")),
    readFile(join(process.cwd(), "public/oasis-logo-reversed.svg")),
    readFile(join(process.cwd(), "public/patterns/tile.svg")),
    readFile(join(process.cwd(), "public/patterns/band-light.svg")),
  ]);

  const PATTERN_WIDTH = 360;
  const BAND_HEIGHT = 16;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: FOREST, fontFamily: "Pagella", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px 0 76px", width: 1200 - PATTERN_WIDTH }}>
          <img src={svgDataUri(logo.toString())} width={250} height={102} alt="" style={{ marginBottom: 40 }} />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.04, color: "white" }}>
            <span>Safety.</span>
            <span>Dignity.</span>
            <span style={{ color: PALE_TERRACOTTA }}>Recovery.</span>
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 28, fontStyle: "italic", color: CREAM, lineHeight: 1.3 }}>
            {FULL_NAME}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: PALE_TERRACOTTA, letterSpacing: 1 }}>
            www.oasisinnigeria.org
          </div>
        </div>
        <img
          src={tiled(tile.toString().replaceAll('stroke-opacity="0.45"', 'stroke-opacity="0.55"'), 144, 144, PATTERN_WIDTH, 630, "#2a5446")}
          width={PATTERN_WIDTH}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, right: 0 }}
        />
        <img
          src={tiled(band.toString(), 50, BAND_HEIGHT, 1200 - PATTERN_WIDTH, BAND_HEIGHT)}
          width={1200 - PATTERN_WIDTH}
          height={BAND_HEIGHT}
          alt=""
          style={{ position: "absolute", left: 0, bottom: 18 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pagella", data: regular, style: "normal", weight: 400 },
        { name: "Pagella", data: bold, style: "normal", weight: 700 },
        { name: "Pagella", data: italic, style: "italic", weight: 400 },
      ],
    }
  );
}

import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = new URL(req.url);
  
  // Si es "demo", generar QR para la página principal
  const target = slug === "demo" ? `${u.protocol}//${u.host}` : `${u.protocol}//${u.host}/${slug.replace(/\.svg$/,"")}`;

  const svg = await QRCode.toString(target, { type: "svg", margin: 1, width: 256 });
  return new NextResponse(svg, {
    status: 200,
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

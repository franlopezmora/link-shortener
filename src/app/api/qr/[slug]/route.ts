import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { BASE_HOST } from "@/lib/redis";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = new URL(req.url);
  const base = `${u.protocol}//${BASE_HOST}`; // fuerza host único
  const target = `${base}/${slug.replace(/\.svg$/,"")}`;

  const svg = await QRCode.toString(target, { type: "svg", margin: 1, width: 256 });
  return new NextResponse(svg, {
    status: 200,
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

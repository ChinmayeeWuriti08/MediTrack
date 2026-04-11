import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { doctorId, amount } = await req.json();
  // simulate payment processing
  return NextResponse.json({ success: true, transactionId: "TXN_" + Date.now() });
}
import { NextRequest, NextResponse } from "next/server";
import { InstitutionalRepository } from "@/lib/institutional/repository/institutionalRepository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const symbol = body.symbol || "RELIANCE";

    const repo = new InstitutionalRepository();
    const updated = repo.getInstitutionalActivity(symbol);

    return NextResponse.json({
      status: "SUCCESS",
      refreshedAt: new Date().toISOString(),
      symbol,
      score: updated?.score,
      classification: updated?.classification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Refresh Failed", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    telemetry: {
      totalUsers: 1450,
      activeSessions: 142,
      executedVolumeCr: 1842.5,
      engineLatencyMs: 0.78,
      gcPauseOverheadMb: 0,
    },
    users: [
      {
        id: "usr_1",
        name: "Ayush Singh",
        email: "ayushsinghe07@gmail.com",
        role: "ADMIN",
        plan: "INSTITUTIONAL",
        status: "ACTIVE",
        ordersCount: 1420,
        lastActive: "Just Now",
        ipAddress: "103.24.12.8",
        createdAt: "2026-01-15",
      },
      {
        id: "usr_2",
        name: "Vikram Sharma",
        email: "vikram.sharma@quantlab.in",
        role: "INSTITUTIONAL",
        plan: "INSTITUTIONAL",
        status: "ACTIVE",
        ordersCount: 890,
        lastActive: "2 mins ago",
        ipAddress: "49.207.185.12",
        createdAt: "2026-02-01",
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, plan, status } = body;

    return NextResponse.json({
      success: true,
      action,
      userId,
      updatedAt: new Date().toISOString(),
      message: `Admin operation '${action}' executed successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid admin payload" },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const sort = searchParams.get("sort") || "createdAt";

    const query: Record<string, unknown> = { userId: user.userId };
    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      createdAt: { createdAt: -1 },
      dueDate: { dueDate: 1 },
      priority: { priority: -1 },
      title: { title: 1 },
    };

    const tasks = await Task.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .lean();

    return NextResponse.json({ tasks });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const { title, description, priority, dueDate } = body;

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: user.userId,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

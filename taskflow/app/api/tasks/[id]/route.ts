import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getUserFromRequest } from "@/lib/auth";

interface Params { params: Promise<{ id: string }> }

async function getTask(id: string, userId: string) {
  return Task.findOne({ _id: id, userId });
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const task = await getTask(id, user.userId);
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, priority, status, dueDate } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ task });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await connectDB();
    const task = await Task.findOneAndDelete({ _id: id, userId: user.userId });
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

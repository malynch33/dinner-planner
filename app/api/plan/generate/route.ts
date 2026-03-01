import { generateWeeklyPlan } from "@/lib/planner";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const plan = await generateWeeklyPlan(body.cookDays);
  
      return Response.json(plan);
    } catch (err) {
      console.error("PLAN ERROR:", err);
      return new Response(
        JSON.stringify({ error: String(err) }),
        { status: 500 }
      );
    }
  }
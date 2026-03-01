import base from "@/lib/airtable";
import { fetchActiveMeals } from "@/lib/meals";
import { getMealById } from "@/lib/meals";

const LEFTOVERS_ID = "recQ69QdArs9lezis";

function getCurrentWeekMonday() {
  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function generateWeeklyPlan(cookDays: string[]) {
  const meals = await fetchActiveMeals();
  const selected = shuffle(meals).slice(0, 7);

  const monday = getCurrentWeekMonday();

  const fields = {
    WeekOf: monday.toISOString().split("T")[0],
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  days.forEach((day, i) => {
    if (cookDays.includes(day)) {
      const meal = selected.shift();
      if (meal) {
        fields[day] = [meal.id];
      }
    } else {
      fields[day] = [LEFTOVERS_ID];
    }
  });

  const [created] = await base("WeeklyPlans").create([{ fields }]);

  const readablePlan = {
    id: created.id,
    fields: {},
  };
  
  for (const day of Object.keys(created.fields)) {
    const value = created.fields[day];
  
    // Skip WeekOf (it's not a linked record)
    if (day === "WeekOf") {
      readablePlan.fields[day] = value;
      continue;
    }
  
    const mealId = value?.[0];
  
    if (mealId) {
      const meal = await getMealById(mealId);
      readablePlan.fields[day] = [meal.fields.Name];
    }
  }
  
  return readablePlan;
}
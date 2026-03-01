import base from "@/lib/airtable";

export async function fetchActiveMeals() {
  const records = await base("Meals")
    .select({
      filterByFormula: "{Active} = TRUE()",
    })
    .all();

  return records.map((r) => ({
    id: r.id,
    fields: r.fields,
  }));
}
export async function getMealById(id) {
    const record = await base("Meals").find(id);
  
    return {
      id: record.id,
      fields: record.fields,
    };
  }
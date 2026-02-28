import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN!,
}).base("appEoSA1L6CTphLlW");

export async function GET() {
  try {
    const records = await base("Dinners")
  .select({
    maxRecords: 10,
    fields: ["Name", "Notes", "Category"],
  })
  .firstPage();

    return Response.json(
      records.map((r) => ({
        id: r.id,
        ...r.fields,
      }))
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
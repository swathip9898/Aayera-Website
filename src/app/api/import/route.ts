import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, apiError } from "@/lib/apiHelpers";
import { bulkCreateItems } from "@/lib/db/repository";
import { parseCsv } from "@/lib/csv";

type ImportTarget = "speakers" | "sessions" | "sponsors" | "faqs";

const ALLOWED_TARGETS = new Set<ImportTarget>(["speakers", "sessions", "sponsors", "faqs"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRow(target: ImportTarget, row: Record<string, any>, idx: number) {
  if (target === "speakers") {
    return {
      name: String(row.name || row.Name || "").trim(),
      role: String(row.role || row.Role || row.title || "Executive Speaker").trim(),
      company: String(row.company || row.Company || row.organization || "").trim(),
      category: String(row.category || row.Category || "Keynote").trim(),
      bio: String(row.bio || row.Bio || "").trim(),
      photoUrl: String(row.photoUrl || row.photo || "/images/speaker-1.svg").trim(),
      linkedin: String(row.linkedin || "").trim(),
      featured: String(row.featured ?? "true").toLowerCase() !== "false",
      order: Number(row.order ?? idx + 1) || idx + 1,
    };
  }
  if (target === "sessions") {
    const speakersRaw = row.speakers || row.Speakers || "";
    const speakers = Array.isArray(speakersRaw)
      ? speakersRaw.map(String)
      : String(speakersRaw)
          .split(/[;|]/)
          .map((s) => s.trim())
          .filter(Boolean);

    return {
      day: String(row.day || row.Day || "Day 1").trim(),
      dateLabel: String(row.dateLabel || row.date || "").trim(),
      startTime: String(row.startTime || row.start || "09:00 AM").trim(),
      endTime: String(row.endTime || row.end || "10:00 AM").trim(),
      title: String(row.title || row.Title || "").trim(),
      description: String(row.description || row.Description || "").trim(),
      track: String(row.track || row.Track || "Main Stage").trim(),
      sessionType: String(row.sessionType || row.type || "Keynote").trim(),
      hall: String(row.hall || row.Hall || "Grand Arena").trim(),
      speakers,
      order: Number(row.order ?? idx + 1) || idx + 1,
    };
  }
  if (target === "sponsors") {
    return {
      name: String(row.name || row.Name || "").trim(),
      tier: String(row.tier || row.Tier || "Gold Sponsor").trim(),
      logoUrl: String(row.logoUrl || row.logo || "/images/sponsor-1.svg").trim(),
      websiteUrl: String(row.websiteUrl || row.website || "https://example.com").trim(),
      description: String(row.description || row.Description || "").trim(),
      order: Number(row.order ?? idx + 1) || idx + 1,
    };
  }
  return {
    question: String(row.question || row.Question || "").trim(),
    answer: String(row.answer || row.Answer || "").trim(),
    category: String(row.category || row.Category || "General").trim(),
    order: Number(row.order ?? idx + 1) || idx + 1,
  };
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const target = body?.target as ImportTarget;
    if (!ALLOWED_TARGETS.has(target)) {
      return apiError("Invalid import target. Choose speakers, sessions, sponsors, or faqs.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawRows: Record<string, any>[] = [];
    if (Array.isArray(body?.rows)) {
      rawRows = body.rows;
    } else if (typeof body?.csvText === "string") {
      rawRows = parseCsv(body.csvText);
    } else if (typeof body?.jsonText === "string") {
      const parsed = JSON.parse(body.jsonText);
      rawRows = Array.isArray(parsed) ? parsed : [parsed];
    }

    if (!rawRows.length) {
      return apiError("No valid rows found to import.");
    }

    const normalized = rawRows
      .map((row, idx) => normalizeRow(target, row, idx))
      .filter((item) => {
        if (target === "speakers" || target === "sponsors") return Boolean((item as { name: string }).name);
        if (target === "sessions") return Boolean((item as { title: string }).title);
        return Boolean((item as { question: string }).question);
      });

    if (!normalized.length) {
      return apiError("Rows were missing required fields (name/title/question).");
    }

    const inserted = await bulkCreateItems(target, normalized);
    return NextResponse.json({
      ok: true,
      count: inserted.length,
      items: inserted,
    });
  } catch (err) {
    console.error("Bulk import error:", err);
    return apiError("Failed to parse or import data. Check your CSV/JSON syntax.", 400);
  }
}

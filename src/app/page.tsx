import React from "react";
import { getFullSiteData } from "@/lib/db/repository";
import { SummitApp } from "@/components/summit/SummitApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getFullSiteData();
  return <SummitApp initialData={data} />;
}

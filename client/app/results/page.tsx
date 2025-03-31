"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { LeadTable } from "@/components/lead-table";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { LogoIcon } from "@/components/logo-icon";
import Link from "next/link";

export default function ResultsPage() {
  const [query, setQuery] = useState("give details of companies with sponsorship for automobiles");

  return (
    <div className="flex h-screen">
      <Sidebar className="w-[240px] hidden md:block" />
      <div className="flex-1 flex flex-col bg-black">
        <header className="flex items-center justify-between p-4 border-b border-[#343434]">
          <div className="flex items-center gap-2">
            <LogoIcon className="md:hidden" />
            <h1 className="text-xl font-bold">LeadSnap</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-highlight text-black hover:bg-highlight/90 rounded-full"
            >
              <span className="text-xs">
                Brands investing in sustainability initiatives
              </span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">
              Here's a table to showcase the generated lead data in a structured format. We generate these leads for you.
            </h2>
          </div>
          <div className="bg-[#1b1b1b] rounded-lg p-4">
            <LeadTable query={query} />
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="text-sm">
              See More
            </Button>
            <Link href="/database">
              <Button variant="outline" className="text-sm">
                Database View
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <SearchBar setQuery={setQuery} defaultValue={query} />
          </div>
        </main>
      </div>
    </div>
  );
}

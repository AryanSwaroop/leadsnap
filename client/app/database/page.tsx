"use client"

import { Sidebar } from "@/components/sidebar";
import { LeadTable } from "@/components/lead-table";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { ArrowLeft } from "lucide-react";
import { LogoIcon } from "@/components/logo-icon";
import Link from "next/link";
import { useState } from "react";

export default function DatabasePage() {
  // Define state for the query
  const [query, setQuery] = useState("give details of companies with sponsorship for automobiles");

  return (
    <div className="flex h-screen">
      <Sidebar className="w-[240px] hidden md:block" />
      <div className="flex-1 flex flex-col bg-black">
        <header className="flex items-center p-4 border-b border-[#343434]">
          <div className="flex items-center gap-2">
            <LogoIcon className="md:hidden" />
            <h1 className="text-xl font-bold">LeadSnap</h1>
          </div>
        </header>
        <div className="p-4 border-b border-[#343434]">
          <div className="flex items-center gap-2">
            <Link href="/results">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Database View
              </Button>
            </Link>
          </div>
        </div>
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-[#1b1b1b] rounded-lg p-4">
            <LeadTable query={query} />
          </div>
          <div className="mt-8">
            <SearchBar setQuery={setQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}
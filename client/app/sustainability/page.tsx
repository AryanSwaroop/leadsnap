import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { FindLeadsButton } from "@/components/find-leads-button"
import { LogoIcon } from "@/components/logo-icon"

export default function SustainabilityPage() {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-[240px] hidden md:block" />
      <div className="flex-1 flex flex-col bg-black">
        <div className="absolute top-4 left-4 md:hidden">
          <LogoIcon />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold mb-8">LeadSnap</h1>
            <SearchBar defaultValue="Brands investing in sustainability initiatives" />
            <div className="mt-4">
              <FindLeadsButton href="/results" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


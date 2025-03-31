"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, HelpCircle, Menu, Search, Users, Send, Clock, CheckCircle, ChevronDown } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [lastHourExpanded, setLastHourExpanded] = useState(false)

  return (
    <div className={cn("flex flex-col h-screen bg-[#1b1b1b]", className)}>
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full justify-start bg-teal text-white hover:bg-teal/90 hover:text-white"
              asChild
            >
              <Link href="/">
                <Search className="mr-2 h-4 w-4" />
                {!isCollapsed && "Find Leads"}
              </Link>
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname === "/post-leads" && "bg-muted")}
              asChild
            >
              <Link href="/post-leads">
                <Send className="mr-2 h-4 w-4" />
                {!isCollapsed && "Post Leads"}
              </Link>
            </Button>
            <div className="pl-4 space-y-1 mt-4">
              <div className="flex items-center text-xs text-muted-foreground py-1">
                <Users className="mr-2 h-4 w-4" />
                {!isCollapsed && "Find companies sponsoring AI events"}
              </div>
              <div className="flex items-center text-xs text-muted-foreground py-1">
                <Clock className="mr-2 h-4 w-4" />
                {!isCollapsed && "Browse listings for healthcare professionals"}
              </div>
              <div className="flex items-center text-xs text-muted-foreground py-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                {!isCollapsed && "Companies hiring data science teams"}
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setLastHourExpanded(!lastHourExpanded)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">Last Hour</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${lastHourExpanded ? "rotate-180" : ""}`} />
                  </>
                )}
              </Button>
              {lastHourExpanded && !isCollapsed && (
                <div className="pl-8 mt-2 space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                    All leads
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                    Tech leads
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                    Marketing leads
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-[#343434]">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            {!isCollapsed && "Settings"}
          </Button>
          <Button variant="ghost" size="sm" className="justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            {!isCollapsed && "Help"}
          </Button>
        </div>
      </div>
    </div>
  )
}


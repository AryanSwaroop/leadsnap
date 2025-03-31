import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import Link from "next/link"

interface FindLeadsButtonProps {
  href?: string
}

export function FindLeadsButton({ href = "/results" }: FindLeadsButtonProps) {
  const button = (
    <Button className="bg-blue hover:bg-blue/90 text-white rounded-md px-6">
      <Send className="mr-2 h-4 w-4" />
      Find Leads
    </Button>
  )

  if (href) {
    return <Link href={href}>{button}</Link>
  }

  return button
}


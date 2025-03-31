import { Circle } from "lucide-react"

export function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Circle className="h-6 w-6 text-teal fill-teal" />
    </div>
  )
}


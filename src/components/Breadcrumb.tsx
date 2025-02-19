import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  items: {
    label: string
    href: string
  }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {

  if (items.length <= 1) return null

  return (
    <nav className="flex flex-row group font-medium text-sm text-grayOpacity mb-1">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 ml-1" />}
          <Link 
            href={item.href} 
            className={`
              transition-colors duration-300
              ${index === items.length - 1 
                ? "text-text group-hover:text-grayOpacity" 
                : "hover:text-text animlinkunderline"
              }
            `}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}
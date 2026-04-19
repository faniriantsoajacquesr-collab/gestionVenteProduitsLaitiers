"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/UI/input"
import { Button } from "@/components/UI/button"
import { Checkbox } from "@/components/UI/checkbox"
import { Search, Menu, X, LayoutGrid, Milk, Leaf } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu"
import { Label } from "@/components/UI/label"

interface Filters {
  category: string[]
  milkType: string[]
  dietary: string[]
}

const FILTER_OPTIONS = {
  category: ["Milk", "Yogurt", "Cheese", "Butter", "Creams"],
  milkType: ["Cow", "Goat", "Sheep", "Plant-based"],
  dietary: ["Organic", "Lactose-free", "Probiotic"],
}

interface ProductNavbarProps {
  onFilterChange?: (filters: Filters) => void
  onSearch?: (query: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function ProductNavbar({
  onFilterChange,
  onSearch,
  isCollapsed = false,
  onToggleCollapse,
}: ProductNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    category: [],
    milkType: [],
    dietary: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isMilkTypeOpen, setIsMilkTypeOpen] = useState(false)
  const [isDietaryOpen, setIsDietaryOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  useEffect(() => {
    if (!isCollapsed && pendingAction) {
      if (pendingAction === "search") {
        inputRef.current?.focus()
      } else if (pendingAction === "category") {
        setIsCategoryOpen(true)
      } else if (pendingAction === "milkType") {
        setIsMilkTypeOpen(true)
      } else if (pendingAction === "dietary") {
        setIsDietaryOpen(true)
      }
      setPendingAction(null)
    }
  }, [isCollapsed, pendingAction])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleCheckChange = (filterType: keyof Filters, value: string) => {
    const newFilters = { ...filters }
    if (newFilters[filterType].includes(value)) {
      newFilters[filterType] = newFilters[filterType].filter((item) => item !== value)
    } else {
      newFilters[filterType].push(value)
    }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const FilterSection = ({ 
    title, 
    type, 
    open, 
    onOpenChange 
  }: { 
    title: string; 
    type: keyof Filters;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {title}
          <span className="text-xs text-outline-variant">
            {filters[type].length > 0 ? `${filters[type].length} sélectionnés` : 'Sélectionner'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FILTER_OPTIONS[type].map((option) => (
          <DropdownMenuItem key={option} className="flex items-center space-x-2 p-2">
            <Checkbox
              id={`${type}-${option}`}
              checked={filters[type].includes(option)}
              onCheckedChange={() => handleCheckChange(type, option)}
            />
            <Label
              htmlFor={`${type}-${option}`}
              className="text-sm font-normal cursor-pointer flex-1"
            >
              {option}
            </Label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <aside className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-surface shadow-xl flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* COLLAPSE TOGGLE BUTTON */}
      <div className="p-4 flex justify-center border-b border-outline/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-8 h-8 p-0 hover:bg-surface-container"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Collapsed state: Search and Filter buttons */}
      {isCollapsed && (
        <div className="p-4 space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPendingAction("search")
              onToggleCollapse?.()
            }}
            className="w-full h-10 p-0 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>
          
          <div className="h-px bg-outline/10 mx-2 my-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPendingAction("category")
              onToggleCollapse?.()
            }}
            className="w-full h-10 p-0 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            title="Product Category"
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPendingAction("milkType")
              onToggleCollapse?.()
            }}
            className="w-full h-10 p-0 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            title="Milk Type"
          >
            <Milk className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPendingAction("dietary")
              onToggleCollapse?.()
            }}
            className="w-full h-10 p-0 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            title="Dietary"
          >
            <Leaf className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* TOP: Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-outline/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm rounded-lg border border-outline bg-surface-container placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary-container w-full"
            />
          </div>
        </div>
      )}

      {/* MIDDLE: Filter Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-outline/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-on-surface">Filtres</h3>
              {(filters.category.length > 0 || filters.milkType.length > 0 || filters.dietary.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const clearedFilters = { category: [], milkType: [], dietary: [] }
                    setFilters(clearedFilters)
                    onFilterChange?.(clearedFilters)
                  }}
                  className="text-xs text-outline-variant hover:text-on-surface h-auto p-1"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
            <FilterSection 
              title="Catégorie" 
              type="category" 
              open={isCategoryOpen} 
              onOpenChange={setIsCategoryOpen} 
            />
            <FilterSection 
              title="Type de lait" 
              type="milkType" 
              open={isMilkTypeOpen} 
              onOpenChange={setIsMilkTypeOpen} 
            />
            <FilterSection 
              title="Régime" 
              type="dietary" 
              open={isDietaryOpen} 
              onOpenChange={setIsDietaryOpen} 
            />
          </div>
        </div>
      )}

    </aside>
  )
}
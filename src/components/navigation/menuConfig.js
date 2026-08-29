// src/components/navigation/menuConfig.js
import { ChartNoAxesCombined, Home, Settings2, Table2, Users } from "lucide-react"

export const menuItems = [
  { id: 1, name: "Ishchilar", icon: Users, url: "/admin/xodimlar" },
  { id: 2, name: "Xonalar", icon: Table2, url: "/admin/xonalar" },
  { id: 3, name: "Bosh sahifa", icon: Home, url: "/" },
  { id: 4, name: "Statistika", icon: ChartNoAxesCombined, url: "/admin/statistika" },
  { id: 5, name: "Sozlamalar", icon: Settings2, url: "/admin/sozlamalar" },
]

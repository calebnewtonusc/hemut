"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Mail,
  MessageSquare,
  Truck,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: UserCheck },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/communications", label: "Communications", icon: MessageSquare },
];

const bottomNav = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col h-screen bg-[#0f1629] text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg tracking-tight text-white">Hemut</div>
          <div className="text-xs text-white/40">Logistics OS</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
          Platform
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-amber-400" : "text-white/40 group-hover:text-white/70")} />
              {label}
              {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-amber-400/60" />}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
            System
          </p>
          {bottomNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Icon className="w-4 h-4 text-white/40 group-hover:text-white/70" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 text-xs font-bold">H</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">Hemut Admin</div>
            <div className="text-xs text-white/40 truncate">admin@hemut.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

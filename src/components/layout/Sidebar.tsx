"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  ClipboardList,
  Users,
  Truck,
  ShieldCheck,
  DollarSign,
  Building2,
  UserCheck,
  MessageSquare,
  Mail,
  Bell,
  Settings,
  ChevronRight,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  live?: boolean;
  badge?: string;
  badgeColor?: "red" | "emerald" | "amber" | "default";
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Operations",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dispatch", label: "Live Dispatch", icon: Radio, live: true },
      { href: "/loads", label: "Load Board", icon: ClipboardList, badge: "247", badgeColor: "default" },
    ],
  },
  {
    label: "Fleet & Drivers",
    items: [
      { href: "/drivers", label: "Drivers", icon: Users, badge: "41", badgeColor: "emerald" },
      { href: "/fleet", label: "Fleet", icon: Truck },
      { href: "/compliance", label: "Compliance", icon: ShieldCheck, badge: "2", badgeColor: "red" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/finance", label: "Finance", icon: DollarSign },
      { href: "/carriers", label: "Carriers", icon: Building2 },
      { href: "/analytics", label: "Analytics", icon: TrendingUp },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/onboarding", label: "Onboarding", icon: UserCheck, badge: "4", badgeColor: "amber" },
      { href: "/communications", label: "Communications", icon: MessageSquare },
      { href: "/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Ops Manager",
  DISPATCHER: "Dispatcher",
  DRIVER: "Driver",
  MANAGER: "Fleet Manager",
};

const badgeStyles: Record<string, string> = {
  red: "bg-red-500/20 text-red-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/20 text-amber-400",
  default: "bg-white/10 text-white/45",
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-[220px] flex flex-col h-screen bg-[#080d1a] text-white shrink-0 border-r border-white/[0.06]">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
          <Truck className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[15px] tracking-tight leading-none text-white">Hemut</div>
          <div className="text-[10px] text-white/30 mt-0.5 font-medium tracking-wide">Logistics OS</div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-3 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-2 pb-1.5 text-[9px] uppercase tracking-[0.12em] text-white/20 font-bold">
              {section.label}
            </p>
            <div className="space-y-px">
              {section.items.map(({ href, label, icon: Icon, live, badge, badgeColor = "default" }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all group",
                      active
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.05]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[15px] h-[15px] shrink-0",
                        active ? "text-amber-400" : "text-white/30 group-hover:text-white/55"
                      )}
                    />
                    <span className="flex-1 truncate">{label}</span>
                    {live && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                    {badge && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center", badgeStyles[badgeColor])}>
                        {badge}
                      </span>
                    )}
                    {active && !badge && !live && (
                      <ChevronRight className="w-3 h-3 text-amber-400/40 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System */}
      <div className="px-2.5 pt-2 pb-1 border-t border-white/[0.06]">
        {[
          { href: "/notifications", label: "Notifications", icon: Bell, badge: "3" },
          { href: "/settings", label: "Settings", icon: Settings },
        ].map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all group"
          >
            <Icon className="w-[15px] h-[15px] text-white/30 group-hover:text-white/55 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* User */}
      <div className="px-3 py-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-[10px] font-bold">
              {session?.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "RM"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white/90 truncate">{session?.user?.name ?? "Ricky Maldonado"}</div>
            <div className="text-[10px] text-white/30 truncate">{ROLE_LABELS[(session?.user as { role?: string })?.role ?? ""] ?? (session?.user as { role?: string })?.role ?? "Ops Manager"}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-white/20 hover:text-white/60 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

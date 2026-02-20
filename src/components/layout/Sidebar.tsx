"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, UserCheck, Mail, LogOut, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",      icon: LayoutDashboard, badge: 0, badgeType: "info" as const },
  { href: "/communications", label: "Communications", icon: MessageSquare,   badge: 3, badgeType: "alert" as const },
  { href: "/onboarding",     label: "Onboarding",     icon: UserCheck,       badge: 4, badgeType: "warn" as const },
  { href: "/newsletter",     label: "Newsletter",     icon: Mail,            badge: 2, badgeType: "info" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#080d1a] shrink-0 border-r border-white/[0.06] relative transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[248px]"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3.5 px-4 h-[68px] border-b border-white/[0.06] shrink-0 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-[#0f1a2e] border border-white/[0.08] flex items-center justify-center shrink-0">
          <div className="relative w-[22px] h-[22px]">
            <Image src="/hemut-mark.png" alt="Hemut" fill sizes="22px" className="object-contain" />
          </div>
        </div>
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <div className="text-[15px] font-bold tracking-tight text-white leading-none whitespace-nowrap">Hemut</div>
          <div className="text-[10px] text-white/25 mt-[3px] font-medium tracking-widest uppercase whitespace-nowrap">Logistics OS</div>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[52px] w-6 h-6 rounded-full bg-[#0f1a2e] border border-white/[0.12] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-[#162035] transition-all z-10 shadow-md"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-0.5 overflow-hidden">
        {!collapsed && (
          <p className="px-4 pb-3.5 text-[10px] uppercase tracking-[0.14em] text-white/20 font-bold whitespace-nowrap">
            Workspace
          </p>
        )}
        {navItems.map(({ href, label, icon: Icon, badge, badgeType }) => {
          const active = pathname.startsWith(href);
          const badgeColorMap = {
            alert: active ? "bg-red-500/20 text-red-400" : "bg-red-500/15 text-red-400",
            warn:  active ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.07] text-white/35",
            info:  active ? "bg-sky-500/15 text-sky-400" : "bg-white/[0.07] text-white/35",
          };
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3.5 rounded-xl text-[13px] font-medium transition-all relative",
                collapsed ? "justify-center" : "",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <div className="relative shrink-0">
                <Icon
                  className={cn("w-[15px] h-[15px]", active ? "text-amber-400" : "text-white/30")}
                />
                {/* Notification dot when collapsed */}
                {collapsed && badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[7px] font-bold text-[#080d1a]">
                    {badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[20px] text-center animate-pulse-once",
                        badgeColorMap[badgeType]
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-5 border-t border-white/[0.06] overflow-hidden">
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-1")}>
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-sm"
            title={collapsed ? (session?.user?.name ?? "Ricky Maldonado") : undefined}
          >
            <span className="text-white text-[10px] font-bold">
              {session?.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "RM"}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-white/80 truncate leading-tight">
                  {session?.user?.name ?? "Ricky Maldonado"}
                </div>
                <div className="text-[10px] text-white/25 truncate mt-0.5">Ops Manager</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-white/20 hover:text-white/55 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05]"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

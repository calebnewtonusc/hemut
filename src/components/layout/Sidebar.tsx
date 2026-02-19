"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, UserCheck, Mail, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/communications", label: "Communications", icon: MessageSquare, badge: "12" },
  { href: "/onboarding", label: "Onboarding", icon: UserCheck, badge: "4" },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-[216px] flex flex-col h-screen bg-[#080d1a] shrink-0 border-r border-white/[0.06]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-[60px] border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <Image src="/hemut-logo.png" alt="Hemut" width={32} height={32} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-white leading-none">Hemut</div>
          <div className="text-[10px] text-white/25 mt-0.5 font-medium tracking-wide uppercase">Logistics OS</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2.5 pt-1 text-[10px] uppercase tracking-[0.12em] text-white/20 font-bold">
          Workspace
        </p>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-[15px] h-[15px] shrink-0",
                  active ? "text-amber-400" : "text-white/30"
                )}
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold min-w-[20px] text-center",
                    active
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-white/[0.07] text-white/35"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">
              {session?.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "RM"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white/80 truncate leading-tight">
              {session?.user?.name ?? "Ricky Maldonado"}
            </div>
            <div className="text-[10px] text-white/25 truncate">Ops Manager</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-white/20 hover:text-white/55 transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

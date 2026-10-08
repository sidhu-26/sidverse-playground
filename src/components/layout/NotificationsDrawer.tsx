"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useOS } from "@/lib/context/OSContext";
import { Button } from "@/components/ui/Button";
import { Bell, Clock, ShieldAlert, Cpu, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationsDrawer() {
  const {
    notifications,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    markAllNotificationsRead,
    markNotificationRead,
  } = useOS();

  const [activeTab, setActiveTab] = useState<"ALL" | "REMINDERS" | "DEADLINES" | "SYSTEM">("ALL");

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    return n.category === activeTab;
  });

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />;
      case "deadline":
        return <ShieldAlert className="w-3.5 h-3.5 text-[#FF4567]" />;
      case "system":
        return <Cpu className="w-3.5 h-3.5 text-[#B7FF3C]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#8B96A3]" />;
    }
  };

  return (
    <Drawer
      isOpen={isNotificationsDrawerOpen}
      onClose={() => setIsNotificationsDrawerOpen(false)}
      title="SYSTEM NOTIFICATIONS"
      subtitle="REAL-TIME TELEMETRY ALERTS"
      width="md"
    >
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0F141A] rounded-[6px] border border-white/[0.06]">
          {(["ALL", "REMINDERS", "DEADLINES", "SYSTEM"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-mono-tech uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer",
                activeTab === tab
                  ? "bg-[#131A21] text-[#00E5FF] shadow-sm font-semibold"
                  : "text-[#8B96A3] hover:text-[#F4F7FA]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mark All Read Action */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <span className="font-mono-tech text-[11px] text-[#58616B]">
            {filteredNotifications.length} ALERTS
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllNotificationsRead}
            icon={<CheckCheck className="w-3.5 h-3.5 text-[#00E5FF]" />}
          >
            MARK ALL AS READ
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono-tech text-[#58616B]">
              {"// No notifications in this category."}
            </div>

          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={cn(
                  "p-3 rounded-[6px] border transition-all cursor-pointer relative",
                  notif.read
                    ? "bg-[#0F141A]/60 border-white/[0.04] opacity-75"
                    : "bg-[#131A21] border-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.04)]"
                )}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                )}

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-white/5 mt-0.5">
                    {getCategoryIcon(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-sans-main text-xs font-semibold text-[#F4F7FA]">
                        {notif.title}
                      </span>
                      <span className="font-mono-tech text-[10px] text-[#58616B]">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="font-sans-main text-xs text-[#8B96A3] mt-1 leading-snug">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
}

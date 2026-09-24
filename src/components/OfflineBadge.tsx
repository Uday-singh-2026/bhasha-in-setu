import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineBadge() {
  const [online, setOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const upd = () => setOnline(navigator.onLine);
    upd();
    window.addEventListener("online", upd);
    window.addEventListener("offline", upd);
    return () => {
      window.removeEventListener("online", upd);
      window.removeEventListener("offline", upd);
    };
  }, []);

  if (!mounted) return null;

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold " +
        (online
          ? "border-leaf/40 bg-leaf/10 text-leaf"
          : "border-primary/40 bg-primary/10 text-primary")
      }
    >
      {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
      {online ? "Online • content synced" : "Offline mode active"}
    </span>
  );
}

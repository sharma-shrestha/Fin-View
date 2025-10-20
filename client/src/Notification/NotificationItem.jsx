// src/components/NotificationItem.jsx
import React from "react";
import { CreditCard, Settings } from "lucide-react";

export default function NotificationItem({ data, formatDate, onRead }) {
  const { id, title, message, createdAt, read, type } = data;
  const color =
    type === "Custom"
      ? "border-yellow-500"
      : "border-rose-500";

  const Icon = type === "Custom" ? Settings : CreditCard;

  return (
    <div
      className={`flex items-start justify-between gap-4 border-l-4 ${color} bg-neutral-900/70 rounded-xl p-4 transition-all ${
        read ? "opacity-80" : "ring-1 ring-blue-600/40"
      }`}
    >
      <div className="flex gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
          <Icon className="text-white h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-neutral-300">{message}</p>
          <span className="text-xs text-neutral-500">{formatDate(createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        {!read && (
          <button
            onClick={() => onRead(id)}
            className="text-xs text-blue-400 border border-blue-600/30 px-3 py-1 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 transition"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

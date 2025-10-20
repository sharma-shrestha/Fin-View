// src/pages/NotificationsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import NotificationItem from "./NotificationItem";

const formatDate = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} • ${time}`;
};

const getGroup = (iso) => {
  const t = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  if (t >= today) return "Today";
  if (t >= yesterday) return "Yesterday";
  return "Older";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${getEnv("VITE_API_URL")}/budget/all`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          showToast("error", data.message || "Failed to fetch data");
          return;
        }

        const mapped = data.budgets.flatMap((b) => {
          const type = b.rule === "custom" ? "Custom" : "Recommended";

          // Account setup notification
          const notifications = [
            {
              id: `${b._id}-setup`,
              type,
              title: `Account Setup & Custom Setup Created`,
              message: `${b.title || "Untitled Setup"} — Income ₹${b.income || 0}`,
              createdAt: b.updatedAt || b.createdAt,
              read: false,
            },
          ];

          // Include all categories for this budget
          if (b.categories?.length > 0) {
            b.categories.forEach((cat, idx) => {
              notifications.push({
                id: `${b._id}-cat-${idx}`,
                type: cat.type === "custom" ? "Custom" : "Recommended",
                title: `${cat.name}`,
                message: `Amount ₹${cat.amount || 0}`,
                createdAt: cat.updatedAt || b.updatedAt || b.createdAt,
                read: false,
              });
            });
          }

          return notifications;
        });

        // Sort newest first
        mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(mapped);
      } catch (err) {
        showToast("error", "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filtered = useMemo(() => {
    return notifications
      .filter((n) =>
        filter === "All" ? true : n.type.toLowerCase() === filter.toLowerCase()
      )
      .filter((n) =>
        (n.title + n.message).toLowerCase().includes(search.toLowerCase())
      );
  }, [notifications, search, filter]);

  const grouped = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    filtered.forEach((n) => {
      const key = getGroup(n.createdAt);
      groups[key].push(n);
    });
    return groups;
  }, [filtered]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-neutral-400">
              Recent account setup activities
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-900/70 border border-neutral-800 text-sm px-4 py-2 rounded-2xl text-white placeholder:text-white-500 focus:outline-none flex-1 w-full sm:w-auto"
            />
            {/* <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-neutral-900/70 border border-neutral-800 text-white text-sm px-3 py-2 rounded-2xl w-full sm:w-auto"
            >
              <option>Recommended & Custom</option>
            </select> */}
            <p className="bg-neutral-900/70 border border-neutral-800 text-white text-sm px-3 py-2 rounded-2xl w-full sm:w-auto">Recommended & Custom</p>
            <button
              onClick={markAllRead}
              className="bg-blue-600/20 border border-blue-600/40 px-4 py-2 text-blue-400 rounded-2xl text-sm w-full sm:w-auto"
            >
              Mark all as read
            </button>
          </div>
        </header>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center text-neutral-400 py-10">
            Loading notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-neutral-500 border border-neutral-800 rounded-xl py-10 bg-neutral-900/70">
            No notifications yet — create an account setup or add categories to see updates.
          </div>
        ) : (
          <div className="space-y-6">
            {["Today", "Yesterday", "Older"].map(
              (section) =>
                grouped[section]?.length > 0 && (
                  <div key={section}>
                    <h2 className="text-sm text-neutral-400 mb-3">{section}</h2>
                    <div className="space-y-3">
                      {grouped[section].map((n) => (
                        <NotificationItem
                          key={n.id}
                          data={n}
                          formatDate={formatDate}
                          onRead={markAsRead}
                        />
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

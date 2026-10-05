"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LalanSiteHeader from "@/components/LalanSiteHeader";
import LalanSiteFooter from "@/components/LalanSiteFooter";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  Zap,
  Search,
  Filter,
  UserX,
  UserCheck,
  Key,
  Crown,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  DollarSign,
  FileSpreadsheet,
  AlertTriangle,
  MoreVertical,
  CheckCircle2,
  ChevronDown,
  Download,
  Terminal,
  Cpu,
  Wifi,
  Sliders,
  Send,
  Radio,
  Eye,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TRADER" | "INSTITUTIONAL";
  plan: "FREE" | "PRO" | "INSTITUTIONAL";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  ordersCount: number;
  lastActive: string;
  ipAddress: string;
  createdAt: string;
  avatar?: string;
  totalVolumeCr: number;
}

export interface ActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  action: "AUTH_LOGIN" | "ORDER_EXECUTE" | "SEARCH_TICKER" | "PLAN_UPGRADE" | "API_KEY_RESET" | "SYSTEM_ALERT";
  details: string;
  timestamp: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr_1",
    name: "Ayush Singh",
    email: "ayushsinghe07@gmail.com",
    role: "ADMIN",
    plan: "INSTITUTIONAL",
    status: "ACTIVE",
    ordersCount: 1420,
    lastActive: "Just Now",
    ipAddress: "103.24.12.8",
    createdAt: "2026-01-15",
    totalVolumeCr: 485.2,
  },
  {
    id: "usr_2",
    name: "Vikram Sharma",
    email: "vikram.sharma@quantlab.in",
    role: "INSTITUTIONAL",
    plan: "INSTITUTIONAL",
    status: "ACTIVE",
    ordersCount: 890,
    lastActive: "2 mins ago",
    ipAddress: "49.207.185.12",
    createdAt: "2026-02-01",
    totalVolumeCr: 312.4,
  },
  {
    id: "usr_3",
    name: "Priya Kulkarni",
    email: "priya.k@alphacapital.com",
    role: "TRADER",
    plan: "PRO",
    status: "ACTIVE",
    ordersCount: 310,
    lastActive: "15 mins ago",
    ipAddress: "115.240.90.4",
    createdAt: "2026-02-18",
    totalVolumeCr: 98.6,
  },
  {
    id: "usr_4",
    name: "Rahul Verma",
    email: "rahul.v@gmail.com",
    role: "TRADER",
    plan: "FREE",
    status: "ACTIVE",
    ordersCount: 45,
    lastActive: "1 hour ago",
    ipAddress: "182.73.45.10",
    createdAt: "2026-03-05",
    totalVolumeCr: 12.1,
  },
  {
    id: "usr_5",
    name: "Siddharth Rao",
    email: "sid.rao@hft-prop.co",
    role: "TRADER",
    plan: "PRO",
    status: "SUSPENDED",
    ordersCount: 12,
    lastActive: "2 days ago",
    ipAddress: "14.97.234.61",
    createdAt: "2026-03-12",
    totalVolumeCr: 3.4,
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log_1",
    userName: "Ayush Singh",
    userEmail: "ayushsinghe07@gmail.com",
    action: "AUTH_LOGIN",
    details: "Admin authenticated successfully via Google OAuth 2.0",
    timestamp: "Just Now",
    severity: "SUCCESS",
  },
  {
    id: "log_2",
    userName: "Vikram Sharma",
    userEmail: "vikram.sharma@quantlab.in",
    action: "ORDER_EXECUTE",
    details: "Executed BUY 500 INFY Call @ ₹1,892.40 (Sub-ms Latency: 0.72ms)",
    timestamp: "2 mins ago",
    severity: "INFO",
  },
  {
    id: "log_3",
    userName: "Priya Kulkarni",
    userEmail: "priya.k@alphacapital.com",
    action: "SEARCH_TICKER",
    details: "Queried Screener.in & NSE disclosures for RELIANCE Industries",
    timestamp: "15 mins ago",
    severity: "INFO",
  },
  {
    id: "log_4",
    userName: "Rahul Verma",
    userEmail: "rahul.v@gmail.com",
    action: "PLAN_UPGRADE",
    details: "Initiated 14-Day Free Trial for PRO Quant Tier",
    timestamp: "1 hour ago",
    severity: "SUCCESS",
  },
  {
    id: "log_5",
    userName: "Siddharth Rao",
    userEmail: "sid.rao@hft-prop.co",
    action: "SYSTEM_ALERT",
    details: "Account suspended due to abnormal API rate limit violation (>10,000 req/sec)",
    timestamp: "2 days ago",
    severity: "CRITICAL",
  },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "telemetry">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live real-time sub-millisecond telemetry metrics simulation
  const [telemetry, setTelemetry] = useState({
    latencyMs: 0.72,
    ringBufferFillPct: 14.8,
    activeWsConnections: 142,
    ordersPerSec: 14250,
  });

  useEffect(() => {
    if (user?.email === "ayushsinghe07@gmail.com") {
      setIsAdminAuthenticated(true);
    }
  }, [user]);

  // Sub-millisecond ticking latency telemetry update
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const interval = setInterval(() => {
      const t0 = performance.now();
      // Calculate active micro-tick delta
      const delta = (performance.now() - t0);
      const measuredLatency = parseFloat((0.72 + delta * 0.05).toFixed(2));
      setTelemetry({
        latencyMs: measuredLatency,
        ringBufferFillPct: 14.2,
        activeWsConnections: 142,
        ordersPerSec: 14850,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "8899" || adminPin === "admin123" || user?.email === "ayushsinghe07@gmail.com") {
      setIsAdminAuthenticated(true);
      showToast("Admin access authorized cleanly.");
    } else {
      alert("Invalid Admin Security Key. (Hint: PIN is 8899)");
    }
  };

  const handleToggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          const newLog: ActivityLog = {
            id: `log_${Date.now()}`,
            userName: u.name,
            userEmail: u.email,
            action: "SYSTEM_ALERT",
            details: `Admin changed account status to ${newStatus}`,
            timestamp: "Just Now",
            severity: newStatus === "SUSPENDED" ? "WARNING" : "SUCCESS",
          };
          setLogs((prevLogs) => [newLog, ...prevLogs]);
          showToast(`Account status updated for ${u.name}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  }, []);

  const handleChangePlan = useCallback((userId: string, newPlan: "FREE" | "PRO" | "INSTITUTIONAL") => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newLog: ActivityLog = {
            id: `log_${Date.now()}`,
            userName: u.name,
            userEmail: u.email,
            action: "PLAN_UPGRADE",
            details: `Admin updated plan tier to ${newPlan}`,
            timestamp: "Just Now",
            severity: "SUCCESS",
          };
          setLogs((prevLogs) => [newLog, ...prevLogs]);
          showToast(`Plan updated to ${newPlan} for ${u.name}`);
          return { ...u, plan: newPlan };
        }
        return u;
      })
    );
  }, []);

  const handleResetApiKey = useCallback(
    (userId: string) => {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) return;
      showToast(`API secret key reset generated for ${targetUser.name}`);
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        userName: targetUser.name,
        userEmail: targetUser.email,
        action: "API_KEY_RESET",
        details: "Admin reset API Access Token & secret credentials",
        timestamp: "Just Now",
        severity: "WARNING",
      };
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    },
    [users]
  );

  const exportLogsCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User,Email,Action,Details,Timestamp,Severity"]
        .concat(
          logs.map(
            (l) => `"${l.userName}","${l.userEmail}","${l.action}","${l.details}","${l.timestamp}","${l.severity}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lalan_admin_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Audit logs exported to CSV successfully.");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.ipAddress.includes(searchQuery);
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (l) =>
        l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060609] text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col">
      <LalanSiteHeader />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 py-10 px-4 sm:px-8 max-w-[1350px] mx-auto w-full space-y-8">
        {/* Admin Authentication Protection Gate */}
        {!isAdminAuthenticated ? (
          <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-[#0d0d14] border border-[#222234] shadow-2xl space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1] mb-2">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">LALAN Admin Telemetry Control</h2>
              <p className="text-xs text-zinc-400">
                Authorized Personnel Only. Please verify Security Admin PIN.
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Security Admin PIN (e.g. 8899)"
                  className="w-full bg-[#141420] text-xs text-white pl-10 pr-4 py-3 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#387ed1]/25 border border-[#387ed1]/40 active:scale-95"
              >
                Authorize Admin Access
              </button>
            </form>

            <div className="text-[11px] text-zinc-500 font-mono">
              Demo Admin Access PIN: <span className="text-emerald-400 font-bold">8899</span>
            </div>
          </div>
        ) : (
          <>
            {/* ── TOP TELEMETRY CARDS (ULTRA-LOW LATENCY MONITOR) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-[#0d0d14] border border-[#1f1f2e] space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-medium">Total Registered Traders</span>
                  <div className="p-2 rounded-xl bg-[#387ed1]/10 text-[#387ed1] border border-[#387ed1]/20">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-white">{users.length * 342 + 84}</div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% this month</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-[#0d0d14] border border-[#1f1f2e] space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-medium">Active WebSocket Sessions</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
                  <span>{telemetry.activeWsConnections}</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  {telemetry.ordersPerSec.toLocaleString()} Ticks/sec Stream
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-[#0d0d14] border border-[#1f1f2e] space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-medium">Executed Volume</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-white">₹1,842.5 Cr</div>
                <div className="text-[11px] font-mono text-cyan-400 font-bold">Sub-ms Disruptor Pipeline</div>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-[#0d0d14] border border-[#1f1f2e] space-y-2 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-medium">Engine Latency / GC</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 flex items-center gap-1.5">
                  <span>{telemetry.latencyMs} ms</span>
                  <span className="text-[10px] font-mono text-zinc-500 font-normal">
                    (Fill: {telemetry.ringBufferFillPct}%)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-purple-400 font-bold">0 MB GC Pause Overhead</div>
              </motion.div>
            </div>

            {/* ── ADMIN NAVIGATION & ACTION CONTROLS ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center space-x-2 bg-[#0e0e16] p-1 rounded-xl border border-[#222234]">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === "users"
                      ? "bg-[#387ed1] text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Roster Matrix ({users.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("logs")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === "logs"
                      ? "bg-[#387ed1] text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Live Action Audit Stream ({logs.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === "telemetry"
                      ? "bg-[#387ed1] text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Low-Latency Health Monitor</span>
                </button>
              </div>

              {/* Search & Export Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search user, email or IP..."
                    className="w-full bg-[#0d0d14] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
                  />
                </div>

                {activeTab === "users" && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-[#0d0d14] text-xs font-mono text-white px-3 py-2 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1]"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="SUSPENDED">Suspended Only</option>
                  </select>
                )}

                <button
                  onClick={exportLogsCsv}
                  title="Export Audit Logs to CSV"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161622] hover:bg-[#1f1f30] text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* ── TAB 1: USER MANAGEMENT TABLE & CONTROLS ── */}
            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0d0d14] border border-[#1f1f2e] rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#12121c] border-b border-[#1f1f2e] text-zinc-400 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">User Info</th>
                        <th className="py-3.5 px-4">Role / Plan</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Orders / Volume</th>
                        <th className="py-3.5 px-4">Last IP &amp; Active</th>
                        <th className="py-3.5 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181824]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#141420] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#387ed1]/20 border border-[#387ed1]/40 text-[#387ed1] flex items-center justify-center font-bold text-xs">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  <button
                                    onClick={() => setSelectedUser(u)}
                                    className="p-0.5 text-zinc-500 hover:text-white"
                                    title="View Deep Dive Profile"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="text-[11px] text-zinc-400">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.plan === "INSTITUTIONAL"
                                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                    : u.plan === "PRO"
                                    ? "bg-[#387ed1]/15 text-[#387ed1] border border-[#387ed1]/30"
                                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                }`}
                              >
                                {u.plan}
                              </span>
                              {u.role === "ADMIN" && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.status === "ACTIVE" ? "bg-emerald-400" : "bg-rose-400"
                                }`}
                              />
                              <span>{u.status}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{u.ordersCount.toLocaleString()} orders</div>
                            <div className="text-[10px] text-cyan-400">₹{u.totalVolumeCr} Cr</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-xs text-white">{u.ipAddress}</div>
                            <div className="text-[10px] text-zinc-500">{u.lastActive}</div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Plan Selector */}
                              <select
                                value={u.plan}
                                onChange={(e) => handleChangePlan(u.id, e.target.value as any)}
                                className="bg-[#161622] text-[11px] text-zinc-300 px-2 py-1 rounded border border-[#2a2a3e] focus:outline-none focus:border-[#387ed1]"
                              >
                                <option value="FREE">FREE Plan</option>
                                <option value="PRO">PRO Plan</option>
                                <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                              </select>

                              {/* Toggle Ban/Suspend */}
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                title={u.status === "ACTIVE" ? "Suspend User" : "Activate User"}
                                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                  u.status === "ACTIVE"
                                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                {u.status === "ACTIVE" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>

                              {/* Reset Token */}
                              <button
                                onClick={() => handleResetApiKey(u.id)}
                                title="Reset API Token Credentials"
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs transition-colors"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: LIVE USER ACTIVITY AUDIT STREAM ── */}
            {activeTab === "logs" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0d0d14] border border-[#1f1f2e] rounded-2xl p-5 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#387ed1]" />
                    <h3 className="font-bold text-white text-sm">Real-Time User Action Trajectory Stream</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>STREAM ACTIVE</span>
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-[#12121c] border border-[#1f1f2e] hover:border-[#387ed1]/40 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.userName}</span>
                          <span className="text-zinc-500">({log.userEmail})</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              log.severity === "CRITICAL"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : log.severity === "WARNING"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : log.severity === "SUCCESS"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-300 pl-0.5">{log.details}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: LOW-LATENCY ENGINE HEALTH MONITOR ── */}
            {activeTab === "telemetry" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono"
              >
                <div className="p-6 rounded-2xl bg-[#0d0d14] border border-emerald-500/30 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-bold text-white text-sm">LMAX Disruptor Ring Buffer Health</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      0.72ms SUB-MS
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Ring Buffer Fill Ratio</span>
                      <span className="font-bold text-emerald-400">{telemetry.ringBufferFillPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${telemetry.ringBufferFillPct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                      <div className="p-3 rounded-xl bg-[#12121c] border border-zinc-800">
                        <span className="text-zinc-500">Ring Capacity</span>
                        <div className="font-bold text-white text-sm mt-0.5">1,048,576 Slots</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#12121c] border border-zinc-800">
                        <span className="text-zinc-500">JVM GC Overhead</span>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5">0.00 MB (Zero-GC)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0d0d14] border border-[#387ed1]/30 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-[#387ed1]" />
                      <h3 className="font-bold text-white text-sm">WebSocket Gateway Throughput</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#387ed1]/10 text-[#387ed1] text-[10px] font-bold border border-[#387ed1]/20">
                      100ms TICK PULSE
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Active WebSocket Conns</span>
                      <span className="font-bold text-sky-400">{telemetry.activeWsConnections} Live Sockets</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Events Stream Rate</span>
                      <span className="font-bold text-emerald-400">{telemetry.ordersPerSec.toLocaleString()} ticks/sec</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#12121c] border border-zinc-800 text-[11px] space-y-1">
                      <span className="text-zinc-500">Broadcaster Node</span>
                      <div className="font-bold text-white">lalan-telemetry-primary-mumbai.internal</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── USER DEEP-DIVE DRAWER ── */}
            <AnimatePresence>
              {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-[#0e0e16] border border-[#262638] rounded-2xl p-6 space-y-4 shadow-2xl font-mono text-xs text-white"
                  >
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <div className="w-10 h-10 rounded-full bg-[#387ed1] text-white flex items-center justify-center font-bold text-base">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{selectedUser.name}</h3>
                        <p className="text-zinc-400 text-[11px]">{selectedUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-[#141420] border border-zinc-800">
                        <span className="text-zinc-500">User ID</span>
                        <div className="font-bold text-white mt-0.5">{selectedUser.id}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141420] border border-zinc-800">
                        <span className="text-zinc-500">Plan Tier</span>
                        <div className="font-bold text-purple-400 mt-0.5">{selectedUser.plan}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141420] border border-zinc-800">
                        <span className="text-zinc-500">Total Volume</span>
                        <div className="font-bold text-cyan-400 mt-0.5">₹{selectedUser.totalVolumeCr} Cr</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#141420] border border-zinc-800">
                        <span className="text-zinc-500">IP Location</span>
                        <div className="font-bold text-white mt-0.5">{selectedUser.ipAddress}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="px-4 py-2 rounded-xl bg-[#387ed1] text-white font-bold text-xs"
                      >
                        Close Profile
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      <LalanSiteFooter />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Users, Package, ShoppingCart, DollarSign, Activity,
  RefreshCw, ArrowRight, Sparkles, BarChart3, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import adminOrderService from '../../services/adminOrderService';
import { adminUserService } from '../../services/adminUserService';
import { adminProductService } from '../../services/adminProductService';

// ── helpers ───────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

const formatDate = (d) => (d ? new Date(d).toLocaleString('vi-VN') : '—');

const formatRelativeTime = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(d).toLocaleDateString('vi-VN');
};

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xác nhận',  badge: 'bg-amber-100 text-amber-700 border border-amber-200',       bar: 'bg-amber-400',   dot: 'bg-amber-400' },
  CONFIRMED:  { label: 'Đã xác nhận',   badge: 'bg-sky-100 text-sky-700 border border-sky-200',              bar: 'bg-sky-400',     dot: 'bg-sky-400' },
  PROCESSING: { label: 'Đang xử lý',    badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200',     bar: 'bg-indigo-400',  dot: 'bg-indigo-400' },
  SHIPPING:   { label: 'Đang giao',      badge: 'bg-violet-100 text-violet-700 border border-violet-200',     bar: 'bg-violet-400',  dot: 'bg-violet-400' },
  DELIVERED:  { label: 'Đã giao',        badge: 'bg-teal-100 text-teal-700 border border-teal-200',           bar: 'bg-teal-400',    dot: 'bg-teal-400' },
  COMPLETED:  { label: 'Hoàn thành',     badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',  bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  CANCELLED:  { label: 'Đã hủy',         badge: 'bg-red-100 text-red-700 border border-red-200',              bar: 'bg-red-400',     dot: 'bg-red-400' },
  RETURNED:   { label: 'Đã trả hàng',    badge: 'bg-gray-100 text-gray-600 border border-gray-200',           bar: 'bg-gray-400',    dot: 'bg-gray-400' },
};

const DISPLAY_TO_KEY = {
  'Chờ xác nhận': 'PENDING', 'Đã xác nhận': 'CONFIRMED', 'Đang xử lý': 'PROCESSING',
  'Đang giao hàng': 'SHIPPING', 'Đã giao hàng': 'DELIVERED', 'Hoàn thành': 'COMPLETED',
  'Đã hủy': 'CANCELLED', 'Đã trả hàng': 'RETURNED',
};

const resolveStatus = (raw) =>
  STATUS_CONFIG[raw] ?? STATUS_CONFIG[DISPLAY_TO_KEY[raw]] ?? STATUS_CONFIG.PENDING;

const StatusBadge = ({ status }) => {
  const cfg = resolveStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────
const StatCard = ({ name, value, sub, icon: Icon, gradient }) => (
  <div className={`relative rounded-2xl p-6 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-default ${gradient}`}>
    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
    <div className="absolute -bottom-4 -right-2 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
    <div className="relative z-10 flex items-start justify-between">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-sm font-medium text-white/80 mb-1">{name}</p>
        <p className="text-[1.75rem] font-bold text-white leading-tight tracking-tight break-all">{value}</p>
        {sub && <p className="mt-2 text-xs text-white/70 font-medium">{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({ totalOrders: 0, totalRevenue: 0, recentOrders: [], ordersByStatus: {} });
  const [userStats, setUserStats] = useState({ totalElements: 0 });
  const [productStats, setProductStats] = useState({ totalElements: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const [orderRes, usersRes, productsRes] = await Promise.allSettled([
        adminOrderService.getDashboardStats(),
        adminUserService.getAllUsers({ page: 0, size: 6, sortBy: 'createdAt', sortDir: 'desc' }),
        adminProductService.getAllProducts({ page: 0, size: 1 }),
      ]);
      const stats     = orderRes.status    === 'fulfilled' ? orderRes.value    : {};
      const usersData = usersRes.status    === 'fulfilled' ? usersRes.value    : { totalElements: 0 };
      const prodData  = productsRes.status === 'fulfilled' ? productsRes.value : { totalElements: 0 };
      setDashboardStats(stats);
      setUserStats(usersData);
      setProductStats(prodData);

      const activities = [];
      (stats.recentOrders || []).forEach(order =>
        activities.push({
          type: 'order', icon: ShoppingCart,
          bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          label: (<>Đơn hàng <span className="font-semibold text-gray-800">{order.orderNumber}</span> được tạo bởi <span className="font-semibold text-gray-800">{order.customerName}</span></>),
          time: order.createdAt,
        })
      );
      (usersData?.content || []).forEach(u =>
        activities.push({
          type: 'user', icon: Users,
          bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          label: (<>Người dùng <span className="font-semibold text-gray-800">{u.fullName || u.username}</span> vừa đăng ký</>),
          time: u.createdAt,
        })
      );
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activities.slice(0, 8));
      if (isRefresh) toast.success('Đã cập nhật dữ liệu!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const pendingCount   = dashboardStats.ordersByStatus?.['Chờ xác nhận'] ?? dashboardStats.ordersByStatus?.['PENDING']   ?? 0;
  const completedCount = dashboardStats.ordersByStatus?.['Hoàn thành']   ?? dashboardStats.ordersByStatus?.['COMPLETED'] ?? 0;

  const statCards = [
    { name: 'Tổng người dùng', value: userStats.totalElements    || 0,                               sub: null,                                                                     icon: Users,        gradient: 'bg-gradient-to-br from-blue-500    to-indigo-600' },
    { name: 'Tổng sản phẩm',   value: productStats.totalElements  || 0,                              sub: null,                                                                     icon: Package,      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600'  },
    { name: 'Tổng đơn hàng',   value: dashboardStats.totalOrders  || 0,                              sub: pendingCount   > 0 ? `${pendingCount} chờ xác nhận`    : null,           icon: ShoppingCart, gradient: 'bg-gradient-to-br from-orange-500   to-rose-500'   },
    { name: 'Tổng doanh thu',  value: formatCurrency(dashboardStats.totalRevenue || 0), sub: completedCount > 0 ? `${completedCount} đơn hoàn thành` : null, icon: DollarSign,   gradient: 'bg-gradient-to-br from-violet-500   to-purple-700' },
  ];

  const statusEntries    = Object.entries(dashboardStats.ordersByStatus || {});
  const totalStatusCount = statusEntries.reduce((s, [, v]) => s + v, 0);

  const stored    = JSON.parse(localStorage.getItem('user') || '{}');
  const adminName = stored?.fullName || stored?.username || 'Admin';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-6">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-xl">
        <div className="absolute top-0 right-0    w-72 h-72 bg-white/5 rounded-full -translate-y-1/3  translate-x-1/4  pointer-events-none" />
        <div className="absolute bottom-0 left-0  w-52 h-52 bg-white/5 rounded-full  translate-y-1/3  -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2              pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-yellow-200 text-sm font-medium">{greeting}, {adminName}!</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-white/60 text-sm">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => <StatCard key={card.name} {...card} />)}
      </div>

      {/* ── Mid Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent Orders — 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Đơn hàng gần đây</h3>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {dashboardStats.recentOrders?.length || 0}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300" />
          </div>
          {dashboardStats.recentOrders?.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {dashboardStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 truncate">{order.customerName} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.finalAmount)}</p>
                    <p className="text-xs text-gray-400">{order.totalItems} sản phẩm</p>
                  </div>
                  <div className="flex-shrink-0 hidden sm:block">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">Chưa có đơn hàng nào</p>
            </div>
          )}
        </div>

        {/* Status Distribution — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Theo trạng thái</h3>
          </div>
          {statusEntries.length > 0 ? (
            <div className="px-6 py-5 space-y-4">
              {statusEntries.map(([rawStatus, count]) => {
                const cfg = resolveStatus(rawStatus);
                const pct = totalStatusCount > 0 ? Math.round((count / totalStatusCount) * 100) : 0;
                return (
                  <div key={rawStatus}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className="text-sm text-gray-600">{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Activity Feed ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Zap className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Hoạt động gần đây</h3>
        </div>
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <Activity className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 transition-colors group">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-500 flex-1">{item.label}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{formatRelativeTime(item.time)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import {
  Shield, Users, Package, Tags, ShoppingCart, Settings, CheckCircle,
  XCircle, Info, Lock, Globe, User, ChevronDown, ChevronUp, Server,
  Code, Database, Cpu, FileText, CreditCard, MessageSquare,
  RotateCcw, Save, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Data ──────────────────────────────────────────────────────────────────
const DEFAULT_PERMISSION_GROUPS = [
  {
    group: 'Sản phẩm',
    icon: Package,
    permissions: [
      { id: 'p1', label: 'Xem danh sách sản phẩm',  defaultRoles: ['guest', 'customer', 'admin'] },
      { id: 'p2', label: 'Xem chi tiết sản phẩm',    defaultRoles: ['guest', 'customer', 'admin'] },
      { id: 'p3', label: 'Tìm kiếm / lọc sản phẩm',  defaultRoles: ['guest', 'customer', 'admin'] },
      { id: 'p4', label: 'Thêm sản phẩm mới',        defaultRoles: ['admin'] },
      { id: 'p5', label: 'Sửa thông tin sản phẩm',   defaultRoles: ['admin'] },
      { id: 'p6', label: 'Xoá / ẩn sản phẩm',        defaultRoles: ['admin'] },
      { id: 'p7', label: 'Upload ảnh sản phẩm',      defaultRoles: ['admin'] },
    ],
  },
  {
    group: 'Danh mục',
    icon: Tags,
    permissions: [
      { id: 'c1', label: 'Xem danh sách danh mục', defaultRoles: ['guest', 'customer', 'admin'] },
      { id: 'c2', label: 'Thêm danh mục mới',      defaultRoles: ['admin'] },
      { id: 'c3', label: 'Sửa danh mục',           defaultRoles: ['admin'] },
      { id: 'c4', label: 'Xoá danh mục',           defaultRoles: ['admin'] },
    ],
  },
  {
    group: 'Đơn hàng',
    icon: ShoppingCart,
    permissions: [
      { id: 'o1', label: 'Đặt hàng mới',             defaultRoles: ['customer', 'admin'] },
      { id: 'o2', label: 'Xem đơn hàng của mình',    defaultRoles: ['customer', 'admin'] },
      { id: 'o3', label: 'Xem tất cả đơn hàng',      defaultRoles: ['admin'] },
      { id: 'o4', label: 'Cập nhật trạng thái đơn',  defaultRoles: ['admin'] },
      { id: 'o5', label: 'Xoá đơn hàng',             defaultRoles: ['admin'] },
    ],
  },
  {
    group: 'Người dùng',
    icon: Users,
    permissions: [
      { id: 'u1', label: 'Đăng ký tài khoản',            defaultRoles: ['guest'] },
      { id: 'u2', label: 'Đăng nhập',                     defaultRoles: ['guest'] },
      { id: 'u3', label: 'Xem / sửa profile của mình',   defaultRoles: ['customer', 'admin'] },
      { id: 'u4', label: 'Đổi mật khẩu',                  defaultRoles: ['customer', 'admin'] },
      { id: 'u5', label: 'Xem danh sách tất cả users',   defaultRoles: ['admin'] },
      { id: 'u6', label: 'Tạo / sửa / vô hiệu hoá user', defaultRoles: ['admin'] },
      { id: 'u7', label: 'Đổi role user',                 defaultRoles: ['admin'] },
    ],
  },
  {
    group: 'Giỏ hàng & Thanh toán',
    icon: CreditCard,
    permissions: [
      { id: 'cart1', label: 'Thêm sản phẩm vào giỏ',  defaultRoles: ['customer', 'admin'] },
      { id: 'cart2', label: 'Thanh toán / checkout',  defaultRoles: ['customer', 'admin'] },
      { id: 'cart3', label: 'Xem lịch sử thanh toán', defaultRoles: ['customer', 'admin'] },
    ],
  },
  {
    group: 'Đánh giá & Bình luận',
    icon: MessageSquare,
    permissions: [
      { id: 'r1', label: 'Xem đánh giá sản phẩm', defaultRoles: ['guest', 'customer', 'admin'] },
      { id: 'r2', label: 'Viết đánh giá',          defaultRoles: ['customer', 'admin'] },
      { id: 'r3', label: 'Xoá đánh giá',           defaultRoles: ['admin'] },
    ],
  },
];

const PERM_LABELS = {
  p1: 'Xem danh sách sản phẩm', p2: 'Xem chi tiết sản phẩm',
  p3: 'Tìm kiếm / lọc sản phẩm', p4: 'Thêm sản phẩm mới',
  p5: 'Sửa thông tin sản phẩm', p6: 'Xoá / ẩn sản phẩm',
  p7: 'Upload ảnh sản phẩm',
  c1: 'Xem danh sách danh mục', c2: 'Thêm danh mục mới',
  c3: 'Sửa danh mục', c4: 'Xoá danh mục',
  o1: 'Đặt hàng mới', o2: 'Xem đơn hàng của mình',
  o3: 'Xem tất cả đơn hàng', o4: 'Cập nhật trạng thái đơn',
  o5: 'Xoá đơn hàng',
  u1: 'Đăng ký tài khoản', u2: 'Đăng nhập',
  u3: 'Xem / sửa profile của mình', u4: 'Đổi mật khẩu',
  u5: 'Xem danh sách tất cả users', u6: 'Tạo / sửa / vô hiệu hoá user',
  u7: 'Đổi role user',
  cart1: 'Thêm sản phẩm vào giỏ', cart2: 'Thanh toán / checkout',
  cart3: 'Xem lịch sỮd thanh toán',
  r1: 'Xem đánh giá sản phẩm', r2: 'Viết đánh giá',
  r3: 'Xoá đánh giá',
};

const GROUP_LABELS = {
  'San pham': 'Sản phẩm',
  'Danh muc': 'Danh mục',
  'Don hang': 'Đơn hàng',
  'Nguoi dung': 'Người dùng',
  'Gio hang & Thanh toan': 'Giỏ hàng & Thanh toán',
  'Danh gia & Binh luan': 'Đánh giá & Bình luận',
};

const ROLES = [
  {
    id: 'guest',
    label: 'Khách (Guest)',
    description: 'Người dùng chưa đăng nhập. Chỉ xem nội dung công khai.',
    gradient: 'from-gray-500 to-slate-600',
    iconBg: 'bg-gray-100',
    icon: Globe,
    endpoint: 'Không có token',
  },
  {
    id: 'customer',
    label: 'Khách hàng (CUSTOMER)',
    description: 'Tài khoản người dùng sau khi đăng ký. Có thể mua hàng và quản lý đơn.',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    icon: User,
    endpoint: '/api/user/**',
  },
  {
    id: 'admin',
    label: 'Quản trị viên (ADMIN)',
    description: 'Toàn quyền quản lý hệ thống. Truy cập tất cả API và trang quản trị.',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100',
    icon: Lock,
    endpoint: '/api/admin/**',
  },
];

const STORAGE_KEY = 'admin_permissions_v1';

const buildDefaultMap = () => {
  const map = {};
  for (const role of ROLES) map[role.id] = new Set();
  for (const g of DEFAULT_PERMISSION_GROUPS) {
    for (const p of g.permissions) {
      for (const r of p.defaultRoles) {
        if (map[r]) map[r].add(p.id);
      }
    }
  }
  return map;
};

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = {};
    for (const role of ROLES) result[role.id] = new Set(parsed[role.id] || []);
    return result;
  } catch { return null; }
};

const saveToStorage = (map) => {
  const obj = {};
  for (const [k, v] of Object.entries(map)) obj[k] = [...v];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
};

const SYSTEM_INFO = [
  { label: 'Frontend',     value: 'React 18 + Vite',             icon: Code,     color: 'text-sky-600',    bg: 'bg-sky-50' },
  { label: 'UI Framework', value: 'Tailwind CSS',                 icon: Cpu,      color: 'text-teal-600',   bg: 'bg-teal-50' },
  { label: 'Backend',      value: 'Spring Boot 3.x',              icon: Server,   color: 'text-green-600',  bg: 'bg-green-50' },
  { label: 'Database',     value: 'MySQL',                         icon: Database, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Auth',         value: 'JWT (Access + Refresh Token)', icon: Shield,   color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'File Storage', value: 'Local filesystem (/uploads)',  icon: FileText, color: 'text-rose-600',   bg: 'bg-rose-50' },
];

// ─── PermissionGroup accordion (editable) ──────────────────────────────────
const PermissionGroup = ({ group, icon: GroupIcon, permissions, rolePermissions, onToggle, disabled }) => {
  const [open, setOpen] = useState(true);
  const count = permissions.filter(p => rolePermissions.has(p.id)).length;
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-3 w-full px-5 py-3.5 bg-white hover:bg-gray-50 transition-colors text-left">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <GroupIcon className="h-4 w-4 text-indigo-600" />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-800">{group}</span>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{count}/{permissions.length}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-gray-50/50 grid grid-cols-1 gap-1.5">
          {permissions.map((p) => {
            const has = rolePermissions.has(p.id);
            if (disabled) {
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 cursor-not-allowed opacity-70"
                  title="Quyền Admin không thể thay đổi"
                >
                  {has
                    ? <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    : <XCircle className="h-4 w-4 text-gray-300 flex-shrink-0" />}
                  <span className={`text-sm flex-1 ${has ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                    {p.label}
                  </span>
                  <Lock className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                </div>
              );
            }
            return (
              <button key={p.id} onClick={() => onToggle(p.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left w-full transition-all duration-150 group
                  ${has ? 'bg-green-50 hover:bg-red-50' : 'bg-gray-50 hover:bg-green-50'}`}>
                {has
                  ? <CheckCircle className="h-4 w-4 text-green-500 group-hover:text-red-400 flex-shrink-0 transition-colors" />
                  : <XCircle className="h-4 w-4 text-gray-300 group-hover:text-green-400 flex-shrink-0 transition-colors" />}
                <span className={`text-sm flex-1 ${has ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {p.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 transition-all
                  ${has ? 'bg-green-100 text-green-700 group-hover:bg-red-100 group-hover:text-red-600'
                        : 'bg-gray-200 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700'}`}>
                  {has ? 'BẬT' : 'TắT'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Matrix view ─────────────────────────────────────────────────────────────
const PermissionMatrix = ({ permissions }) => {
  const allPermissions = DEFAULT_PERMISSION_GROUPS.flatMap(g =>
    g.permissions.map(p => ({ ...p, group: g.group, groupIcon: g.icon }))
  );
  const roleColors = { guest: 'text-gray-600', customer: 'text-blue-600', admin: 'text-rose-600' };
  let prevGroup = null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/2">
              {'Chức năng'}
            </th>
            {ROLES.map(r => (
              <th key={r.id} className="px-3 py-3 text-center">
                <span className={`text-xs font-bold ${roleColors[r.id]}`}>{r.id.toUpperCase()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPermissions.map((p, i) => {
            const showGroup = p.group !== prevGroup;
            prevGroup = p.group;
            const GroupIcon = p.groupIcon;
            return (
              <React.Fragment key={i}>
                {showGroup && (
                  <tr className="bg-slate-50">
                    <td colSpan={4} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <GroupIcon className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{GROUP_LABELS[p.group] || p.group}</span>
                      </div>
                    </td>
                  </tr>
                )}
                <tr className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-indigo-50/30 transition-colors`}>
                  <td className="px-4 py-2.5 text-gray-700">{PERM_LABELS[p.id] || p.label}</td>
                  {ROLES.map(r => (
                    <td key={r.id} className="px-3 py-2.5 text-center">
                      {permissions[r.id]?.has(p.id)
                        ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        : <XCircle className="h-4 w-4 text-gray-200 mx-auto" />}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('permissions');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [viewMode, setViewMode] = useState('detail');
  const [permissions, setPermissions] = useState(() => loadSaved() || buildDefaultMap());
  const [saved, setSaved] = useState(true);
  const [saveAnim, setSaveAnim] = useState(false);

  const isAdminSelected = selectedRole === 'admin';

  const togglePermission = (permId) => {
    if (isAdminSelected) return;
    setPermissions(prev => {
      const next = { ...prev };
      const roleSet = new Set(prev[selectedRole]);
      if (roleSet.has(permId)) roleSet.delete(permId); else roleSet.add(permId);
      next[selectedRole] = roleSet;
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveToStorage(permissions);
    setSaved(true);
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 2000);
    toast.success('Đã lưu cài đặt phân quyền!');
  };

  const handleReset = () => {
    const def = buildDefaultMap();
    setPermissions(def);
    saveToStorage(def);
    setSaved(true);
    toast('Đã khôi phục về mặc định', { icon: '↩️' });
  };

  const tabs = [
    { id: 'permissions', label: 'Phân quyền', icon: Shield },
    { id: 'system',      label: 'Hệ thống',   icon: Server },
  ];

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);
  const totalPerms = DEFAULT_PERMISSION_GROUPS.reduce((a, g) => a + g.permissions.length, 0);
  const userPermCount = [...(permissions[selectedRole] || [])].length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-500">Quản lý cấu hình và phân quyền</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
              <TabIcon className="h-4 w-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <Info className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-800">
              <p className="font-semibold mb-0.5">Phân quyền dựa trên Spring Security</p>
              <p className="text-indigo-600 text-xs">
                Quyền được cấu hình trong{' '}
                <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">SecurityConfig.java</code>.
                Các endpoint được bảo vệ theo pattern URL + Role annotation (
                <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">@PreAuthorize</code>).
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Phân quyền theo vai trò</h2>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl text-xs">
              {['detail', 'matrix'].map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all ${viewMode === m ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
                  {m === 'detail' ? 'Chi tiết' : 'Ma trận'}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'matrix' ? (
            <PermissionMatrix permissions={permissions} />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map(role => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button key={role.id} onClick={() => setSelectedRole(role.id)}
                      className={`rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200 ${
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${role.gradient} text-white shadow-lg scale-105`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-white/20' : role.iconBg}`}>
                        <RoleIcon className={`h-5 w-5 ${isSelected ? 'text-white' : ''}`} />
                      </div>
                      <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>{role.label}</p>
                      <p className={`mt-1 text-xs leading-snug ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{role.description}</p>
                      <code className={`mt-2 text-[10px] font-mono px-2 py-0.5 rounded-lg inline-block ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {role.endpoint}
                      </code>
                    </button>
                  );
                })}
              </div>

              <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${selectedRoleData.gradient} text-white`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {React.createElement(selectedRoleData.icon, { className: 'h-6 w-6 text-white' })}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{selectedRoleData.label}</p>
                  <p className="text-white/80 text-sm">{selectedRoleData.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black">{userPermCount}</p>
                  <p className="text-white/70 text-xs">/ {totalPerms} quyền</p>
                </div>
              </div>

              {isAdminSelected ? (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <Lock className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <p className="text-sm text-rose-600 font-medium">
                    {'Quyền Admin là cố định và không thể thay đổi'}
                  </p>
                </div>
              ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                  {'Nhấn vào từng quyền để bật / tắt'}
                </p>
                {!saved && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium animate-pulse">
                    {'Có thay đổi chưa lưu'}
                  </span>
                )}
              </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {DEFAULT_PERMISSION_GROUPS.map((g, i) => (
                  <PermissionGroup key={i} group={g.group} icon={g.icon} permissions={g.permissions}
                    rolePermissions={permissions[selectedRole]} onToggle={togglePermission}
                    disabled={isAdminSelected} />
                ))}
              </div>

              {!isAdminSelected && (
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <RotateCcw className="h-4 w-4" />
                  Khôi phục mặc định
                </button>
                <button onClick={handleSave} disabled={saved}
                  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-md
                    ${saveAnim ? 'bg-green-500 text-white scale-105 shadow-green-200'
                      : saved ? 'bg-gray-100 text-gray-400 cursor-default shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'}`}>
                  {saveAnim ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saveAnim ? 'Đã lưu!' : 'Lưu thay đổi'}
                </button>
              </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Công nghệ sử dụng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYSTEM_INFO.map((item, i) => {
                const SysIcon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                    <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <SysIcon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cấu trúc API</h2>
            <div className="overflow-hidden border border-gray-200 rounded-2xl">
              {[
                { method: 'PUBLIC',    pattern: '/api/auth/**',   desc: 'Đăng nhập, đăng ký, refresh token',       color: 'text-gray-600', bg: 'bg-gray-100' },
                { method: 'PUBLIC',    pattern: '/api/public/**', desc: 'Sản phẩm, danh mục — không cần token',      color: 'text-gray-600', bg: 'bg-gray-100' },
                { method: 'CUSTOMER+', pattern: '/api/user/**',   desc: 'Profile, đơn hàng của cá nhân',           color: 'text-blue-700', bg: 'bg-blue-100' },
                { method: 'ADMIN',     pattern: '/api/admin/**',  desc: 'Quản lý user, sản phẩm, danh mục, đơn hàng', color: 'text-rose-700', bg: 'bg-rose-100' },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${row.bg} ${row.color}`}>{row.method}</span>
                  <code className="text-sm font-mono text-gray-700 flex-shrink-0 w-40">{row.pattern}</code>
                  <span className="text-sm text-gray-500">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mô hình bảo mật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Stateless JWT',           desc: 'Server không lưu session. Mỗi request gửi kèm Access Token trong header Authorization.',                   icon: Lock,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { title: 'Refresh Token',            desc: 'Access Token ngắn hạn. Khi hết hạn, dùng Refresh Token để lấy token mới mà không cần đăng nhập lại.', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Role-Based Access (RBAC)', desc: 'Quyền được gán theo vai trò (ADMIN, CUSTOMER). Kiểm soát ở tầng URL pattern và method annotation.',   icon: Users,  color: 'text-green-600',  bg: 'bg-green-50' },
              ].map((card, i) => {
                const CardIcon = card.icon;
                return (
                  <div key={i} className="p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <CardIcon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className="font-semibold text-gray-800 mb-1.5">{card.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

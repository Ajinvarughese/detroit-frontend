import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import API from '../../hooks/API';

const useApi = API();

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(useApi.url + '/user');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await axios.delete(useApi.url + `/user/${deleteModal.user.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user.id));
      showToast(`User "${deleteModal.user.fullName}" deleted successfully`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      showToast('Failed to delete user', 'error');
    } finally {
      setDeleteModal({ open: false, user: null });
    }
  };

  const handleToggleSuspend = async (user) => {
    try {
      const res = await axios.put(useApi.url + `/user/${user.id}/suspend`);
      setUsers(prev => prev.map(u => (u.id === user.id ? res.data : u)));
      showToast(
        res.data.suspended
          ? `User "${user.fullName}" has been suspended`
          : `User "${user.fullName}" has been reactivated`,
        res.data.suspended ? 'warning' : 'success'
      );
    } catch (err) {
      console.error('Failed to toggle suspend:', err);
      showToast('Failed to update user status', 'error');
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !u.suspended) ||
      (statusFilter === 'SUSPENDED' && u.suspended);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => !u.suspended).length,
    suspended: users.filter(u => u.suspended).length,
    applicants: users.filter(u => u.role === 'APPLICANT').length,
    banks: users.filter(u => u.role === 'BANK').length,
  };

  const roleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
      BANK: 'bg-sky-100 text-sky-700 border-sky-200',
      APPLICANT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const roleIcon = (role) => {
    const icons = { ADMIN: '🛡️', BANK: '🏦', APPLICANT: '👤' };
    return icons[role] || '❓';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        {/* ── Header ────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all platform users — view, suspend, or remove accounts
          </p>
        </div>

        {/* ── Stat Cards ────────────────────────── */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: '👥', gradient: 'from-blue-500 to-blue-600' },
            { label: 'Active', value: stats.active, icon: '✅', gradient: 'from-emerald-500 to-emerald-600' },
            { label: 'Suspended', value: stats.suspended, icon: '🚫', gradient: 'from-red-400 to-red-500' },
            { label: 'Applicants', value: stats.applicants, icon: '👤', gradient: 'from-violet-500 to-violet-600' },
            { label: 'Banks', value: stats.banks, icon: '🏦', gradient: 'from-sky-500 to-sky-600' },
          ].map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl shadow-md bg-white border border-gray-100 p-5 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${s.gradient}`} />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pl-3">
                {s.icon} {s.label}
              </p>
              <p className="text-2xl font-extrabold mt-1 pl-3">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ───────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="BANK">Bank</option>
            <option value="APPLICANT">Applicant</option>
          </select>
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button
            onClick={fetchUsers}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm shadow hover:bg-blue-700 active:scale-95 transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── Table ─────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              No users found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => (
                  <tr
                    key={user.id}
                    className={`transition hover:bg-blue-50/40 ${
                      user.suspended ? 'bg-red-50/30' : ''
                    }`}
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ${
                            user.suspended
                              ? 'bg-gray-400'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}
                        >
                          {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 leading-tight">
                            {user.fullName || '—'}
                          </p>
                          <p className="text-xs text-gray-400">ID #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.phone || '—'}</p>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadge(
                          user.role
                        )}`}
                      >
                        {roleIcon(user.role)} {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.suspended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 border border-red-200">
                          🚫 Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          ✅ Active
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSuspend(user)}
                          title={user.suspended ? 'Reactivate user' : 'Suspend user'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-95 shadow-sm ${
                            user.suspended
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {user.suspended ? '✅ Reactivate' : '⏸️ Suspend'}
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, user })}
                          title="Delete user"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition active:scale-95 shadow-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
              <span>
                Showing <strong className="text-gray-600">{filtered.length}</strong> of{' '}
                <strong className="text-gray-600">{users.length}</strong> users
              </span>
            </div>
          )}
        </div>

        {/* ── Delete Confirmation Modal ─────────── */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 animate-[fadeIn_0.2s_ease]">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Delete User</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to permanently delete{' '}
                <strong className="text-gray-800">{deleteModal.user?.fullName}</strong> (
                {deleteModal.user?.email})?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, user: null })}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition shadow"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ─────────────────────────────── */}
        {toast.show && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all animate-[slideUp_0.3s_ease] ${
              toast.type === 'error'
                ? 'bg-red-500'
                : toast.type === 'warning'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          >
            {toast.message}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;

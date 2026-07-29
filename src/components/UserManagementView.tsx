"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, Eye, Loader2, Mail, Pencil, Phone, Plus, Search, Trash2, UserRound, Users, X } from "lucide-react";
import { User } from "@/types/admin/admin";

type ManagedUser = User & { reservationsCount?: number };
type FormState = { name: string; email: string; phone: string; dateOfBirth: string; password: string; role: "admin" | "user" };

const emptyForm: FormState = { name: "", email: "", phone: "", dateOfBirth: "", password: "", role: "user" };

interface Props { currentUser: User; }

export default function UserManagementView({ currentUser }: Props) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [mode, setMode] = useState<"view" | "add" | "edit" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");

  const token = () => localStorage.getItem("token") || "";
  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const loadUsers = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/users", { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Failed to load users.");
      setUsers(json.data || []);
    } catch (err: any) { setError(err.message || "Failed to load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) : users;
  }, [search, users]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === "admin").length,
    members: users.filter((user) => user.role === "user").length,
  }), [users]);

  const openAdd = () => { setForm(emptyForm); setFormError(""); setSelected(null); setMode("add"); };
  const openEdit = (user: ManagedUser) => {
    setSelected(user); setFormError("");
    setForm({ name: user.name, email: user.email, phone: user.phone || "", dateOfBirth: String(user.dateOfBirth || "").slice(0, 10), password: "", role: user.role });
    setMode("edit");
  };

  const validate = () => {
    if (form.name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!/^[+0-9\s-]{8,}$/.test(form.phone.trim())) return "Enter a valid phone number.";
    if (mode === "add") {
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Enter a valid email address.";
      if (!form.dateOfBirth) return "Date of birth is required.";
      if (form.password.length < 6) return "Password must be at least 6 characters.";
    }
    return "";
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) return setFormError(validationError);
    setSaving(true); setFormError("");
    try {
      const isEdit = mode === "edit" && selected;
      const response = await fetch(isEdit ? `/api/users/${selected.id}` : "/api/users", {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(isEdit ? { name: form.name, phone: form.phone } : form),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Unable to save user.");
      setUsers((previous) => isEdit ? previous.map((user) => user.id === selected.id ? json.data : user) : [json.data, ...previous]);
      setMode(null);
    } catch (err: any) { setFormError(err.message || "Unable to save user."); }
    finally { setSaving(false); }
  };

  const deleteUser = async (user: ManagedUser) => {
    if (user.id === currentUser.id) return;
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/users/${user.id}`, { method: "DELETE", headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Failed to delete user.");
      setUsers((previous) => previous.filter((item) => item.id !== user.id));
    } catch (err: any) { setError(err.message || "Failed to delete user."); }
  };

  const formatDate = (value?: string | Date) => value ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value)) : "Not available";

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-8">
        <div><h1 className="font-display font-black text-2xl text-on-surface">User Management</h1><p className="text-on-surface-variant text-xs mt-1">Manage registered users of the Sports Facility Reservation System.</p></div>
        <button onClick={openAdd} className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"><Plus className="h-4 w-4" />Add User</button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: "Total Users", value: stats.total, icon: Users }, { label: "Total Admins", value: stats.admins, icon: UserRound }, { label: "Total Members", value: stats.members, icon: Users }].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between"><div><span className="block text-[10px] font-mono text-outline uppercase font-bold tracking-widest">{label}</span><span className="block font-display font-black text-3xl text-primary mt-1">{value}</span></div><div className="p-3 rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div></div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-outline-variant shadow-sm">
        <div className="relative max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-outline" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:border-primary" /></div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-xs font-semibold"><AlertCircle className="h-5 w-5" /><span>{error}</span><button onClick={loadUsers} className="ml-auto underline cursor-pointer">Retry</button></div>}

      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        {loading ? <div className="py-20 flex flex-col items-center gap-3 text-outline"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-xs font-semibold">Loading users...</span></div> : filteredUsers.length === 0 ? <div className="py-20 text-center"><Users className="h-10 w-10 text-outline mx-auto mb-3" /><p className="font-display font-bold text-on-surface">{users.length === 0 ? "No users registered" : "No search results"}</p><p className="text-xs text-on-surface-variant mt-1">{users.length === 0 ? "Create the first account using Add User." : "Try another name or email address."}</p></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-outline-variant bg-surface-container-low/60 text-[10px] font-mono text-outline uppercase tracking-wider"><th className="py-4 px-5">Name</th><th className="py-4 px-5">Email</th><th className="py-4 px-5">Phone</th><th className="py-4 px-5">Date of Birth</th><th className="py-4 px-5">Registration Date</th><th className="py-4 px-5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-outline-variant/60 text-xs">{filteredUsers.map((user) => <tr key={user.id} className="hover:bg-surface-container-low/40"><td className="py-4 px-5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><span className="font-bold block">{user.name}</span><span className="text-[9px] uppercase font-mono text-outline">{user.role}</span></div></div></td><td className="py-4 px-5">{user.email}</td><td className="py-4 px-5">{user.phone || "Not available"}</td><td className="py-4 px-5">{formatDate(user.dateOfBirth)}</td><td className="py-4 px-5">{formatDate(user.createdAt)}</td><td className="py-4 px-5"><div className="flex justify-end gap-2"><button onClick={() => { setSelected(user); setMode("view"); }} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer" title="View"><Eye className="h-4 w-4" /></button><button onClick={() => openEdit(user)} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer" title="Edit"><Pencil className="h-4 w-4" /></button><button disabled={user.id === currentUser.id} onClick={() => deleteUser(user)} className="p-2 rounded-lg border border-outline-variant text-error hover:bg-error-container disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer" title={user.id === currentUser.id ? "You cannot delete your own account" : "Delete"}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>
        )}
      </div>

      {mode && <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && setMode(null)}><div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto"><div className="p-5 border-b border-outline-variant flex items-center justify-between"><div><h2 className="font-display font-black text-lg">{mode === "add" ? "Add User" : mode === "edit" ? "Edit User" : "User Details"}</h2><p className="text-xs text-on-surface-variant mt-0.5">{mode === "edit" ? "Only name and phone can be changed." : mode === "add" ? "Create a registered system account." : "Registered user information."}</p></div><button onClick={() => setMode(null)} className="p-2 rounded-lg hover:bg-surface-container-low cursor-pointer"><X className="h-5 w-5" /></button></div>{mode === "view" && selected ? <div className="p-6 grid sm:grid-cols-2 gap-5">{[{ icon: UserRound, label: "Name", value: selected.name }, { icon: Mail, label: "Email", value: selected.email }, { icon: Phone, label: "Phone", value: selected.phone || "Not available" }, { icon: Calendar, label: "Date of Birth", value: formatDate(selected.dateOfBirth) }, { icon: Calendar, label: "Registration Date", value: formatDate(selected.createdAt) }, { icon: Users, label: "Total Reservations", value: String(selected.reservationsCount || 0) }].map(({ icon: Icon, label, value }) => <div key={label} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant"><Icon className="h-4 w-4 text-primary mb-2" /><span className="text-[9px] font-mono uppercase text-outline font-bold block">{label}</span><span className="text-sm font-semibold mt-1 block break-words">{value}</span></div>)}</div> : <form onSubmit={submit} className="p-6 space-y-4">{formError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">{formError}</div>}<Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />{mode === "add" && <><Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} /><Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /><Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(value) => setForm({ ...form, dateOfBirth: value })} /><Field label="Temporary Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} /><label className="block"><span className="text-[10px] font-mono uppercase text-outline font-bold">Role</span><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "user" })} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm"><option value="user">Member</option><option value="admin">Admin</option></select></label></>}{mode === "edit" && <><Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /><div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface-variant">Email, password, role, and date of birth cannot be edited here.</div></>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setMode(null)} className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-bold cursor-pointer">Cancel</button><button disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{mode === "add" ? "Create User" : "Save Changes"}</button></div></form>}</div></div>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block"><span className="text-[10px] font-mono uppercase text-outline font-bold">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary" /></label>;
}

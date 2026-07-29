"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../ui/sidebar';
import AdminHeader from './header';
import AdminStatsGrid from './adminStatsGrid';
import OperationsLauncher from './OperationsLauncher';
import ActiveBookingsRoster from './ActiveBookingRoster';
import AdminReservationsView from '@/components/AdminReservationView/AdminReservationsView';
import { AppView, User as AdminUser } from '@/types/admin/admin';
import FacilitiesView from '@/components/facilities/FacilitiesView';
import ManageFacilityView from '@/components/ManageFacilityView/ManageFacilityView';
import SettingsView from '@/components/AdminSettingView/SettingsView';
import { User } from '../../types';
import { AlertCircle } from 'lucide-react';
import UserManagementView from '@/components/UserManagementView';
import { useRouter } from 'next/navigation';

// Helper function to safely decode JWT without external packages
function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse token payload:", error);
    return null;
  }
}

function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;

  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      const name = parsed.name || parsed.fullName || parsed.username || parsed.user?.name;
      if (name) {
        return {
          ...parsed,
          name,
          id: parsed.id || parsed._id || parsed.userId || 'usr_admin',
          role: parsed.role === 'admin' ? 'admin' : 'user',
        };
      }
    } catch (e) {
      console.error("Failed to parse stored user from localStorage", e);
    }
  }

  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeJwtPayload(token);
  if (!decoded) return null;

  const resolvedName =
    decoded.name ||
    decoded.fullName ||
    decoded.username ||
    decoded.user?.name ||
    decoded.user?.fullName ||
    decoded.user?.username;

  const resolvedEmail =
    decoded.email ||
    decoded.user?.email ||
    'admin@AlthleticClub.com';

  const resolvedId =
    decoded.userId ||
    decoded.id ||
    decoded._id ||
    decoded.user?.id ||
    decoded.user?._id ||
    'usr_admin';

  return {
    id: resolvedId,
    name: resolvedName || 'Admin User',
    email: resolvedEmail,
    role: decoded.role === 'admin' || decoded.user?.role === 'admin' ? 'admin' : 'user',
  };
}

export default function AdminMainDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AppView | 'add-facility' | 'edit-facility'>('dashboard');
  const [facilityToEdit, setFacilityToEdit] = useState<any | null>(null);

  // Synchronously initialize user state from localStorage
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => {
    return getStoredUser() || {
      id: 'usr_admin',
      name: 'Admin User',
      email: 'admin@clinic.com',
      role: 'admin',
    };
  });

  // Synchronously seed stats from cache to render UI instantly
  const [stats, setStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('admin_stats_cache');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) { }
      }
    }
    return {
      totalSystemBookings: 0,
      activeFacilitiesCount: 0,
      totalFacilitiesCount: 0,
      totalSystemUsers: 0,
      estimatedRevenue: 0,
    };
  });

  // Synchronously seed reservations from cache
  const [recentReservations, setRecentReservations] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('admin_reservations_cache');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) { }
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('admin_stats_cache');
    }
    return true;
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Token presence validation
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_stats_cache');
      localStorage.removeItem('admin_reservations_cache');
      router.push('/');
    }
  };

  const fetchDashboardData = async (isSilent = false) => {
    if (!isSilent && stats.totalSystemBookings === 0 && recentReservations.length === 0) {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage('No authentication token found. Redirecting to login...');
        setTimeout(() => router.push('/auth'), 1500);
        return;
      }

      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard metrics from backend.');
      }

      const data = await res.json();
      const dashboardInfo = data.data || data;

      if (dashboardInfo.stats) {
        setStats(dashboardInfo.stats);
        localStorage.setItem('admin_stats_cache', JSON.stringify(dashboardInfo.stats));
      }
      if (dashboardInfo.recentReservations) {
        setRecentReservations(dashboardInfo.recentReservations);
        localStorage.setItem('admin_reservations_cache', JSON.stringify(dashboardInfo.recentReservations));
      }

    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      if (recentReservations.length === 0) {
        setErrorMessage(err.message || 'Could not connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' || currentView === 'reservations') {
      fetchDashboardData();
    }
  }, [currentView]);

  // Generic reservation status updater (optimistic UI update)
  const handleUpdateReservationStatus = (bookingId: string, targetStatus: string) => {
    const previousReservations = [...recentReservations];

    const updatedReservations = recentReservations.map((b) =>
      (b.id === bookingId || b._id === bookingId) ? { ...b, status: targetStatus } : b
    );

    setRecentReservations(updatedReservations);
    localStorage.setItem('admin_reservations_cache', JSON.stringify(updatedReservations));

    const token = localStorage.getItem('token');
    fetch('/api/admin/dashboard', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId, status: targetStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update status to ${targetStatus}`);
        fetchDashboardData(true);
      })
      .catch((error) => {
        console.error(`Error updating status to ${targetStatus}:`, error);
        setRecentReservations(previousReservations);
        alert(`Failed to update booking to ${targetStatus} on the server.`);
      });
  };

  // Delete handler for cancelled logs
  const handleDeleteReservation = (bookingId: string) => {
    const previousReservations = [...recentReservations];

    const updatedReservations = recentReservations.filter((b) =>
      b.id !== bookingId && b._id !== bookingId
    );

    setRecentReservations(updatedReservations);
    localStorage.setItem('admin_reservations_cache', JSON.stringify(updatedReservations));

    const token = localStorage.getItem('token');
    fetch(`/api/admin/dashboard?bookingId=${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) fetchDashboardData(true);
      })
      .catch((error) => {
        console.error('Error deleting booking:', error);
        setRecentReservations(previousReservations);
        alert('Failed to delete booking on server.');
      });
  };

  const handleNavigateToManage = (facility: any | null) => {
    setFacilityToEdit(facility);
    if (facility) {
      setCurrentView('edit-facility');
    } else {
      setCurrentView('add-facility');
    }
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (errorMessage) {
          return (
            <div className="mx-8 my-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-xs font-semibold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          );
        }

        return (
          <div className="px-8 pb-8 space-y-8">
            <AdminStatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12 flex flex-col gap-6">
                <OperationsLauncher onViewChange={(view) => {
                  if (view === 'facilities') {
                    handleNavigateToManage(null);
                  } else {
                    setCurrentView(view);
                  }
                }} />
              </div>
            </div>
            <ActiveBookingsRoster
              reservations={recentReservations}
              onApproveBooking={(id) => handleUpdateReservationStatus(id, 'Confirmed')}
              onRejectBooking={(id) => handleUpdateReservationStatus(id, 'Cancelled')}
            />
          </div>
        );

      case 'facilities':
        return (
          <FacilitiesView
            currentUser={currentUser}
            reservations={recentReservations}
            onNavigateToManage={handleNavigateToManage}
          />
        );

      case 'add-facility':
      case 'edit-facility':
        return (
          <ManageFacilityView
            editingFacility={facilityToEdit}
            onCancel={() => {
              setFacilityToEdit(null);
              setCurrentView('facilities');
            }}
            onSaveFacility={() => {
              setFacilityToEdit(null);
              setCurrentView('facilities');
              fetchDashboardData();
            }}
          />
        );

      case 'reservations':
        return (
          <AdminReservationsView
            currentUser={currentUser}
            reservations={recentReservations}
            onApproveReservation={(id) => handleUpdateReservationStatus(id, 'Confirmed')}
            onCompleteReservation={(id) => handleUpdateReservationStatus(id, 'Completed')}
            onCancelReservation={(id) => handleUpdateReservationStatus(id, 'Cancelled')}
            onDeleteReservation={handleDeleteReservation}
          />
        );

      case 'users':
        return <UserManagementView currentUser={currentUser} />;

      case 'settings':
        return (
          <SettingsView
            currentUser={currentUser}
            onUpdateProfile={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar
        currentView={currentView as AppView}
        onViewChange={(view) => {
          setFacilityToEdit(null);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {currentView === 'dashboard' && (
          <div className="px-8 pt-8 pb-4">
            <AdminHeader currentUser={currentUser} />
          </div>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderViewContent()}
        </main>
      </div>
    </div>
  );
}
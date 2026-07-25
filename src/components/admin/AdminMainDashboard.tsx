"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../ui/sidebar';
import AdminHeader from './header';
import AdminStatsGrid from './adminStatsGrid';
import AdminAnalyticsChart from './AdminAnalyticsChart';
import OperationsLauncher from './OperationsLauncher';
import ActiveBookingsRoster from './ActiveBookingRoster';
import { AppView, User } from '@/types/admin/admin';
import FacilitiesView from '@/components/facilities/FacilitiesView';
import ManageFacilityView from '@/components/ManageFacilityView';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SettingsView from '../SettingsView';

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
    return null;
  }
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeJwtPayload(token);
  if (!decoded) return null;

  const resolvedName = decoded.name || decoded.fullName || decoded.username || decoded.user?.name;

  return {
    id: decoded.userId || decoded.id || 'usr_admin',
    name: resolvedName || 'Admin User',
    email: decoded.email || 'admin@clinic.com',
    role: decoded.role || 'admin',
  };
}

export default function AdminMainDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AppView | 'add-facility' | 'edit-facility'>('dashboard');
  const [facilityToEdit, setFacilityToEdit] = useState<any | null>(null);

  // Initialize state once from local storage
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return getStoredUser() || {
      id: 'usr_admin',
      name: 'Admin User',
      email: 'admin@clinic.com',
      role: 'admin',
    };
  });

  const [stats, setStats] = useState({
    totalSystemBookings: 0,
    activeFacilitiesCount: 0,
    totalFacilitiesCount: 0,
    totalSystemUsers: 0,
    estimatedRevenue: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check auth token immediately
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      router.push('/auth');
    }
  };

  const fetchDashboardData = useCallback(async () => {
    setIsFetching(true);
    setErrorMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/auth');
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch dashboard metrics.');

      const data = await res.json();
      const dashboardInfo = data.data || data;

      if (dashboardInfo.stats) setStats(dashboardInfo.stats);
      if (dashboardInfo.chartData) setChartData(dashboardInfo.chartData);
      if (dashboardInfo.recentReservations) setRecentReservations(dashboardInfo.recentReservations);

    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to the server.');
    } finally {
      setIsFetching(false);
    }
  }, [router]);

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchDashboardData();
    }
  }, [currentView, fetchDashboardData]);

  const handleNavigateToManage = (facility: any | null) => {
    setFacilityToEdit(facility);
    setCurrentView(facility ? 'edit-facility' : 'add-facility');
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="px-8 pb-8 space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-xs font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            {/* Non-blocking render: Components load immediately with zero delay */}
            <AdminStatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col gap-6">
                <OperationsLauncher onViewChange={(view) => {
                  if (view === 'facilities') {
                    handleNavigateToManage(null);
                  } else {
                    setCurrentView(view);
                  }
                }} />
              </div>
            </div>
            <ActiveBookingsRoster reservations={recentReservations} />
          </div>
        );

      case 'facilities':
        return <FacilitiesView currentUser={currentUser} onNavigateToManage={handleNavigateToManage} />;

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
        return <div className="p-8 font-bold">View Placeholder</div>;
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
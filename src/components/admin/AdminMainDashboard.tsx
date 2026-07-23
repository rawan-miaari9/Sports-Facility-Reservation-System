"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../ui/sidebar';
import AdminHeader from './header';
import AdminStatsGrid from './adminStatsGrid';
import AdminAnalyticsChart from './AdminAnalyticsChart';
import OperationsLauncher from './OperationsLauncher';
import ActiveBookingsRoster from './ActiveBookingRoster';
import { AppView, User } from '@/types/admin/admin';
import FacilitiesView from '@/components/facilities/FacilitiesView';
import ManageFacilityView from '@/components/ManageFacilityView';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AdminMainDashboard() {
  const [currentView, setCurrentView] = useState<AppView | 'add-facility' | 'edit-facility'>('dashboard');
  const [facilityToEdit, setFacilityToEdit] = useState<any | null>(null);

  // Dynamic Dashboard States from Database
  const [stats, setStats] = useState({
    totalSystemBookings: 0,
    activeFacilitiesCount: 0,
    totalFacilitiesCount: 0,
    totalSystemUsers: 0,
    estimatedRevenue: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // replace these with authenticated user when i finish JWT
  const currentUser: User = {
    id: 'usr_admin_1',
    name: 'Admin User',
    email: 'admin@clinic.com',
    role: 'admin',
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  // Fetch live metrics from backend API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard metrics from backend.');
      }
      const data = await res.json();

      // Fallback parsing depending on API structure
      const dashboardInfo = data.data || data;

      if (dashboardInfo.stats) setStats(dashboardInfo.stats);
      //if (dashboardInfo.chartData) setChartData(dashboardInfo.chartData);
      if (dashboardInfo.recentReservations) setRecentReservations(dashboardInfo.recentReservations);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setErrorMessage(err.message || 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchDashboardData();
    }
  }, [currentView]);

  // to handle navigating in the opration luncher
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
        if (isLoading) {
          return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-outline">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs font-semibold">Loading real-time database metrics...</span>
            </div>
          );
        }

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
             {/*<div className="lg:col-span-8">
                <AdminAnalyticsChart chartData={chartData} />
              </div>*/}
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
        return (
          <FacilitiesView
            currentUser={currentUser}
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
          <div className="p-8 font-display font-bold text-on-surface">
            Reservations History View Placeholder
          </div>
        );

      case 'users':
        return (
          <div className="p-8 font-display font-bold text-on-surface">
            User Management View Placeholder
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 font-display font-bold text-on-surface">
            Settings View Placeholder
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* 1. PERMANENT SIDEBAR */}
      <Sidebar
        currentView={currentView as AppView}
        onViewChange={(view) => {
          setFacilityToEdit(null);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. MAIN CONTENT PANEL */}
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
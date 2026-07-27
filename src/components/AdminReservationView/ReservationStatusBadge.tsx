import React from 'react';
import { Reservation } from '../../types';

interface ReservationStatusBadgeProps {
  status: Reservation['status'];
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Confirmed':
        return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' };
      case 'Completed':
        return { badge: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' };
      case 'Pending':
        return { badge: 'bg-amber-50 text-amber-800 border-amber-200/60', dot: 'bg-amber-500' };
      default:
        return { badge: 'bg-rose-50 text-rose-700 border-rose-200/60', dot: 'bg-rose-500' };
    }
  };

  const styles = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide border ${styles.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
};
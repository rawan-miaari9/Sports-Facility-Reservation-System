import React from 'react';

type StatusType = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface ReservationStatusTabsProps {
  activeTab: StatusType;
  onTabChange: (status: StatusType) => void;
}

const STACK_STATUSES: StatusType[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export const ReservationStatusTabs: React.FC<ReservationStatusTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant overflow-x-auto">
      {STACK_STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => onTabChange(status)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === status
              ? 'bg-white text-primary shadow-sm'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          {status} List
        </button>
      ))}
    </div>
  );
};
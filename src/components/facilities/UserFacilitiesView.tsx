'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Info, Loader2 } from 'lucide-react';
import {
    fetchFacilities,
    fetchReservations,
    createReservation,
    createCheckoutSession,
} from '@/services/facilityService';

import { FacilityFilterBar } from './FacilityFilterBar';
import { FacilityCard } from './FacilityCard';
import { UserBookingDrawer } from "./UserBookingDrawer";
import { BookingSuccessModal } from './BookingSuccessModel';

export interface Facility {
    _id: string;
    id?: string;
    name: string;
    type: string;
    description: string;
    image: string;
    location: string;
    isIndoor: boolean;
    pricePerHour: number;
    capacity: number;
    status: 'Available' | 'Maintenance' | 'Closed';
    features: string[];
}

export interface Reservation {
    _id?: string;
    id?: string;

    facilityId: string;

    bookingType: "registered" | "guest";

    userId?: string;

    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;

    date: string;
    timeSlot: string;

    price: number;

    paymentMethod: "Cash" | "Card";

    equipment: string[];

    status: "Pending" | "Confirmed" | "Cancelled";

    facilityName?: string;
}

interface FacilitiesViewProps {
    currentUser?: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'user';
    };
    reservations?: Reservation[];
    onNavigateToManage?: (facility: Facility | null) => void;
    deepSelectedFacility?: Facility | null;
    onClearDeepSelected?: () => void;
}

const AVAILABLE_TIME_SLOTS = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
    '20:00 - 22:00'
];

const SPORT_TYPES = ['Basketball', 'Football', 'Tennis', 'Padel', 'Volleyball'];

const EQUIPMENT_OPTIONS: Record<string, { name: string; price: number }[]> = {
    Basketball: [{ name: 'Pro Match Basketball', price: 5 }, { name: 'Training Cones', price: 3 }],
    Football: [{ name: 'Match Football', price: 5 }, { name: 'Training Vests', price: 8 }],
    Tennis: [{ name: 'Pro Rackets (Set of 2)', price: 10 }, { name: 'Tennis Balls Can', price: 4 }],
    Padel: [{ name: 'Padel Rackets (Set of 2)', price: 10 }, { name: 'Padel Balls Can', price: 4 }]
};

export default function FacilitiesView({
    currentUser,
    onNavigateToManage,
    deepSelectedFacility = null,
    onClearDeepSelected
}: FacilitiesViewProps) {
    const [loggedInUser, setLoggedInUser] = useState(currentUser ?? null);
    const isAdmin = loggedInUser?.role === 'admin';
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [indoorFilter, setIndoorFilter] = useState<'All' | 'Indoor' | 'Outdoor'>('All');
    const [maxPrice, setMaxPrice] = useState(200);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [bookingDate, setBookingDate] = useState<string>(getTodayString());
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash'>('Card');

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastCreatedReservation, setLastCreatedReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
        let isMounted = true;

        async function loadData() {
            try {
                setIsFetching(true);
                const facilitiesData = await fetchFacilities();
                const reservationsData = await fetchReservations();

                if (isMounted) {
                    setFacilities(facilitiesData || []);
                    setReservations(reservationsData || []);
                }
            } catch (err) {
                console.error('Failed to load facilities:', err);
            } finally {
                if (isMounted) setIsFetching(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (deepSelectedFacility) {
            setSelectedFacility(deepSelectedFacility);
            setIsDrawerOpen(true);
            if (onClearDeepSelected) onClearDeepSelected();
        }
    }, [deepSelectedFacility, onClearDeepSelected]);

    const handleOpenBookingDrawer = (facility: Facility) => {
        setSelectedFacility(facility);
        setSelectedSlot('');
        setSelectedEquipment([]);
        setPaymentMethod('Card');


        setBookingDate(getTodayString());
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedFacility(null);
    };

    const handleToggleEquipment = (eqName: string) => {
        if (selectedEquipment.includes(eqName)) {
            setSelectedEquipment(selectedEquipment.filter(name => name !== eqName));
        } else {
            setSelectedEquipment([...selectedEquipment, eqName]);
        }
    };

    const filteredFacilities = facilities.filter(fac => {
        const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fac.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = selectedSport === 'All' || fac.type === selectedSport;
        const matchesIndoor = indoorFilter === 'All' ||
            (indoorFilter === 'Indoor' && fac.isIndoor) ||
            (indoorFilter === 'Outdoor' && !fac.isIndoor);
        const matchesPrice = fac.pricePerHour <= maxPrice;

        return matchesSearch && matchesSport && matchesIndoor && matchesPrice;
    });
    const handleConfirmReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFacility) return;

        const basePrice = selectedFacility.pricePerHour * 2;

        const equipmentCost = (EQUIPMENT_OPTIONS[selectedFacility.type] || [])
            .filter(eq => selectedEquipment.includes(eq.name))
            .reduce((sum, eq) => sum + eq.price, 0);

        try {
            setIsSubmitting(true);

            const reservationData = {
                facilityId: selectedFacility._id || selectedFacility.id,
                bookingType: "registered" as const,
                userId: loggedInUser!.id,
                date: bookingDate,
                timeSlot: selectedSlot,
                price: basePrice + equipmentCost,
                paymentMethod,
                equipment: selectedEquipment,
            };

            if (paymentMethod === "Card") {
                sessionStorage.setItem("pendingStripeReservation", JSON.stringify(reservationData));
                const checkoutUrl = await createCheckoutSession(reservationData);
                window.location.href = checkoutUrl;
                return;
            }

            const result = await createReservation(reservationData);

            if (result.success) {
                setLastCreatedReservation({
                    ...result.data,
                    facilityName: selectedFacility.name,
                });

                setShowSuccessModal(true);
                handleCloseDrawer();
            }
        } catch (error: any) {
            alert(error.message || "Failed to submit reservation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden bg-background relative h-full">
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar">
                {/* Header renders instantly without waiting */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="font-display font-black text-2xl text-on-surface">
                            Book a Slot
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Choose a facility and reserve your preferred time.
                        </p>
                    </div>
                </header>

                {/* Filter Bar renders instantly without waiting */}
                <FacilityFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedSport={selectedSport}
                    setSelectedSport={setSelectedSport}
                    indoorFilter={indoorFilter}
                    setIndoorFilter={setIndoorFilter}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    sportTypes={SPORT_TYPES}
                    onReset={() => {
                        setSearchTerm('');
                        setSelectedSport('All');
                        setIndoorFilter('All');
                        setMaxPrice(200);
                    }}
                />

                {/* Cards Grid */}
                {isFetching && facilities.length === 0 ? (
                    /* Card Skeletons instead of full-screen loader */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div key={idx} className="h-72 bg-surface-variant/30 animate-pulse rounded-2xl border border-outline-variant/50" />
                        ))}
                    </div>
                ) : filteredFacilities.length === 0 ? (
                    <div className="bg-white border border-outline-variant p-16 rounded-2xl text-center">
                        <Info className="h-10 w-10 text-outline mx-auto mb-3" />
                        <span className="font-display font-bold text-base text-on-surface block">No Certified Arenas Found</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredFacilities.map((facility) => (
                            <FacilityCard
                                key={facility._id || facility.id}
                                facility={facility}
                                isAdmin={isAdmin}
                                onNavigateToManage={onNavigateToManage}
                                onBookSlot={handleOpenBookingDrawer}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isDrawerOpen && selectedFacility && (
                <UserBookingDrawer
                    selectedFacility={selectedFacility}
                    bookingDate={bookingDate}
                    setBookingDate={setBookingDate}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    selectedEquipment={selectedEquipment}
                    onToggleEquipment={handleToggleEquipment}
                    availableTimeSlots={AVAILABLE_TIME_SLOTS}
                    equipmentOptions={EQUIPMENT_OPTIONS}
                    reservations={reservations}
                    isSubmitting={isSubmitting}

                    onClose={handleCloseDrawer}
                    onSubmit={handleConfirmReservation}
                />
            )}

            {showSuccessModal && lastCreatedReservation && (
                <BookingSuccessModal
                    reservation={lastCreatedReservation}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </div>
    );
}
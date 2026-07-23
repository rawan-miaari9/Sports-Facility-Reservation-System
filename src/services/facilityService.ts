// services/facilityService.ts

export async function fetchFacilities() {
  const res = await fetch('/api/facilities', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch facilities');
  const json = await res.json();
  return json.data;
}

export async function createReservation(reservationData: any) {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });
  if (!res.ok) throw new Error('Failed to create reservation');
  return await res.json();
}
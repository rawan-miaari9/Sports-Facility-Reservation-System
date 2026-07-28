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

export async function fetchReservations() {
  const res = await fetch('/api/reservations', {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch reservations');

  const json = await res.json();
  return json.data;
}

export async function createCheckoutSession(reservationData: any) {
  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });

  const json = await res.json();
  if (!res.ok || !json.url) {
    throw new Error(json.error || 'Failed to start Stripe Checkout');
  }

  return json.url as string;
}

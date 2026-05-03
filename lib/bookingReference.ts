export function generateBookingReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let reference = "DFA-";

  for (let i = 0; i < 6; i++) {
    reference += chars[Math.floor(Math.random() * chars.length)];
  }

  return reference;
}
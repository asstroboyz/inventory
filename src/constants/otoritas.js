export const OTORITAS = {
  SUPER_ADMIN: 1,
  KEPALA_BPS: 2,
  ADMIN: 3,
  PETUGAS_PENGADAAN: 4,
  STAF_TATA_USAHA: 5,
  STAF: 6
}

export const getOtoritasName = (id) => {
  const entry = Object.entries(OTORITAS).find(([, value]) => value === id);
  if (!entry) return 'Unknown';
  
  // Format the key to a readable name
  return entry[0]
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

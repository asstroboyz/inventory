export const OTORITAS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  TATA_USAHA: 3,
  IPDS: 4,
  PEGAWAI: 5
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

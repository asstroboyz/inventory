export const CHAT_CONSTANTS = {
    FWD_PREFIX: '[Forwarded]:',
    REPLY_PREFIX: '> ',
    DEFAULT_BOY_AVATAR: '/boy.png',
    DEFAULT_GIRL_AVATAR: '/woman.png',
    AUTHORIZED_ROLES: [1, 2],       // Roles for Group Creation & Cart visibility
    PROCUREMENT_ROLES: [1, 2, 3]    // Roles for Approve/Reject proposals
}

const extractOtoritasId = (userData) => {
    if (!userData) return null;
    return typeof userData === 'object'
        ? (userData.otoritas_id || userData.OtoritasID || (typeof userData.otoritas === 'object' ? (userData.otoritas.id || userData.otoritas.ID) : userData.otoritas))
        : userData;
}

/**
 * Check for Group & Cart access (Otoritas 1 & 2)
 */
export const canAccessFeature = (userData) => {
    const id = extractOtoritasId(userData);
    return CHAT_CONSTANTS.AUTHORIZED_ROLES.includes(Number(id));
}

/**
 * Check for Proposal Approval/Rejection access (Otoritas 1, 2, & 3)
 */
export const canApproveReject = (userData) => {
    const id = extractOtoritasId(userData);
    return CHAT_CONSTANTS.PROCUREMENT_ROLES.includes(Number(id));
}
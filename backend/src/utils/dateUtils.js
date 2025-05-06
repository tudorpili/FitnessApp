// src/utils/dateUtils.js

/**
 * Gets today's date in YYYY-MM-DD format suitable for database queries.
 * @returns {string} Today's date string.
 */
const getDbTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

module.exports = getDbTodayDate;


/**
 * StayEase Utility Formatters
 * Academic explainability: Centralized formatting functions for currency, dates, and text
 */

// Format price in Indian Rupee (INR - ₹)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format standard readable date: e.g. "12 Oct 2026"
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Format date for HTML input type="date" (YYYY-MM-DD)
export const formatDateForInput = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate difference in calendar days between checkIn and checkOut
export const calculateNights = (checkInStr, checkOutStr) => {
  if (!checkInStr || !checkOutStr) return 0;
  const inDate = new Date(checkInStr);
  const outDate = new Date(checkOutStr);
  
  // Set to midnight UTC for clean calendar day calculation without timezone drift
  const diffTime = outDate.getTime() - inDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Capitalize words
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

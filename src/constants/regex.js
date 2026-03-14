// GST Number Regex: IDDDDDDDDDDDDDDZ
// Format: 2-digit state code, 5-letter business PAN, 4-digit sequence, 1-letter, 1-alphanumeric, Z, 1-alphanumeric
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// PAN Number Regex: AAAABBBBBCCCCN
// Format: 5-letter, 4-digit, 1-letter, 1-digit (0-9), 1-letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}$/;

// Phone Number Regex: 10 digits (Indian format)
const PHONE_REGEX = /^[6-9]\d{9}$/;

// Email Validation Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pincode Regex: 6 digits (Indian format)
const PINCODE_REGEX = /^[0-9]{6}$/;

// Distributor Code Regex: DISTXXXX (where XXXX is 4 digits)
const DISTRIBUTOR_CODE_REGEX = /^DIST\d{4}$/;

module.exports = {
  GST_REGEX,
  PAN_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  PINCODE_REGEX,
  DISTRIBUTOR_CODE_REGEX,
};

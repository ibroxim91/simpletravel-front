const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://simple-travel.felixits.uz';

const ENDP_POSTS = '/posts/';
const GET_TICKETS = '/api/v1/tickets/';
const GET_BLOGS = '/api/v1/post/';
const GET_TAGS = '/api/v1/category/';

//Auth
const PHONE_SENDOTP = '/api/v1/auth/register/';
const PHONE_RESTER_PASSWORD = '/api/v1/auth/reset-password/';
const PHONE_LOGIN = '/api/v1/auth/token/phone/';
const EMAIL_LOGIN = '/api/v1/auth/token/email/';
const PHONE_CONFIRMOTP = '/api/v1/auth/confirm/';
const PHONE_CONFIRM_RESET_PASS = '/api/v1/auth/reset-password-confirm/';
const PHONE_RESEND_OTP = '/api/v1/auth/resend/';
const EMAIL_CONFIRMOTP = '/api/v1/email-auth/confirm/';
const EMAIL_CONFIRM_RESET_PASS = '/api/v1/email-auth/reset-password-confirm/';
const PHONE_SET_PASSWORD = '/api/v1/auth/set-password/';
const PHONE_RESET_PASS = '/api/v1/auth/reset-password-set/';
const EMAIL_RESET_PASS = '/api/v1/email-auth/reset-password-set/';
const EMAIL_SET_PASSWORD = '/api/v1/email-auth/set-password-email/';
const EMAIL_SENDOTP = '/api/v1/email-auth/register/';
const EMAIL_RESEND_PASSWORD = '/api/v1/email-auth/reset-password/';
const EMAIL_RESEND_OTP = '/api/v1/email-auth/resend/';

const SAVE_TICKETS = '/api/v1/likes/';
const GET_SAVED = '/api/v1/likes/';

const SEND_PARTNER = '/api/v1/travel-agency/';
const SEND_SUPPORT = '/api/v1/support/';
const UPDATE_USER = '/api/v1/auth/user-update/';
const NEW_PASSWORD = '/api/v1/auth/change-password/';
const GET_ME = '/api/v1/auth/me/';
const PARTICIPANT = '/api/v1/participant/';
const PARTICIPANT_IMAGE = '/api/v1/participant-image/';
const FAQ = '/api/v1/faq/';
const TICKETORDER_INFO = '/api/v1/get-ticket-info/';
const TICKETORDER = '/api/v1/ticketorder/';
const PAYMENTS = '/api/v1/payments_link/';
const DONWLOAD_PDF = '/api/v1/get-order-pdf/';

const SEND_COMMENT = '/api/v1/ticket-comment/';

const GET_BANNER = '/api/v1/banner/';

const GET_CONTACT = '/api/v1/dashboard/dashboard-site-settings/';
const GET_HELP_PAGE = '/api/v1/dashboard/dashboard-site-help-page/';
const GET_OFFERTA = '/api/v1/dashboard/dashboard-site-offerta/';

const LOCATIONS = '/api/v1/locations/';

export {
  BASE_URL,
  DONWLOAD_PDF,
  EMAIL_CONFIRM_RESET_PASS,
  EMAIL_CONFIRMOTP,
  EMAIL_LOGIN,
  EMAIL_RESEND_OTP,
  EMAIL_RESEND_PASSWORD,
  EMAIL_RESET_PASS,
  EMAIL_SENDOTP,
  EMAIL_SET_PASSWORD,
  ENDP_POSTS,
  FAQ,
  GET_BANNER,
  GET_BLOGS,
  GET_CONTACT,
  GET_HELP_PAGE,
  GET_ME,
  GET_OFFERTA,
  GET_SAVED,
  GET_TAGS,
  GET_TICKETS,
  LOCATIONS,
  NEW_PASSWORD,
  PARTICIPANT,
  PARTICIPANT_IMAGE,
  PAYMENTS,
  PHONE_CONFIRM_RESET_PASS,
  PHONE_CONFIRMOTP,
  PHONE_LOGIN,
  PHONE_RESEND_OTP,
  PHONE_RESET_PASS,
  PHONE_RESTER_PASSWORD,
  PHONE_SENDOTP,
  PHONE_SET_PASSWORD,
  SAVE_TICKETS,
  SEND_COMMENT,
  SEND_PARTNER,
  SEND_SUPPORT,
  TICKETORDER,
  TICKETORDER_INFO,
  UPDATE_USER,
};

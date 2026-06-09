'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  SamoOrder,
  SamoOrderParticipant,
  Ticketorder_Api,
} from '../lib/api';

const COMPANY_NAME = 'OOO "SimpleTravel"';
const BRAND_NAME = 'Simple Travel';
const SUPPORT_PHONE = '+998 95 074 57 00';
const SUPPORT_PHONE_2 = '+998 95 952 57 00';
const SUPPORT_QR_SRC = '/support_qr_code.png';

const COLORS = {
  blue: '#1A73E8',
  blueLight: '#E8F1FD',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  headerBg: '#F9FAFB',
  white: '#FFFFFF',
};

type TourExtras = {
  room_type?: string;
  freight_external?: string;
  place?: string;
  departure_time?: string;
  travel_time?: string;
  departure_name?: string;
  destination_name?: string;
  operator?: string;
};

type LocalParticipant = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  date?: string | null;
  passport?: { id: number; image: string }[];
};

type VoucherParticipant = {
  fullName: string;
  gender: string;
  birthDate: string;
  citizenship: string;
  document: string;
  travelClass: string;
};

type VoucherLabels = {
  voucher: string;
  hotelAndTransfer: string;
  tourists: string;
  stayDates: string;
  hotelName: string;
  mealType: string;
  transferType: string;
  roomType: string;
  receivingCompany: string;
  bookingTime: string;
};

export type VoucherAssets = {
  logoSrc: string | null;
  qrSrc: string | null;
  footerQrSrc: string | null;
};

function getMealShort(meal?: string) {
  if (!meal) return 'BB';
  const normalized = meal.toLowerCase().replace(/\s+/g, '_');
  const mealMap: Record<string, string> = {
    breakfast: 'BB',
    bed_breakfast: 'BB',
    half_board: 'HB',
    full_board: 'FB',
    all_inclusive: 'AI',
    ultra_all_inclusive: 'UAI',
    room_only: 'RO',
    'all_inclusive...': 'AI',
  };
  if (mealMap[normalized]) return mealMap[normalized];
  if (/^(bb|hb|fb|ai|uai|ro)$/i.test(meal.trim())) {
    return meal.trim().toUpperCase();
  }
  return meal.toUpperCase();
}

export function getTourExtrasFromLocalStorage(): TourExtras {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('tour');
    if (!raw) return {};
    const tour = JSON.parse(raw);
    return {
      room_type: tour.room_type,
      freight_external: tour.freight_external,
      place: tour.place,
      departure_time: tour.departure_time,
      travel_time: tour.travel_time,
      departure_name: tour.departure?.name,
      destination_name: tour.destination?.name,
      operator: tour.operator,
    };
  } catch {
    return {};
  }
}

function getTimesFromLocalStorage() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('timesStepForm');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLocalParticipants(): LocalParticipant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('participantsForm');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.participants ?? [];
  } catch {
    return [];
  }
}

export function unwrapOrder(
  payload: SamoOrder | { data: SamoOrder } | { status: boolean; data: SamoOrder },
): SamoOrder {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    payload.data &&
    typeof payload.data === 'object' &&
    'id' in payload.data
  ) {
    return payload.data as SamoOrder;
  }
  return payload as SamoOrder;
}

function formatGender(gender?: string) {
  if (!gender) return '—';
  if (gender === 'male') return 'M';
  if (gender === 'female') return 'F';
  return gender.toUpperCase().slice(0, 1);
}

function formatBirthDate(date?: string | null) {
  if (!date) return '—';
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD.MM.YYYY') : '—';
}

function resolveParticipantDetails(order: SamoOrder): VoucherParticipant[] {
  const apiParticipants = order.participant ?? [];
  const localParticipants = getLocalParticipants();

  if (apiParticipants.length > 0 && typeof apiParticipants[0] === 'object') {
    return (apiParticipants as SamoOrderParticipant[]).map((p, index) => {
      const local = localParticipants[index];
      return {
        fullName: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim().toUpperCase(),
        gender: formatGender(p.gender || local?.gender),
        birthDate: formatBirthDate(local?.date),
        citizenship: 'UZB',
        document: '—',
        travelClass: 'Y',
      };
    });
  }

  if (localParticipants.length > 0) {
    return localParticipants.map((p) => ({
      fullName: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim().toUpperCase(),
      gender: formatGender(p.gender),
      birthDate: formatBirthDate(p.date),
      citizenship: 'UZB',
      document: '—',
      travelClass: 'Y',
    }));
  }

  return [
    {
      fullName: '—',
      gender: '—',
      birthDate: '—',
      citizenship: '—',
      document: '—',
      travelClass: 'Y',
    },
  ];
}

function resolveTouristNames(participants: VoucherParticipant[]) {
  return participants.map((p) => p.fullName).join('\n');
}

export function getVoucherUrl(orderId: number, locale: LanguageRoutes) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  return `${siteUrl.replace(/\/$/, '')}/${locale}/view-voucher/${orderId}`;
}

export function getQrCodeUrl(voucherUrl: string, size = 140) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&data=${encodeURIComponent(voucherUrl)}`;
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const absoluteUrl = url.startsWith('http')
      ? url
      : `${window.location.origin}${url}`;
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Failed to read image: ${url}`));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function buildWebVoucherAssets(voucherUrl: string): VoucherAssets {
  return {
    logoSrc: '/Simple_Travel.png',
    qrSrc: getQrCodeUrl(voucherUrl, 140),
    footerQrSrc: SUPPORT_QR_SRC,
  };
}

async function loadVoucherAssets(voucherUrl: string): Promise<VoucherAssets> {
  const webAssets = buildWebVoucherAssets(voucherUrl);
  const [logoSrc, qrSrc, footerQrSrc] = await Promise.all([
    webAssets.logoSrc ? fetchImageAsDataUrl(webAssets.logoSrc) : null,
    webAssets.qrSrc ? fetchImageAsDataUrl(webAssets.qrSrc) : null,
    fetchImageAsDataUrl(SUPPORT_QR_SRC),
  ]);
  return { logoSrc, qrSrc, footerQrSrc };
}

function formatStayDates(order: SamoOrder) {
  const from =
    order.check_in_date ||
    (order as SamoOrder & { departure_date?: string }).departure_date;
  const to =
    order.check_out_date ||
    (order as SamoOrder & { arrival_time?: string; travel_time?: string })
      .arrival_time ||
    (order as SamoOrder & { travel_time?: string }).travel_time;

  if (!from || !to) return '—';

  const fromDate = dayjs(from);
  const toDate = dayjs(to);
  const fromLabel = fromDate.isValid()
    ? fromDate.format('DD.MM.YYYY')
    : String(from);
  const toLabel = toDate.isValid() ? toDate.format('DD.MM.YYYY') : String(to);
  return `${fromLabel} / ${toLabel}`;
}

function formatAccommodationDates(order: SamoOrder) {
  const from =
    order.check_in_date ||
    (order as SamoOrder & { departure_date?: string }).departure_date;
  const to =
    order.check_out_date ||
    (order as SamoOrder & { arrival_time?: string; travel_time?: string })
      .arrival_time ||
    (order as SamoOrder & { travel_time?: string }).travel_time;

  if (!from || !to) return '—';
  const fromDate = dayjs(from);
  const toDate = dayjs(to);
  if (!fromDate.isValid() || !toDate.isValid()) return '—';
  return `${fromDate.format('DD.MM.YYYY')} - ${toDate.format('DD.MM.YYYY')}`;
}

function formatFlightDate(value?: string) {
  if (!value) return '—';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD.MM.YYYY') : '—';
}

function formatFlightTime(value?: string) {
  if (!value) return '—';
  if (value.length >= 12) {
    const parsed = dayjs(value);
    if (parsed.isValid()) return parsed.format('HH:mm');
  }
  return value;
}

function airportCode(name?: string) {
  if (!name) return '—';
  const cleaned = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return cleaned.slice(0, 3) || name.slice(0, 3).toUpperCase();
}

function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll('img'));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 1500);
        }),
    ),
  );
}

function createIsolatedIframe() {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '0';
  iframe.style.top = '0';
  iframe.style.width = '794px';
  iframe.style.height = '2000px';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-1';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    document.body.removeChild(iframe);
    throw new Error('Failed to create isolated iframe');
  }

  doc.open();
  doc.write(
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#ffffff;color:#111827;font-family:Arial,Helvetica,sans-serif;"></body></html>',
  );
  doc.close();

  return { iframe, mountNode: doc.body, contentWindow: win };
}

async function generatePdfFromElement(
  element: HTMLElement,
  fileName: string,
  contentWindow?: Window,
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    ...(contentWindow ? { window: contentWindow } : {}),
  });

  if (!canvas.width || !canvas.height) {
    throw new Error('Voucher canvas is empty');
  }

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

function IconBadge({
  children,
  size = 28,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '6px',
        backgroundColor: COLORS.blueLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function formatLocationWithCountry(name?: string, country?: string) {
  if (name && country) return `${name}, ${country}`;
  return name || country || '—';
}

function TourPackageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
        stroke={COLORS.blue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
        stroke={COLORS.blue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11V17M9 14H15"
        stroke={COLORS.blue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 21H21M5 21V7L12 3L19 7V21M9 9H10M9 13H10M14 9H15M14 13H15M9 17H15V21H9V17Z"
        stroke={COLORS.blue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlaneIcon({ size = 16 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M10.5 13.5L6 18.5L7.5 20L12 15.5L16.5 20L18 18.5L13.5 13.5L21 6H16L12 10L8 6H3L10.5 13.5Z"
          fill={COLORS.blue}
        />
      </svg>
    );
  }
function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11ZM22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11678 19.0078 7.005C19.0078 7.89322 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
        stroke={COLORS.blue}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PassengerCounters({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.blue} aria-hidden>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20C4 16.6863 7.13401 14 12 14C16.866 14 20 16.6863 20 20" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.blue }}>
          {count}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '18px 0 10px',
      }}
    >
      <IconBadge>{icon}</IconBadge>
      <h2
        style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: 700,
          color: COLORS.text,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function Th({
  children,
  width,
}: {
  children: ReactNode;
  width?: string;
}) {
  return (
    <th
      style={{
        width,
        padding: '10px 12px',
        textAlign: 'left',
        fontSize: '10px',
        fontWeight: 700,
        color: COLORS.textMuted,
        backgroundColor: COLORS.headerBg,
        borderBottom: `1px solid ${COLORS.border}`,
        verticalAlign: 'top',
        lineHeight: 1.35,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  bold,
  preLine,
}: {
  children: ReactNode;
  bold?: boolean;
  preLine?: boolean;
}) {
  return (
    <td
      style={{
        padding: '12px',
        fontSize: '11px',
        color: COLORS.text,
        fontWeight: bold ? 700 : 400,
        borderBottom: `1px solid ${COLORS.border}`,
        verticalAlign: 'top',
        whiteSpace: preLine ? 'pre-line' : 'normal',
        lineHeight: 1.45,
      }}
    >
      {children}
    </td>
  );
}

type OrderVoucherDocumentProps = {
  order: SamoOrder;
  locale: LanguageRoutes;
  labels: VoucherLabels;
  tourExtras: TourExtras;
  printDateTime: string;
  assets: VoucherAssets;
  voucherUrl: string;
};

export function VoucherDocument({
  order,
  tourExtras,
  printDateTime,
  assets,
}: OrderVoucherDocumentProps) {
  const participants = resolveParticipantDetails(order);
  const touristNames = resolveTouristNames(participants);
  const stayRange = formatStayDates(order);
  const accommodationDates = formatAccommodationDates(order);
  const roomType = tourExtras.room_type || 'STD';
  const mealCode = getMealShort(order.meal_plan);
  const transferType =
    tourExtras.freight_external || tourExtras.place || 'GROUP';
  const hotelBlock = `${order.hotel_name || order.title || '—'} (${roomType}, ${mealCode})`;
  const departureLocation = formatLocationWithCountry(
    order.departure_name,
    order.departure_country_name,
  );
  const destinationLocation = formatLocationWithCountry(
    order.destination_name,
    order.destination_country_name,
  );

  return (
    <div
      id="order-voucher-document"
      style={{
        width: '794px',
        backgroundColor: COLORS.white,
        padding: '28px 32px 24px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: COLORS.text,
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ width: '220px' }}>
          {assets.logoSrc ? (
            <img
              src={assets.logoSrc}
              alt={BRAND_NAME}
              style={{
                width: '150px',
                height: '48px',
                objectFit: 'contain',
                objectPosition: 'left center',
                display: 'block',
              }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: COLORS.blue }}>
              {BRAND_NAME}
            </p>
          )}
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: COLORS.textMuted }}>
            {BRAND_NAME} Uzbekistan
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: COLORS.text }}>
            Турпакет: <strong>#{order.id}</strong>
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '10px', color: COLORS.textMuted }}>
            MCHJ: {COMPANY_NAME}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {assets.qrSrc ? (
            <img src={assets.qrSrc} alt="QR" width={118} height={118} />
          ) : (
            <div
              style={{
                width: 118,
                height: 118,
                border: `1px dashed ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: COLORS.textMuted,
              }}
            >
              QR
            </div>
          )}
          <p
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: COLORS.text,
            }}
          >
            VOUCHER
          </p>
        </div>

        <div style={{ width: '170px', textAlign: 'right' }}>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 700,
              color: COLORS.text,
            }}
          >
            {stayRange}
          </p>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <PassengerCounters count={order.passenger_count || participants.length} />
          </div>
        </div>
      </div>

      {/* TOUR INFO */}
      <SectionTitle
        icon={<TourPackageIcon />}
        title="Турпакет / Tour Package"
      />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            <Th width="24%">Название / Title</Th>
            <Th width="18%">Откуда / Departure</Th>
            <Th width="18%">Куда / Destination</Th>
            <Th width="14%">Пассажиры / Passengers</Th>
            <Th width="14%">Длительность / Duration</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td bold>{order.title || '—'}</Td>
            <Td>{departureLocation}</Td>
            <Td>{destinationLocation}</Td>
            <Td>{order.passenger_count ?? '—'}</Td>
            <Td>
              {order.duration_days
                ? `${order.duration_days} ${order.duration_days === 1 ? 'день' : 'дней'}`
                : '—'}
            </Td>
          </tr>
        </tbody>
      </table>

      {/* HOTEL & TRANSFER */}
      <SectionTitle
        icon={<HotelIcon />}
        title="Отель и Трансфер / Hotel and Transfer"
      />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            <Th width="18%">Туристы / Tourists</Th>
            <Th width="16%">Проживание / Accommodation</Th>
            <Th width="28%">Отель / Тип номера / Питание</Th>
            <Th width="16%"> Тип питания / Meal Type</Th>
            <Th width="22%">Принимающая компания / DMC</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td preLine>{touristNames}</Td>
            <Td>{accommodationDates}</Td>
            <Td bold>{hotelBlock}</Td>
            <Td>{mealCode}</Td>
            <Td>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  backgroundColor: COLORS.headerBg,
                  fontWeight: 700,
                  fontSize: '11px',
                  color: COLORS.blue,
                  textTransform: 'uppercase',
                }}
              >
                {order.tour_operator || tourExtras.operator || '—'}
              </div>
            </Td>
          </tr>
        </tbody>
      </table>

      {/* FLIGHT + TOURISTS */}
      {/* <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
        <div style={{ flex: 1 }}>
          <SectionTitle
            icon={<PlaneIcon />}
            title="Полётные данные / Flight data"
          />
          <div
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              padding: '14px',
              minHeight: '180px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <PlaneIcon size={18} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>
                Прямой чартерный рейс / Direct charter
              </span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '10px', color: COLORS.textMuted }}>
                ТУДА / OUTBOUND · {outboundDate}
              </p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>
                {airportCode(departureName)} → {airportCode(destinationName)}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: COLORS.textMuted }}>
                {outboundTime}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 6px', fontSize: '10px', color: COLORS.textMuted }}>
                ОБРАТНО / INBOUND · {inboundDate}
              </p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>
                {airportCode(destinationName)} → {airportCode(departureName)}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: COLORS.textMuted }}>
                {outboundTime}
              </p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1.2 }}>
          <SectionTitle icon={<PeopleIcon />} title="Туристы / Tourists" />
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr>
                <Th width="10%">Класс</Th>
                <Th width="28%">Турист</Th>
                <Th width="8%">Пол</Th>
                <Th width="18%">Дата рожд.</Th>
                <Th width="14%">Гражд.</Th>
                <Th width="22%">Документ</Th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => (
                <tr key={`${p.fullName}-${index}`}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PlaneIcon size={12} />
                      <span>{p.travelClass}</span>
                    </div>
                  </Td>
                  <Td bold>{p.fullName}</Td>
                  <Td>{p.gender}</Td>
                  <Td>{p.birthDate}</Td>
                  <Td>{p.citizenship}</Td>
                  <Td>{p.document}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* FOOTER */}
      <p
        style={{
          margin: '20px 0 10px',
          fontSize: '10px',
          color: COLORS.textMuted,
          textAlign: 'right',
        }}
      >
        Время и дата печати счёта: {printDateTime}
      </p>

      <div
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {assets.footerQrSrc ? (
            <img
              src={assets.footerQrSrc}
              alt="Support QR"
              width={58}
              height={58}
            />
          ) : null}
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: COLORS.blue }}>
              🎧 Поддержка туристов 24/7
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: COLORS.text }}>
              {BRAND_NAME.toUpperCase()} 
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: COLORS.textMuted }}>
              {BRAND_NAME.toLowerCase().replace(' ', '')}.uz
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '10px', color: COLORS.textMuted }}>
           Контактные номера / Contact numbers
          </p>
          <p
            style={{
              margin: '4px 0 10px',
              fontSize: '13px',
              fontWeight: 700,
              color: COLORS.blue,
            }}
          >
            📞 {SUPPORT_PHONE}
          </p>
          {/* <p style={{ margin: 0, fontSize: '10px', color: COLORS.textMuted }}>
            Короткий номер
          </p> */}
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              fontWeight: 700,
              color: COLORS.blue,
            }}
          >
            📞 {SUPPORT_PHONE_2}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function downloadOrderVoucherPdf({
  orderId,
  locale,
  labels,
}: {
  orderId: number;
  locale: LanguageRoutes;
  labels: VoucherLabels;
}) {
  const response = await Ticketorder_Api.getOrderById({ id: orderId });
  const order = unwrapOrder(response.data);

  if (!order?.id) {
    throw new Error('Order data is invalid');
  }

  const tourExtras = getTourExtrasFromLocalStorage();
  const printDateTime = dayjs().format('DD.MM.YYYY HH:mm');
  const voucherUrl = getVoucherUrl(order.id, locale);
  const assets = await loadVoucherAssets(voucherUrl);

  const { iframe, mountNode, contentWindow } = createIsolatedIframe();
  const root = createRoot(mountNode);

  try {
    root.render(
      <VoucherDocument
        order={order}
        locale={locale}
        labels={labels}
        tourExtras={tourExtras}
        printDateTime={printDateTime}
        assets={assets}
        voucherUrl={voucherUrl}
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
    await waitForImages(mountNode);

    const voucherElement = mountNode.querySelector(
      '#order-voucher-document',
    ) as HTMLElement | null;

    if (!voucherElement) {
      throw new Error('Voucher element not found');
    }

    await generatePdfFromElement(
      voucherElement,
      `voucher-order-${orderId}.pdf`,
      contentWindow,
    );
  } finally {
    root.unmount();
    document.body.removeChild(iframe);
  }
}

export type { VoucherLabels };

import type { AviaFlightInfo } from '../lib/api';
import { BusFront, CalendarDays, Clock3, MapPin, Plane, Route } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  flights?: AviaFlightInfo[];
}

function formatFlightDateTime(value?: string) {
  if (!value) return { time: '--:--', date: '--.--.----' };

  const [datePart, timePartWithZone] = value.split(' ');
  const time = timePartWithZone?.slice(0, 5) || '--:--';
  const [year, month, day] = (datePart || '').split('-');

  return {
    time,
    date: day && month && year ? `${day}.${month}.${year}` : datePart || '--.--.----',
  };
}

export default function FlightInfoCard({ flights }: Props) {
  const t = useTranslations();

  if (!flights?.length) return null;

  return (
    <section className="flex w-full flex-col gap-4 rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_32px_rgba(17,34,17,0.08)] max-lg:p-4">
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#ECF2FF] text-[#1A73E8]">
            <Plane size={22} />
          </div>
          <div>
            <p className="text-[20px] font-bold leading-6 text-[#112211] max-sm:text-[18px]">
              {t('Avia reyslar')}
            </p>
            <p className="text-[13px] font-medium text-[#6B7280]">
              {t("Uchish va qo'nish ma'lumotlari")}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#FFF4EC] px-4 py-2 text-[13px] font-semibold text-[#FF6B00]">
          {t('Reyslar soni', { count: flights.length })}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {flights.map((flight, index) => {
          const departure = formatFlightDateTime(flight.departure?.local_time);
          const arrival = formatFlightDateTime(flight.arrival?.local_time);

          return (
            <article
              key={`${flight.number || 'flight'}-${index}`}
              className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-gradient-to-br from-white via-white to-[#F8FBFF]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 max-sm:flex-col max-sm:items-start max-sm:px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A73E8] text-white">
                    <Plane size={18} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#112211]">
                      {flight.airline || t('Avia kompaniya')}
                    </p>
                    <p className="text-[13px] font-medium text-[#6B7280]">
                      {t('Reys raqami')}: {flight.number || '-'}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] font-semibold text-[#1A73E8] shadow-sm">
                  <Clock3 size={16} />
                  <span>{flight.flight_time || '--:--'}</span>
                </div> */}
              </div>

              <div className="grid grid-cols-2 items-start gap-6 px-5 py-6 max-sm:gap-3 max-sm:px-4 max-sm:py-5">
                <div className="flex min-w-0 flex-col gap-3 max-sm:gap-2">
                  <div className="flex items-center gap-2 text-[#6B7280] max-sm:gap-1.5">
                    <CalendarDays size={16} className="max-sm:h-3.5 max-sm:w-3.5" />
                    <span className="text-[13px] font-medium max-sm:text-[11px]">{departure.date}</span>
                  </div>
                  <div>
                    <p className="text-[28px] font-bold leading-8 text-[#112211] max-sm:text-[20px] max-sm:leading-6">
                      {departure.time}
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#1A73E8] max-sm:text-[14px]">
                      {flight.departure?.iata || 'TAS'}
                    </p>
                    <div className="mt-2 flex items-start gap-2 text-[#6B7280] max-sm:mt-1.5 max-sm:gap-1.5">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#FF6B00] max-sm:h-3.5 max-sm:w-3.5" />
                      <p className="text-[13px] font-medium leading-5 max-sm:line-clamp-2 max-sm:text-[10px] max-sm:leading-4">
                        {flight.departure?.name || t('Tashkent International Airaport')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col items-end gap-3 text-right max-sm:gap-2">
                  <div className="flex items-center gap-2 text-[#6B7280] max-sm:gap-1.5">
                    <CalendarDays size={16} className="max-sm:h-3.5 max-sm:w-3.5" />
                    <span className="text-[13px] font-medium max-sm:text-[11px]">{arrival.date}</span>
                  </div>
                  <div>
                    <p className="text-[28px] font-bold leading-8 text-[#112211] max-sm:text-[20px] max-sm:leading-6">
                      {arrival.time}
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#FF6B00] max-sm:text-[14px]">
                      {flight.arrival?.iata || '-'}
                    </p>
                    <div className="mt-2 flex items-start justify-end gap-2 text-[#6B7280] max-sm:mt-1.5 max-sm:gap-1.5">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#FF6B00] max-sm:h-3.5 max-sm:w-3.5" />
                      <p className="text-[13px] font-medium leading-5 max-sm:line-clamp-2 max-sm:text-[10px] max-sm:leading-4">
                        {flight.arrival?.name || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center gap-2">
                  <div className="flex w-full items-center gap-2 max-sm:gap-1.5">
                    <span className="h-3 w-3 rounded-full border-2 border-[#1A73E8] bg-white max-sm:h-2.5 max-sm:w-2.5" />
                    <span className="h-px flex-1 bg-[#1A73E8]/30" />
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECF2FF] text-[#1A73E8] shadow-sm max-sm:h-8 max-sm:w-8">
                      <Plane size={18} className="max-sm:h-4 max-sm:w-4" />
                    </div>
                    <span className="h-px flex-1 bg-[#1A73E8]/30" />
                    <span className="h-3 w-3 rounded-full bg-[#FF6B00] max-sm:h-2.5 max-sm:w-2.5" />
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] max-sm:gap-1.5 max-sm:text-[11px]">
                    <Route size={16} className="max-sm:h-3.5 max-sm:w-3.5" />
                    <span>{t('Parvoz vaqti')}: {flight.flight_time || '--:--'}</span>
                  </div>
                </div>
              </div>
            {flight.aircraft && (
              <div className="flex items-center gap-2 border-t border-[#E5E7EB] px-5 py-4 text-[13px] font-semibold text-[#6B7280] max-sm:px-4">
                <BusFront size={16} className="text-[#1A73E8]" />
                <span>{t('Transfer')}: {flight.aircraft}</span>
              </div>
            )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

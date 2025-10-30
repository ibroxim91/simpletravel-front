import { Link } from '@/shared/config/i18n/navigation';
import { TabsContent } from '@/shared/ui/tabs';
import { getContact } from '@/widgets/footer/lib/api';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

const SupportTabs = () => {
  const t = useTranslations();

  const { data: contact } = useQuery({
    queryKey: ['get_contact'],
    queryFn: () => getContact(),
    select(data) {
      return data.data.data.results;
    },
  });

  return (
    <TabsContent value="support" className="flex flex-col gap-4">
      <div className="bg-white px-4 py-6 rounded-3xl w-full shadow-sm">
        <p className="text-xl text-[#212122] font-semibold">
          {t('Служба поддержки')}
        </p>
        <div className="bg-[#DFDFDF] w-full h-[2px] mt-5" />
        {contact && contact[0].telegram_chat && (
          <Link
            href={contact ? contact[0].telegram_chat : '/'}
            className="bg-[#EDEEF140] cursor-pointer w-full shadow-sm border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
                <TelegramIcon
                  sx={{ color: '#ffff', width: '32px', height: '32px' }}
                />
              </div>
              <p className="font-semibold text-[#212122]">
                {t('Онлайн чат телеграм')}
              </p>
            </div>
            <ChevronRightIcon sx={{ width: '28px', height: '28px' }} />
          </Link>
        )}
        <Link
          href={contact ? `tel:${contact[0].main_phone}` : '/'}
          className="bg-[#EDEEF140] cursor-pointer shadow-sm w-full border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
              <LocalPhoneIcon
                sx={{ color: '#ffff', width: '32px', height: '32px' }}
              />
            </div>
            <p className="font-semibold text-[#212122]">{t('Колл центр')}</p>
          </div>
          {contact && (
            <p className="font-semibold text-[#084FE3]">
              {contact[0].main_phone}
            </p>
          )}
        </Link>
        <Link
          href={contact ? `tel:${contact[0].other_phone}` : '/'}
          className="bg-[#EDEEF140] cursor-pointer shadow-sm w-full border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
              <LocalPhoneIcon
                sx={{ color: '#ffff', width: '32px', height: '32px' }}
              />
            </div>
            <p className="font-semibold text-[#212122]">{t('Колл центр')}</p>
          </div>
          {contact && (
            <p className="font-semibold text-[#084FE3]">
              {contact[0].other_phone}
            </p>
          )}
        </Link>
      </div>
    </TabsContent>
  );
};

export default SupportTabs;

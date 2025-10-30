import { Link } from '@/shared/config/i18n/navigation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslations } from 'next-intl';

const SupportTabs = () => {
  const t = useTranslations();

  return (
    <div className="bg-white px-4 py-6 rounded-3xl w-full shadow-sm">
      <p className="text-xl text-[#212122] font-semibold">
        {t('Служба поддержки')}
      </p>
      <div className="bg-[#DFDFDF] w-full h-[2px] mt-5" />
      <Link
        href={'https://web.telegram.org/a/#-1001169511702'}
        className="bg-[#EDEEF140] cursor-pointer w-full shadow-sm border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
            <TelegramIcon
              sx={{ color: '#ffff', width: '32px', height: '32px' }}
            />
          </div>
          <p className="font-semibold text-[#212122]">Онлайн чат телеграм</p>
        </div>
        <ChevronRightIcon sx={{ width: '28px', height: '28px' }} />
      </Link>
      <Link
        href={'tel:9778'}
        className="bg-[#EDEEF140] cursor-pointer shadow-sm w-full border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
            <LocalPhoneIcon
              sx={{ color: '#ffff', width: '32px', height: '32px' }}
            />
          </div>
          <p className="font-semibold text-[#212122]">Колл центр</p>
        </div>
        <p className="font-semibold text-[#084FE3]">9778</p>
      </Link>
      <Link
        href={'tel:9778'}
        className="bg-[#EDEEF140] cursor-pointer shadow-sm w-full border flex items-center justify-between gap-4 border-[#EDEEF1] mt-5 px-4 py-5 rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#084FE3] w-fit p-2 rounded-lg">
            <LocalPhoneIcon
              sx={{ color: '#ffff', width: '32px', height: '32px' }}
            />
          </div>
          <p className="font-semibold text-[#212122]">Колл центр</p>
        </div>
        <p className="font-semibold text-[#084FE3]">99 222 29 22</p>
      </Link>
    </div>
  );
};

export default SupportTabs;

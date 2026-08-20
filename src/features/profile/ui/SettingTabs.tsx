import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslations } from 'next-intl';

const SettingTabs = () => {
  const t = useTranslations();
  return (
    <div className="bg-white w-full h-[600px] rounded-3xl p-6">
      <p className="text-2xl text-[#212122] font-semibold">{t('Настройки')}</p>
      <hr className="h-[2px] bg-[#EDEEF1] mt-5" />
      <Link
        href={'/auth/edit-password'}
        className="w-full mt-5 bg-[#EDEEF140] border border-[#EDEEF1] p-2 rounded-xl flex justify-between items-center cursor-pointer"
      >
        <div className="flex gap-2 items-center">
          <Button className="bg-[#084FE3] !px-3 !py-6 rounded-lg hover:bg-[#084FE3]">
            <LockIcon sx={{ width: '28px', height: '28px' }} />
          </Button>
          <p className="text-lg font-semibold text-[#212122]">
            {t('Изменить пароль')}
          </p>
        </div>
        <ChevronRightIcon
          sx={{ width: '30px', height: '30px', color: '#212122' }}
        />
      </Link>

      <Link
        href={'/delete-account'}
        className="w-full mt-4 bg-[#FFF4F4] border border-[#FFD6D6] p-2 rounded-xl flex justify-between items-center cursor-pointer"
      >
        <div className="flex gap-2 items-center">
          <Button className="bg-[#D92D20] !px-3 !py-6 rounded-lg hover:bg-[#D92D20]">
            <DeleteOutlineIcon sx={{ width: '28px', height: '28px' }} />
          </Button>
          <p className="text-lg font-semibold text-[#B42318]">
            {t('delete_account_title')}
          </p>
        </div>
        <ChevronRightIcon
          sx={{ width: '30px', height: '30px', color: '#B42318' }}
        />
      </Link>
    </div>
  );
};

export default SettingTabs;

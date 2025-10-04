import { Link } from '@/shared/config/i18n/navigation';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useTranslations } from 'next-intl';

const HeadresFaq = () => {
  const t = useTranslations();
  return (
    <div className="custom-container mt-5">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{ '& .MuiBreadcrumbs-separator': { mx: 2 } }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          {t('Главная')}
        </Link>
        <p className="text-[#646465] font-medium">{t('Ответы на вопросы')}</p>
      </Breadcrumbs>
    </div>
  );
};

export default HeadresFaq;

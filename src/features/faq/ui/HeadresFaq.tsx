import { Link } from '@/shared/config/i18n/navigation';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const HeadresFaq = () => {
  return (
    <div className="custom-container mt-5">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{ '& .MuiBreadcrumbs-separator': { mx: 2 } }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          Главная страница
        </Link>
        <p className="text-[#646465] font-medium">Ответы на вопросы</p>
      </Breadcrumbs>
    </div>
  );
};

export default HeadresFaq;

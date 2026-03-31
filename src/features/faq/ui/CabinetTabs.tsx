import { TabsContent } from '@/shared/ui/tabs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

const CabinetTabs = () => {
  return (
    <TabsContent value="cabinet" className="flex flex-col gap-4">
      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Как забронировать тур?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Нужно ли вносить предоплату?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Какие способы оплаты доступны?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Возвращаются ли деньги при отмене?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Нужна ли виза?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Что делать, если я потерял документы в поездке?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Как связаться с вами?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{
          borderRadius: '15px !important',
          py: '10px',
          boxShadow: 'none',
          '&::before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
          sx={{
            '&.Mui-expanded .MuiTypography-root': {
              color: '#084FE3',
            },
          }}
        >
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Нужно ли вносить предоплату?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: '#212122' }}>
          Вы можете выбрать тур на сайте и оформить бронирование онлайн,
          заполнив короткую форму
        </AccordionDetails>
      </Accordion>
    </TabsContent>
  );
};

export default CabinetTabs;

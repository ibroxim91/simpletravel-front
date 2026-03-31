import { TabsContent } from '@/shared/ui/tabs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { FaqData } from '../lib/api';

const ServiceTab = ({ faqs }: { faqs: FaqData }) => {
  return (
    <TabsContent value={faqs.name} className="flex flex-col gap-4">
      {faqs.faqs.map((e) => (
        <Accordion
          sx={{
            borderRadius: '15px !important',
            py: '10px',
            boxShadow: 'none',
            '&::before': { display: 'none' },
          }}
          key={`${faqs.id}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ width: 28, height: 28 }} />}
            sx={{
              '&.Mui-expanded .MuiTypography-root': {
                color: '#084FE3',
              },
            }}
          >
            <Typography
              component="span"
              sx={{ fontWeight: 600, color: '#212122' }}
            >
              {e.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: '#212122' }}>
            {e.text}
          </AccordionDetails>
        </Accordion>
      ))}
    </TabsContent>
  );
};

export default ServiceTab;

import { Box, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';

export const NoDataFound = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <DescriptionIcon fontSize='large' sx={{ color: 'primary.main' }} />
      <Typography
        sx={{
          mt: 2,
          color: 'black',
          whiteSpace: 'nowrap',
          fontSize: '0.875rem',
          fontFamily: 'Montserrat',
        }}
      >
        {t('common.noDataFound')}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontFamily: 'Montserrat',
        }}
      >
        {t('common.noDataFoundHint')}
      </Typography>
    </Box>
  );
};

// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Button, Divider, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
// components
// ----------------------------------------------------------------------

const BoxStyle = styled(Button)(() => ({
  borderRadius: '50%',
  border: '1px solid #a3a3a3',
  maxWidth: 300,
  maxHeight: 300,
  margin: 'auto',
}));

// ----------------------------------------------------------------------
type UnitTypeItemProps = {
  label: string;
  onSelectItem: Function;
  id?: number | string;
  active?: boolean;
  productTypeValue?: string;
  SetIsOpenSideDescriptionOfProductType: (value: boolean) => void;
};

export default function UnitTypeItem({
  label,
  productTypeValue,
  onSelectItem,
  SetIsOpenSideDescriptionOfProductType,
  id,
  active,
}: UnitTypeItemProps) {
  const images: Record<string, string> = {
    ERV: '/assets/Images/new_unit_crossflow_erv.png',
    HRV: '/assets/Images/new_unit_counterflow_hrv.png',
  };

  let imageUrl = images[label as keyof typeof images] || '/assets/Images/default_image.png';

  if (label === 'ERV') {
    if (['Ventum', 'Ventum Lite', 'Ventum Plus'].includes(productTypeValue || '')) {
      imageUrl = '/assets/Images/new_unit_counterflow_erv.png';
    } else {
      imageUrl = '/assets/Images/new_unit_crossflow_erv.png';
    }
  }  
  return (
    <Box textAlign="center">
      <BoxStyle
        id={id?.toString() || ''}
        onClick={() => onSelectItem(id)}
        sx={{
          borderColor: active ? 'primary.main' : '#a3a3a3',
        }}
      >
        <img src={imageUrl} width="100%" height="100%" alt={label} />
      </BoxStyle>
      <Box sx={{ textAlign: 'center', fontSize: '14px' }} mb={1}>
        <Typography>
          {label}
          <span>
            <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }} onClick={()=>SetIsOpenSideDescriptionOfProductType(true)}>
            </IconButton>
          </span>
        </Typography>   
      </Box>
      <Divider />
      <Stack textAlign="center" spacing={2} mt={1}>
        <Typography>ERV</Typography>
        <Typography>Indoor/Outdoor</Typography>
        <Typography>Standard Efficiency</Typography>
        <Typography>VRV Integration</Typography>
      </Stack>
    </Box>
  );
}

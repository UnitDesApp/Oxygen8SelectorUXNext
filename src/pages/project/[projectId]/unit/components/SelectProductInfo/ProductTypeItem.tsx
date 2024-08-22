// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Button, Divider, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

const BoxStyle = styled(Button)(() => ({
  borderRadius: '50%',
  border: '1px solid #a3a3a3',
  maxWidth: 300,
  maxHeight: 300,
  margin: 'auto',
}));

// ----------------------------------------------------------------------
type ProductTypeItemProps = {
  label: string;
  onSelectItem: Function;
  id?: string;
  active?: boolean;
};

type ImageLabels = 'Nova' | 'Ventum' | 'Ventum Lite' | 'Terra' | 'Ventum Plus';

export default function ProductTypeItem({ label, onSelectItem, id, active }: ProductTypeItemProps) {
  const images: Record<any, string> = {
    Nova: '/assets/Images/new_unit_nova.png',
    Ventum: '/assets/Images/new_unit_ventum_h.png',
    'Ventum Lite': '/assets/Images/new_unit_ventum lite.png',
    Terra: '/assets/Images/new_unit_terra.png',
    'Ventum Plus': '/assets/Images/new_unit_ventum_plus.png',
  };

  const values: Record<ImageLabels, string[]> = {
    Nova: [
      '325 - 8,100 cfm',
      'ERV',
      'Crossflow Core (Standard Efficiency)',
      'Indoor / Outdoor',
      'Horizontal / Vertical',
      'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
    ],
    Ventum: [
      '350 - 3,000 cfm',
      'ERV / HRV',
      'Counterflow Core (High Efficiency)',
      'Indoor',
      'Horizontal',
      'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
    ],
    'Ventum Lite': [
      '200 - 450 cfm',
      'ERV / HRV',
      'Counterflow Core (High Efficiency)',
      'Indoor',
      'Horizontal',
      'Electric pre-heater',
    ],
    Terra: [
      '425 - 4,800 cfm',
      '-',
      '-',
      'Indoor',
      'Horizontal',
      'Daikin VRV Integration, Electric heater',
    ],
    'Ventum Plus': [
      '1,200 - 10,000 cfm',
      'ERV / HRV',
      'Counterflow Core (High Efficiency)',
      'Indoor / Outdoor',
      'Vertical',
      'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
    ],
  };

  const imageUrl = images[label as any] || '/assets/Images/default_image.png';
  const labelValues = values[label as ImageLabels] || [];
  
  return (
    <Box textAlign="center">
      <BoxStyle
        id={id || ''}
        onClick={() => onSelectItem(id)}
        sx={{ borderColor: active ? 'primary.main' : '#a3a3a3' }}
      >
        <img src={imageUrl} width="100%" height="100%" alt={label} />
      </BoxStyle>
      <Box sx={{ textAlign: 'center', fontSize: '14px' }} mb={1}>
        <Typography>
          {label}
          <span>
            <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
              <Iconify icon="ant-design:exclamation-circle-outlined" />
            </IconButton>
          </span>
        </Typography>
      </Box>
      <Divider />
      <Stack textAlign="center" spacing={2} mt={1}>
        {labelValues.map((value, index) => (
          <Typography key={index}>{value}</Typography>
        ))}
      </Stack>
    </Box>
  );
}

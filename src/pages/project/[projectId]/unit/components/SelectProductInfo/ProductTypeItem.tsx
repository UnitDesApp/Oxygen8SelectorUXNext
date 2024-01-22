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
export default function ProductTypeItem({ label, onSelectItem, id, active }: ProductTypeItemProps) {
  return (
    <Box textAlign={'center'}>
      <BoxStyle
        id={id || ''}
        onClick={() => onSelectItem(id)}
        sx={{
          borderColor: active ? 'primary.main' : '#a3a3a3',
        }}
      >
        <img src="/assets/Images/img_nova_1.png" width="100%" height="100%" alt={label} />
      </BoxStyle>
      <Box sx={{ textAlign: 'center', fontSize: '14px' }} mb={1}>
        <Typography>
          {label}
          <span>
            <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
              <Iconify icon={'ant-design:exclamation-circle-outlined'} />
            </IconButton>
          </span>
        </Typography>
      </Box>
      <Divider />
      <Stack textAlign={'center'} spacing={2} mt={1}>
        <Typography>ERV</Typography>
        <Typography>Indoor/Outdoor</Typography>
        <Typography>Standard Efficiency</Typography>
        <Typography>VRV Integration</Typography>
      </Stack>
    </Box>
  );
}

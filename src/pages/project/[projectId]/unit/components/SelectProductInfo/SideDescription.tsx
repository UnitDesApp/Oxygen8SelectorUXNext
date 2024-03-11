// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Divider,
  Stack,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------
const ImageBorderStyle = styled(Box)(() => ({
  width: '100%',
  borderRadius: '10px',
  border: '1px solid #484848',
}));

// ----------------------------------------------------------------------
type SideDescriptionProps = {
  open: boolean;
  handleDrawerClose: Function;
  productInfomation: any;
  sx: any;
};
export default function SideDescription({
  open,
  handleDrawerClose,
  productInfomation,
  sx,
}: SideDescriptionProps) {
  const { title, image, description } = productInfomation || {};
  return (
    <Drawer anchor="right" open={open} onClose={() => handleDrawerClose(0)}>
      <Box sx={{ ...sx, padding: 3, width: '300px', paddingBottom: '120px', paddingTop: '100px' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography color="primary.main" variant="h6">
            About {title}
          </Typography>
          <IconButton onClick={() => handleDrawerClose()} sx={{ width: '40px', mb: 1 }}>
            <Iconify icon="iconoir:cancel" />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            rowGap: 3,
            columnGap: 2,
            gridTemplateColumns: 'repeat(1, 1fr)',
            mb: 2,
          }}
        >
          <ImageBorderStyle>
            <img src={image} alt={description} width="100%" />
          </ImageBorderStyle>
          <Box>
            <Typography variant="body2">{description}</Typography>
          </Box>
        </Box>
        <Divider />
        <Stack sx={{ mt: 2 }}>
          <Typography color="primary.main">LEARN MORE</Typography>
          <List>
            <Link component="button" variant="body2" color="">
              <ListItem>
                <ListItemIcon>
                  <Iconify icon="ic:baseline-download" />
                </ListItemIcon>
                <ListItemText primary="View product brocure" />
              </ListItem>
            </Link>
            <Link component="button" variant="body2" color="">
              <ListItem>
                <ListItemIcon>
                  <Iconify icon="ic:baseline-download" />
                </ListItemIcon>
                <ListItemText primary="View product brocure" />
              </ListItem>
            </Link>
            <Link component="button" variant="body2" color="">
              <ListItem>
                <ListItemIcon>
                  <Iconify icon="ic:baseline-download" />
                </ListItemIcon>
                <ListItemText primary="View product brocure" />
              </ListItem>
            </Link>
          </List>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
          >
            <Typography color="primary.main">View more resources</Typography>
            <Iconify
              color="primary.main"
              icon="ic:baseline-keyboard-arrow-right"
              width="24px"
              height="24px"
            />
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

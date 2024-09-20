// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Button, Divider, Stack, Grid } from '@mui/material';
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
  prodTypeDesc: any;
  prodTypeImage: any;
};

type ImageLabels = 'Nova' | 'Ventum' | 'Ventum Plus' | 'Ventum Lite' | 'Terra';

export default function ProductTypeItem({ 
  label, 
  onSelectItem, 
  id, 
  active, 
  prodTypeDesc,
  prodTypeImage, }: ProductTypeItemProps) {
  
  //   const images: Record<any, string> = {
  //   'Nova': '/assets/Images/new_unit_nova.png',
  //   'Ventum': '/assets/Images/new_unit_ventum_h.png',
  //   'Ventum Plus': '/assets/Images/new_unit_ventum_plus.png',
  //   'Ventum Lite': '/assets/Images/new_unit_ventum lite.png',
  //   'Terra': '/assets/Images/new_unit_terra.png',
  // };

  // const values: Record<ImageLabels, (string | JSX.Element)[]> = {
  //   'Nova': [
  //     '325 - 8,100 cfm',
  //   //   <Button variant="outlined" color="primary"
  //   //   onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
  //   // >
  //   //    Comparison guide
  //   // </Button>,
  //     'ERV',
  //     'Crossflow Core (Standard Efficiency)',
  //     'Indoor / Outdoor',
  //     'Horizontal / Vertical',
  //     'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
  //   ],
  //   'Ventum': [
  //     '350 - 3,000 cfm',
  //   //   <Button variant="outlined" color="primary"
  //   //   onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
  //   // >
  //   //    Comparison guide
  //   // </Button>,
  //     'ERV / HRV',
  //     'Counterflow Core (High Efficiency)',
  //     'Indoor',
  //     'Horizontal',
  //     'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
  //   ],
  //   'Ventum Plus': [
  //     '1,200 - 10,000 cfm',
  //   //   <Button variant="outlined" color="primary"
  //   //   onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
  //   // >
  //   //    Comparison guide
  //   // </Button>,
  //     'ERV / HRV',
  //     'Counterflow Core (High Efficiency)',
  //     'Indoor / Outdoor',
  //     'Vertical',
  //     'Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)',
  //   ],
  //   'Ventum Lite': [
  //     '200 - 450 cfm',
  //   //   <Button variant="outlined" color="primary"
  //   //   onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
  //   // >
  //   //    Comparison guide
  //   // </Button>,
  //     'ERV / HRV',
  //     'Counterflow Core (High Efficiency)',
  //     'Indoor',
  //     'Horizontal',
  //     'Electric pre-heater',
  //   ],
  //   'Terra': [
  //     '425 - 4,800 cfm',
  //   //   <Button variant="outlined" color="primary"
  //   //   onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
  //   // >
  //   //    Comparison guide
  //   // </Button>,
  //     '-',
  //     '-',
  //     'Indoor',
  //     'Horizontal',
  //     'Daikin VRV Integration, Electric heater',
  //   ],
  // };

  // const imageUrl = images[label as any] || '/assets/Images/default_image.png';
  // const labelValues = values[label as ImageLabels] || [];
  
  return (
    <Box textAlign="center">
    <BoxStyle
      id={id || ''}
      onClick={() => onSelectItem(id)}
      sx={{ display: prodTypeImage?.isLabel === true ? 'grid': 'grid',  borderColor: active ? 'primary.main' : '#a3a3a3', }}
    >
      {/* <img src={imageUrl} width="100%" height="100%" alt={label} /> */}
      <img src={prodTypeImage?.imageUrl} width="100%" height="100%" alt={label} />
    </BoxStyle>
    <Divider />
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
    <Stack textAlign={prodTypeDesc?.textAlign} spacing={2} mt={1}>
      {/* {labelValues.map((value, index) => (
        <Typography key={index}>{value}</Typography>
      ))} */}
      <Typography>{prodTypeDesc?.airflow}</Typography>
      <Typography>{prodTypeDesc?.typeOfRecovery}</Typography>
      <Typography>{prodTypeDesc?.coreType}</Typography>
      <Typography>{prodTypeDesc?.location}</Typography>
      <Typography>{prodTypeDesc?.orientation}</Typography>
      <Typography>{prodTypeDesc?.accessories}</Typography>
    </Stack>
  </Box>





    // <>
//     <Grid container spacing={1}>
//     <Grid item xs={12} md={12} display='inline-flex'>
//       <BoxStyle 
//               id={id || ''}
//               onClick={() => onSelectItem(id)}
//       sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(1, 1fr)' }, }}>
//               <Stack sx={{ display: prodTypeImage?.isLabel === true ? 'inline-block': 'grid'}}><img src={prodTypeDesc?.imageUrl} width="100%" height="100%" alt={label} /></Stack>

//       </BoxStyle>
//     </Grid>
//     <Grid item xs={12} md={12}>
//       {}
// </Grid>
// <Divider/>
//     <Grid item xs={12} md={12}>
//       <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(1, 1fr)' }, }}>

//         <Stack><Typography>{prodTypeDesc?.airflow}</Typography></Stack>
//         <Stack><Typography>{prodTypeDesc?.typeOfRecovery}</Typography></Stack>
//         <Stack><Typography>{prodTypeDesc?.coreType}</Typography></Stack>
//         <Stack><Typography>{prodTypeDesc?.location}</Typography></Stack>
//         <Stack><Typography>{prodTypeDesc?.orientation}</Typography></Stack>
//         <Stack><Typography>{prodTypeDesc?.accessories}</Typography></Stack>
//       </Box>
//     </Grid>
//   </Grid>


    // {/* </> */}
  );
}

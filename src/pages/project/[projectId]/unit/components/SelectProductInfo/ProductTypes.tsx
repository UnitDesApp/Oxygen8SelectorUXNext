// @mui
import { Container, Box, Typography as Text, Button, Grid, Stack, Divider, Typography, IconButton} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

import * as ghf from 'src/utils/globalHelperFunctions';
import * as Ids from 'src/utils/ids';
// components
import ProductTypeItem from './ProductTypeItem';

// ----------------------------------------------------------------------
type ProductTypeProps = {
  productTypes: any[];
  onSelectItem: Function;
};
const TextItem = styled(Text)(({ theme }) => ({
  fontSize: '0.9rem !important', 
  whiteSpace: 'nowrap',  
  color:'black',
  overflow: 'hidden',
  marginTop:'22px'
}));

const BoxStyle = styled(Button)(() => ({
  borderRadius: '50%',
  border: '1px solid #a3a3a3',
  // maxWidth: 300,
  // maxHeight: 300,
  margin: 'auto',
}));

export const getProdTypeImage = (prodType: string) => {
  const desc: { 
      isLabel: boolean; imageUrl:  string; } = { 
      isLabel: false,   imageUrl: '',};

  switch (prodType) {
    case 'LABEL':
      desc.isLabel = true;
      break;
    case 'NOVA':
      desc.imageUrl = "/assets/Images/new_unit_nova.png";
      break;
    case 'VENTUM':
      desc.imageUrl = "/assets/Images/new_unit_ventum_h.png";
      break;
    case 'VENTUML':
      desc.imageUrl = "/assets/Images/new_unit_ventum lite.png";
      break;
    case 'VENTUMP':
      desc.imageUrl = "/assets/Images/new_unit_ventum_plus.png";
      break;    
    case 'TERRA':
      desc.imageUrl = "/assets/Images/new_unit_terra.png";
      break;
    default:
      break;
  }

  return desc;
};

// export const getProdTypeDesc = (prodType: string, prodName: string) => {
//   const desc: { 
//       isLabel: boolean; prodName: string, textAlign: string; imageUrl:  string; airflow: string; typeOfRecovery: string; coreType: string; location: string; orientation: string; accessories: string;} = { 
//       isLabel: false,  prodName: '', textAlign: 'center', imageUrl: '', airflow: '', typeOfRecovery: '', coreType: '', location: '', orientation: '', accessories: '', };

//   switch (prodType) {
//     case 'LABEL':
//       desc.isLabel = true;
//       desc.prodName = '';
//       desc.textAlign = "left";
//       desc.imageUrl = "";
//       desc.airflow = "Airflow";
//       desc.typeOfRecovery = "Type of Recovery Options";
//       desc.coreType = "Core Type (Efficiency)";
//       desc.location = "Location Options";
//       desc.orientation = "Orientation Options";
//       desc.accessories = "Accessories Options";
//       break;
//     case 'NOVA':
//       desc.prodName = prodName;
//       desc.imageUrl = "/assets/Images/new_unit_nova.png";
//       desc.airflow = "325 - 8,100 cfm";
//       desc.typeOfRecovery = "ERV";
//       desc.coreType = "Crossflow Core (Standard Efficiency)";
//       desc.location = "Indoor / Outdoor";
//       desc.orientation = "Horizontal / Vertical";
//       desc.accessories = "Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)";
//       break;
//     case 'VENTUM':
//       desc.prodName = prodName;
//       desc.imageUrl = "/assets/Images/new_unit_ventum_h.png";
//       desc.airflow = "350 - 3,000 cfm";
//       desc.typeOfRecovery = "ERV / HRV";
//       desc.coreType = "Counterflow Core (High Efficiency)";
//       desc.location = "Indoor";
//       desc.orientation = "Horizontal";
//       desc.accessories = "Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)";
//       break;
//     case 'VENTUML':
//       desc.prodName = prodName;
//       desc.imageUrl = "/assets/Images/new_unit_ventum_lite.png";
//       desc.airflow = "200 - 450 cfm";
//       desc.typeOfRecovery = "ERV / HRV";
//       desc.coreType = "Counterflow Core (High Efficiency)";
//       desc.location = "Indoor";
//       desc.orientation = "Horizontal";
//       desc.accessories = "Electric pre-heater";
//       break;
//     case 'VENTUMP':
//       desc.prodName = prodName;
//       desc.imageUrl = "/assets/Images/new_unit_ventum_plus.png";
//       desc.airflow = "1,200 - 10,000 cfm";
//       desc.typeOfRecovery = "ERV / HRV";
//       desc.coreType = "Counterflow Core (High Efficiency)";
//       desc.location = "Indoor / Outdoor";
//       desc.orientation = "Vertical";
//       desc.accessories = "Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)";
//       break;    
//     case 'TERRA':
//       desc.prodName = prodName;
//       desc.imageUrl = "/assets/Images/new_unit_terra.png";
//       desc.airflow = "425 - 4,800 cfm";
//       desc.typeOfRecovery = "-";
//       desc.coreType = "-";
//       desc.location = "Indoor";
//       desc.orientation = "Horizontal";
//       desc.accessories = "Daikin VRV Integration, Electric heater";
//       break;
//     default:
//       break;
//   }

//   return desc;
// };

let productTypesNew : any = [];
// let prodTypeNovaValue = "";
// let prodTypeVentumValue = "";
// let prodTypeValue = "";
// let prodTypeNovaValue = "";
// let prodTypeNovaValue = "";

// useEffect(() => {
//   const info: { isVisible: boolean; isChecked: boolean; isEnabled: boolean; defaultId: number; bypassMsg: string } = {
//                 isVisible: false,   isChecked: false,   isEnabled: false,   defaultId: 0,      bypassMsg: '',};

//   let dtUnitModel = db?.dbtSelNovaUnitModel;


//       dtUnitModel = productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdNova))?.[0]?.value;
//   }
// }
// );

export default function ProductType(props: ProductTypeProps) {
  const { productTypes, onSelectItem } = props;
  productTypesNew = ghf.moveArrayItem(productTypes, 4, 2);
  if (productTypes?.length > 0) {
    while (Number(productTypesNew?.[0]?.id) === 0) {
      productTypesNew?.shift();
    }
    productTypesNew?.unshift({id: 0, code: "LABEL"});
  }
  return (
    // <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
               <Box display="flex" justifyContent="center" alignItems="center" width="100%" >

    {/* <Container sx={{display:'flex'}} maxWidth="xl"> */}
      {/* <Box sx={{marginTop:"21%",marginBottom:"50px"}}>
             <TextItem >Airflow</TextItem>
             <TextItem >Type of Recovery Options*</TextItem>
             <TextItem >Core Type(Efficiency)</TextItem>
             <TextItem sx={{marginTop:'32px'}} >Location Options</TextItem>
             <TextItem sx={{marginTop:'19px'}} >Orientation Options</TextItem>
             <TextItem sx={{marginTop:'18px'}}>Accessories Options</TextItem>
      </Box> */}
      {/* <Box
        sx={{
          display: 'grid',
          rowGap: 3,
          columnGap: 2,
          paddingTop: 5,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: `repeat(${productTypesNew?.length || 0}, 1fr)`,
          },
        }}
        >
        {productTypesNew?.map((ele: any) => (
          <ProductTypeItem
          key={ele.id}
          label={ele.items}
          onSelectItem={() => {onSelectItem(ele.items, ele.id);}}
          prodTypeDesc={getProdTypeDesc(ele.code, ele.items)}
          prodTypeImage={getProdTypeImage(ele.code)}
          />
        ))}
      </Box> */}
      
      <Grid container spacing={1}>
     {/* <Grid item xs={12} md={12} display='inline-flex'>
      <Box 
              id={id || ''}
              onClick={() => onSelectItem(id)}
      sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(1, 1fr)' }, }}>
              <Stack sx={{ display: prodTypeImage?.isLabel === true ? 'inline-block': 'grid'}}><img src={prodTypeDesc?.imageUrl} width="100%" height="100%" alt={label} /></Stack>

      </Box>
    </Grid> */}
    <Grid item xs={12} md={12}>
      {}
</Grid>
<Divider/>
<Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, fontSize:'small' }}>
      {/* <Stack><Typography>{}</Typography></Stack> */}
      <Stack>
        <BoxStyle
          onClick={() => onSelectItem(
          productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdNova))?.[0]?.items,
          Ids?.intProdTypeIdNova)}>
          <img src='/assets/Images/new_unit_nova.png' alt='Nova' width="fit-content" />
        </BoxStyle>
      </Stack>
      <Stack>
        <BoxStyle
          onClick={() => onSelectItem(
          productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdVentum))?.[0]?.items,
          Ids?.intProdTypeIdVentum)}>
          <img src='/assets/Images/new_unit_ventum_h.png' alt='Nova' width="fit-content" />
        </BoxStyle>
      </Stack>
      <Stack>
        <BoxStyle
          onClick={() => onSelectItem(
          productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdVentumPlus))?.[0]?.items,
          Ids?.intProdTypeIdVentumPlus)}>
          <img src='/assets/Images/new_unit_ventum_plus.png' alt='Nova' width="fit-content" />
        </BoxStyle>
      </Stack>
      <Stack>
        <BoxStyle
          onClick={() => onSelectItem(
          productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdVentumLite))?.[0]?.items,
          Ids?.intProdTypeIdVentumLite)}>
          <img src='/assets/Images/new_unit_ventum_lite.png' alt='Nova' width="fit-content" />
        </BoxStyle>
      </Stack>
      <Stack>
        <BoxStyle
          onClick={() => onSelectItem(
          productTypes?.filter((item: { id: number }) => item.id === Number(Ids?.intProdTypeIdTerra))?.[0]?.items,
          Ids?.intProdTypeIdTerra)}>
          <img src='/assets/Images/new_unit_terra.png' alt='Nova' width="fit-content" />
        </BoxStyle>
      </Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Unit</Typography></Stack> */}
      <Stack>
        <Typography textAlign='center' fontSize="15px" fontWeight={600}>Nova        
          <span>
          <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
            <Iconify icon="ant-design:exclamation-circle-outlined" />
          </IconButton>
        </span>
        </Typography>
        </Stack>
        <Stack><Typography textAlign='center' fontSize="15px" fontWeight={600}>Ventum
        <span>
          <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
            <Iconify icon="ant-design:exclamation-circle-outlined" />
          </IconButton>
        </span>
        </Typography>
        </Stack>
        <Stack><Typography textAlign='center' fontSize="15px" fontWeight={600}>Ventum+
        <span>
          <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
            <Iconify icon="ant-design:exclamation-circle-outlined" />
          </IconButton>
        </span>
        </Typography>
        </Stack>
        <Stack><Typography textAlign='center' fontSize="15px" fontWeight={600}>Ventum Lite
        <span>
          <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
            <Iconify icon="ant-design:exclamation-circle-outlined" />
          </IconButton>
        </span>
        </Typography>
        </Stack>
        <Stack><Typography textAlign='center' fontSize="15px" fontWeight={600}>Terra
        <span>
          <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }}>
            <Iconify icon="ant-design:exclamation-circle-outlined" />
          </IconButton>
        </span>
        </Typography>
        </Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Airflow</Typography></Stack> */}
        <Stack><Typography textAlign='center' fontSize="13px">325 - 8,100 cfm</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">350 - 3,000 cfm</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">1,200 - 10,000 cfm</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">200 - 450 cfm</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">425 - 4,800 cfm</Typography></Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
        {/* <Stack><Typography fontSize="13px">Type of Recovery Options</Typography></Stack> */}
        <Stack><Typography textAlign='center' fontSize="13px">ERV</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">ERV / HRV</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">ERV / HRV</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">ERV / HRV</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">-</Typography></Stack>
        </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Core Type (Efficiency)</Typography></Stack> */}
        <Stack><Typography textAlign='center' fontSize="13px">Crossflow Core (Standard Efficiency)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Counterflow Core (High Efficiency)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Counterflow Core (High Efficiency)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Counterflow Core (High Efficiency)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">-</Typography></Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Location Options</Typography></Stack> */}
      <Stack><Typography textAlign='center' fontSize="13px">Indoor / Outdoor</Typography></Stack>
      <Stack><Typography textAlign='center' fontSize="13px">Indoor</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Indoor / Outdoor</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Indoor</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Indoor</Typography></Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Orientation Options</Typography></Stack> */}
      <Stack><Typography textAlign='center' fontSize="13px">Horizontal / Vertical</Typography></Stack>
      <Stack><Typography textAlign='center' fontSize="13px">Horizontal</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Vertical</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Horizontal</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Horizontal</Typography></Stack>
      </Box>
    </Grid>
    <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(5, 1fr)' }, }}>
      {/* <Stack><Typography fontSize="13px">Accessories Options</Typography></Stack> */}
      <Stack><Typography textAlign='center' fontSize="13px">Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Daikin VRV Integration, Electric heater, Hydronic Coil (HW & CW)</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Electric pre-heater</Typography></Stack>
        <Stack><Typography textAlign='center' fontSize="13px">Daikin VRV Integration, Electric heater</Typography></Stack>
      </Box>
    </Grid>
        {/* </Container> */}
        <Grid item xs={12} md={12}>
      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(1, 1fr)' }, alignContent:'center' }}>
      <Stack direction="row" justifyContent="center" textAlign="center">

         <Button sx={{width:'fit-content',mt:'35px'}} variant="outlined" color="primary"
      onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
      >
       Comparison guide
    </Button>
    </Stack>
    </Box>
    </Grid>
  </Grid>




      </Box>
  );
}

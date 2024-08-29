// @mui
import { Container, Box, Typography as Text, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export default function ProductType(props: ProductTypeProps) {
  const { productTypes, onSelectItem } = props;

  return (
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    <Container sx={{display:'flex'}} maxWidth="xl">
      <Box sx={{marginTop:"21%",marginBottom:"50px"}}>
             <TextItem >Airflow</TextItem>
             <TextItem >Type of Recovery Options*</TextItem>
             <TextItem >Core Type(Efficiency)</TextItem>
             <TextItem sx={{marginTop:'32px'}} >Location Options</TextItem>
             <TextItem sx={{marginTop:'19px'}} >Orientation Options</TextItem>
             <TextItem sx={{marginTop:'18px'}}>Accessories Options</TextItem>
      </Box>
      <Box
        sx={{
          display: 'grid',
          rowGap: 3,
          columnGap: 2,
          paddingTop: 5,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: `repeat(${productTypes?.length || 0}, 1fr)`,
          },
        }}
        >
        {productTypes?.map((ele: any) => (
          <ProductTypeItem
          key={ele.id}
          label={ele.items}
          onSelectItem={() => {
            onSelectItem(ele.items, ele.id);
          }}
          />
        ))}
      </Box>
    </Container>
         <Button sx={{width:'fit-content',mt:'35px'}} variant="outlined" color="primary"
      onClick={() => window.open('/CommercialProductLineComparison.pdf', '_blank')}
      >
       Comparison guide
    </Button>
      </Box>
  );
}

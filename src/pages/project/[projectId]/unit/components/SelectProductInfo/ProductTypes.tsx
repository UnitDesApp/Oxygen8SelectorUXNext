import PropTypes from 'prop-types';
// @mui
import { Container, CardContent, Card, Box } from '@mui/material';

// components
import ProductTypeItem from './ProductTypeItem';

// ----------------------------------------------------------------------
type ProductTypeProps = {
  productTypes: any[];
  onSelectItem: Function;
};

export default function ProductType(props: ProductTypeProps) {
  const { productTypes, onSelectItem } = props;

  return (
    <Container>
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
  );
}

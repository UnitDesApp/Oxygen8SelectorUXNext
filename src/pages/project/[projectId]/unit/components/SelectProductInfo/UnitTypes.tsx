// @mui
import { Container, CardContent, Card, Box } from '@mui/material';
// components
import UnitTypeItem from './UnitTypeItem';
// ----------------------------------------------------------------------
type UnitTypesProps = {
  productTypeID: number;
  productTypeUnitTypeLinkDataTbl: any[];
  onSelectItem: Function;
  productTypeValue?: string;
  SetIsOpenSideDescriptionOfProductType: (value: boolean) => void;
};

export const getUnitTypeDesc = (unitType: string) => {
  let unitTypeDesc = "";

  switch (unitType) {
    case 'ERV':
      unitTypeDesc = "Energy Recovery Ventilator";
      break;
    case 'HRV':
      unitTypeDesc = "Heat Recovery Ventilator";
      break;
      case 'AHU':
        unitTypeDesc = "Air Handling Unit";
      break;
      default:
        break;
  }

  return unitTypeDesc;
};

export default function UnitTypes(props: UnitTypesProps) {
  const { productTypeID, productTypeUnitTypeLinkDataTbl,SetIsOpenSideDescriptionOfProductType,productTypeValue, onSelectItem } = props;

  const units =
    productTypeUnitTypeLinkDataTbl?.filter(
      (element) => element.prod_type_id === productTypeID
    ) || [];

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'grid',
          rowGap: 3,
          columnGap: 2,
          paddingTop: 5,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: `repeat(${units.length}, 1fr)`,
          },
        }}
      >
        {units.map((ele) => (
          <UnitTypeItem
          productTypeValue={productTypeValue}
          SetIsOpenSideDescriptionOfProductType = {SetIsOpenSideDescriptionOfProductType}
            key={ele.unit_type_id}
            label={ele.unit_type}
            unitTypeDesc={getUnitTypeDesc(ele.unit_type)}
            onSelectItem={() => {
              onSelectItem(ele.unit_type, ele.unit_type_id);
            }}
          />
        ))}
      </Box>
    </Container>
  );
}

// react
import { useState, useCallback, useEffect } from 'react';
// prop-types
// @mui
import { Container, CardContent, Card, Box, Tabs, Tab } from '@mui/material';

// components
import { useGetUnitSelTables } from 'src/hooks/useApi';
import { ProductTypes, Applications, SideDescription, UnitTypes } from './index';

const productInfomation = {
  image: '/assets/Images/img_nova_1.png',
  description:
    'Lorem ipsum dolor sit amet, consecteture adipiscing elit. Duis fringilla porta diam, eu egestas nibh pellentesque vel. Fusce ultrices tortor pretium vulputate viverra. Vestibulum purus sem, mattis in dolor vel, egestas tincidunt libero. Aliquam suscipit purus accumsan lectus ultrices, id bibendum diam malesuada. Nulla facilisi.',
};

// ----------------------------------------------------------------------
type SelectProductInfoProps = {
  onSelectAppliaionItem: Function;
  onSelectProductTypeItem: Function;
  onSelectUnitTypeItem: Function;
};

export default function SelectProductInfo(props: SelectProductInfoProps) {
  const { data, isLoading } = useGetUnitSelTables();
  const { onSelectAppliaionItem, onSelectProductTypeItem, onSelectUnitTypeItem } = props;
  const [applicationValue, setApplicationValue] = useState('Application');
  const [productTypeValue, setProductTypeValue] = useState('Product type');
  const [productTypeID, setProductTypeID] = useState(-1);
  const [unitTypeValue, setUnitTypeValue] = useState('Unit type');

  const [isOpenSideDescriptionOfProductType, SetIsOpenSideDescriptionOfProductType] =
    useState(false);

  const [value, setValue] = useState(0);

  const handleChange = useCallback((event: any, newValue: any) => {
    setValue(newValue);
  }, []);

  // const onSelectApplicationValue = useCallback(
  //   (label: string, id: number) => {
  //     onSelectAppliaionItem(id, label);
  //     setApplicationValue(label);
  //     setValue(1);
  //   },
  //   [onSelectAppliaionItem]
  // );

    useEffect(()=>{
      onSelectAppliaionItem(1, 'Comercial');
      // setApplicationValue('Comercial');
      setValue(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


  const onSelectProductTypeValue = useCallback(
    (label: string, id: number) => {
      onSelectProductTypeItem(id, label);
      setProductTypeValue(label);
      setProductTypeID(id);
      if (label !== 'Terra'){
        setValue(1);
      }
      else{
         onSelectUnitTypeValue('AHU',3)
      }
      // setValue(1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSelectProductTypeItem]
  );
  const onSelectUnitTypeValue = useCallback(
    (label: string, id: number) => {
      onSelectUnitTypeItem(id, label);
      setUnitTypeValue(label);
    },
    [onSelectUnitTypeItem]
  );

  return (
    <Container maxWidth="xl">
      <Card sx={{ minWidth: 500, mb: '100px' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          variant="fullWidth"
        >
          {/* <Tab label={applicationValue} /> */}
          <Tab label={productTypeValue} disabled={applicationValue === 'Application'} />
          <Tab label={unitTypeValue} disabled={productTypeValue === 'Product type'} />
        </Tabs>
        <CardContent>
          {/* <TabPanel value={value} index={0}>
            <Applications
              // productTypes={productTypeDataTbl}
              onSelectItem={onSelectApplicationValue}
            />
          </TabPanel> */}
          <TabPanel value={value} index={0}>
            {/* <ProductTypes productTypes={data?.prodType} onSelectItem={onSelectProductTypeValue} /> */}
            <ProductTypes
              productTypes={data?.dbtSelProdType}
              onSelectItem={onSelectProductTypeValue}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UnitTypes
            productTypeValue = {productTypeValue}
              productTypeID={productTypeID}
              SetIsOpenSideDescriptionOfProductType={SetIsOpenSideDescriptionOfProductType}
              // productTypeUnitTypeLinkDataTbl={data?.prodTypeUnitTypeLink}
              productTypeUnitTypeLinkDataTbl={data?.dbtSelProdTypeUnitTypeLink}
              onSelectItem={onSelectUnitTypeValue}
            />
          </TabPanel>
        </CardContent>
      </Card>
      <Box sx={{ width: '300px' }}>
        <SideDescription
          open={isOpenSideDescriptionOfProductType}
          handleDrawerClose={() => SetIsOpenSideDescriptionOfProductType(false)}
          productInfomation={productInfomation}
          sx={{ width: '300px' }}
        />
      </Box>
    </Container>
  );
}

type TabPanleProps = {
  children?: any;
  index: number;
  value: number;
};

function TabPanel(props: TabPanleProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

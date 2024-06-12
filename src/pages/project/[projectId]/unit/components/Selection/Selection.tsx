import React, { useEffect, useState, useMemo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Grid,
  Typography,
  LinearProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
// lodash
import { isEmpty } from 'lodash';
import { useGetUnitSelection } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';

//------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  marginBottom: '200px!important',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
  },
}));

const CustomGroupBoxBorder = styled(Box)(() => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '0',
  padding: '10px',
  margin: '0',
  verticalAlign: 'top',
  width: '100%',
  border: '1px solid black',
  borderRadius: '8px',
}));

const CustomGroupBoxTitle = styled(Typography)(() => ({
  lineHeight: '1.4375em',
  fontSize: '20px',
  fontFamily: '"Public Sans", sans-serif',
  fontWeight: 400,
  display: 'block',
  transformOrigin: 'left top',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(133% - 24px)',
  position: 'absolute',
  left: '0px',
  top: '0px',
  transform: 'translate(40px, -12px) scale(0.75)',
  transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms',
  zIndex: 100,
  background: 'white',
  paddingLeft: '10px',
  paddingRight: '10px',
}));

// ----------------------------------------------------------------------
// interface CustomGroupBoxProps {
//   title: string;
//   children: any;
//   bordersx: any;
//   titlesx: any;
// }

// function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
//   return (
//     <CustomGroupBoxBorder sx={{ ...bordersx }}>
//       <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
//       {children}
//     </CustomGroupBoxBorder>
//   );
// }


type CustomGroupBoxProps = {
  title?: string;
  children?: any;
  bordersx?: object;
  titlesx?: object;
};

function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
      <Box sx={{ padding: '20px' }}>{children}</Box>
    </CustomGroupBoxBorder>
  );
}

//------------------------------------------------
interface SelectionProps {
  intJobId: any;
  intUnitNo: number;
  intProdTypeId: number;
}

// export default function Selection({ unitTypeData, intUnitNo }: SelectionProps) {
export default function Selection({ intJobId, intUnitNo, intProdTypeId }: SelectionProps) {
  const { projectId } = useRouter().query;
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({
    panel1: true,
    panel2: true,
    panel3: true,
    panel4: true,
    panel5: true,
    panel6: true,
    panel7: true,
    panel8: true,
    panel9: true,
    panel10: true,
    panel11: true,
    panel12: true,
    panel13: true,
    panel14: true,
    panel15: true,
    panel16: true,
    panel17: true,
    panel18: true,
    panel19: true,
    panel20: true,
  });

  const { data: selectionData, isLoading: isLoadingSelectionInfo } = useGetUnitSelection({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: projectId,
    intUnitNo,
    intProdTypeId,
    // intUnitTypeId: unitTypeData?.intUnitTypeID,
  });

  // const viewSelectionInfo = useMemo(
  //   () => ({
  //     pricingDetail: selectionData?.pricingOutput?.pricingDataTbl,
  //     pricingVisible: selectionData?.pricingOutput?.visible,
  //     unitDetails: selectionData?.unitDetailsOutput?.unitDetails_1DataTbl.concat(
  //       selectionData?.unitDetailsOutput?.unitDetails_2DataTbl
  //     ),
  //     unitDetailsVisible: selectionData?.unitDetailsOutput?.visible,
  //     electricalRequirements: {
  //       unitData: selectionData?.elecReqOutput?.unitDataTbl,
  //       unitDataVisible: selectionData?.elecReqOutput?.unitVisible,
  //       unitOnlyData: selectionData?.elecReqOutput?.unitOnlyDataTbl,
  //       unitOnlyDataVisible: selectionData?.elecReqOutput?.unitOnlyVisible,
  //       coolingDXCData: selectionData?.elecReqOutput?.coolingDXCDataTbl,
  //       coolingDXCVisible: selectionData?.elecReqOutput?.coolingDXCVisible,
  //       preheatElecHeaterData: selectionData?.elecReqOutput?.preheatElecHeaterDataTbl,
  //       preheatElecHeaterVisible: selectionData?.elecReqOutput?.preheatElecHeaterVisible,
  //       heatingElecHeaterData: selectionData?.elecReqOutput?.heatingElecHeaterDataTbl,
  //       heatingElecHeaterVisible: selectionData?.elecReqOutput?.heatingElecHeaterVisible,
  //     },
  //     preheatElecHeater: {
  //       Visible: selectionData?.preheatElecHeaterOutput?.visible,
  //       Data: selectionData?.preheatElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     preheatHWC: {
  //       Visible: selectionData?.preheatHWC_Output?.visible,
  //       Data: selectionData?.preheatHWC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.preheatHWC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.preheatHWC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       ValveActuatorVisible: selectionData?.preheatHWC_Output?.valveActuatorVisible,
  //       ValveActuator: selectionData?.preheatHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     heatExchCORE: {
  //       performanceVisible: selectionData?.fixedPlateCORE_Output?.visible,
  //       performance: selectionData?.fixedPlateCORE_Output?.performanceDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue_1,
  //         item.cValue_2,
  //       ]),
  //       designConditions: selectionData?.fixedPlateCORE_Output?.enteringDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       performanceLeavingAir: selectionData?.fixedPlateCORE_Output?.leavingDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       // performanceLeavingAirVisible: selectionData?.fixedPlateCORE_Output?.gvOutHX_FP_LvgAirVisible,
  //     },
  //     heatExchRECUTECH: {
  //       performanceVisible: selectionData?.fixedPlateRECUTECH_Output?.visible,
  //       performance: selectionData?.fixedPlateRECUTECH_Output?.performanceDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       designConditions: selectionData?.fixedPlateRECUTECH_Output?.enteringDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       // designConditionsVisible: selectionData?.fixedPlateRECUTECH_Output?.gvOutHX_FP_EntAirVisible,
  //       performanceLeavingAir: selectionData?.fixedPlateRECUTECH_Output?.leavingDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       // performanceLeavingAirVisible: selectionData?.fixedPlateRECUTECH_Output?.gvOutHX_FP_LvgAirVisible,
  //     },
  //     heatExchPOLYBLOC: {
  //       performanceVisible: selectionData?.fixedPlatePOLYBLOC_Output?.visible,
  //       performance: selectionData?.fixedPlatePOLYBLOC_Output?.performanceDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       designConditions: selectionData?.fixedPlatePOLYBLOC_Output?.enteringDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       // designConditionsVisible: selectionData?.fixedPlatePOLYBLOC_Output?.gvOutHX_FP_EntAirVisible,
  //       performanceLeavingAir: selectionData?.fixedPlatePOLYBLOC_Output?.leavingDataTbl?.map(
  //         (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
  //       ),
  //       // performanceLeavingAirVisible: selectionData?.fixedPlatePOLYBLOC_Output?.gvOutHX_FP_LvgAirVisible,
  //     },
  //     coolingCWC: {
  //       Visible: selectionData?.coolingCWC_Output?.visible,
  //       Data: selectionData?.coolingCWC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.coolingCWC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.coolingCWC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       ValveActuatorVisible: selectionData?.coolingCWC_Output?.valveActuatorVisible,
  //       ValveActuator: selectionData?.coolingCWC_Output?.valveActuatorDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     coolingDXC: {
  //       Visible: selectionData?.coolingDXC_Output?.visible,
  //       Data: selectionData?.coolingDXC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.coolingDXC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.coolingDXC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       PerfOutputs: selectionData?.coolingDXC_Output?.perfOutputsDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       EKEXV_Kit: selectionData?.coolingDXC_Output?.ekexvKitDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     heatingCondCoil: {
  //       Visible: selectionData?.heatingCondCoilOutput?.visible,
  //       Data: selectionData?.heatingCondCoilOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.heatingCondCoilOutput?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.heatingCondCoilOutput?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     heatingElecHeater: {
  //       Visible: selectionData?.heatingElecHeaterOutput?.visible,
  //       Data: selectionData?.heatingElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     heatingHWC: {
  //       Visible: selectionData?.heatingHWC_Output?.visible,
  //       Data: selectionData?.heatingHWC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.heatingHWC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.heatingHWC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       ValveActuatorVisible: selectionData?.heatingHWC_Output?.valveActuatorVisible,
  //       ValveActuator: selectionData?.heatingHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     reheatElecHeater: {
  //       Visible: selectionData?.reheatElecHeaterOutput?.visible,
  //       Data: selectionData?.reheatElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     reheatHWC: {
  //       Visible: selectionData?.reheatHWC_Output?.visible,
  //       Data: selectionData?.reheatHWC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.reheatHWC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.reheatHWC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       ValveActuatorVisible: selectionData?.reheatHWC_Output?.valveActuatorVisible,
  //       ValveActuator:
  //         selectionData?.reheatHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
  //           item.cLabel,
  //           item.cValue,
  //         ]) || [],
  //     },
  //     reheatHGRC: {
  //       Visible: selectionData?.reheatHGRC_Output?.visible,
  //       Data: selectionData?.reheatHGRC_Output?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Entering: selectionData?.reheatHGRC_Output?.enteringDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       Leaving: selectionData?.reheatHGRC_Output?.leavingDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       PerfOutputs: selectionData?.reheatHGRC_Output?.performanceDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       EKEXV_Kit: selectionData?.reheatHGRC_Output?.ekexvKitDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //     },
  //     supplyFan: {
  //       Visible: selectionData?.supplyFanOutput?.visible,
  //       Data: selectionData?.supplyFanOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       GraphImageUrl: selectionData?.supplyFanOutput?.graphImageUrl,
  //       soundDataVisible: selectionData?.supplyFanOutput?.soundDataVisible,
  //       soundData: selectionData?.supplyFanOutput?.soundDataDataTbl,
  //     },
  //     exhaustFan: {
  //       Visible: selectionData?.exhaustFanOutput?.visible,
  //       Data: selectionData?.exhaustFanOutput?.featuresDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue,
  //       ]),
  //       GraphImageUrl: selectionData?.exhaustFanOutput?.graphImageUrl,
  //       soundDataVisible: selectionData?.exhaustFanOutput?.soundDataVisible,
  //       soundData: selectionData?.exhaustFanOutput?.soundDataDataTbl,
  //     },
  //     soundData: {
  //       Visible: selectionData?.soundDataOutput?.visible,
  //       Data: selectionData?.soundDataOutput?.soundDataDataTbl?.map((item: any) => [
  //         item.cLabel,
  //         item.cValue_1,
  //         item.cValue_2,
  //         item.cValue_3,
  //         item.cValue_4,
  //         item.cValue_5,
  //         item.cValue_6,
  //         item.cValue_7,
  //         item.cValue_8,
  //         item.cValue_9,
  //         item.cValue_10,
  //       ]),
  //     },
  //   }),
  //   [selectionData]
  // );

  // const {
  //   pricingDetail,
  //   pricingVisible,
  //   unitDetails,
  //   unitDetailsVisible,
  //   electricalRequirements,
  //   preheatElecHeater,
  //   preheatHWC,
  //   heatExchCORE,
  //   heatExchRECUTECH,
  //   heatExchPOLYBLOC,
  //   coolingCWC,
  //   coolingDXC,
  //   heatingCondCoil,
  //   heatingElecHeater,
  //   heatingHWC,
  //   reheatElecHeater,
  //   reheatHWC,
  //   reheatHGRC,
  //   supplyFan,
  //   exhaustFan,
  //   soundData,
  // } = viewSelectionInfo;

  // const SelectionInfo: any = useMemo(() => {
  //   const data = [];

  //   if (pricingDetail) {
  //     data?.push({
  //       groupName: 'Pricing',
  //       direction: 'column',
  //       style: {},
  //       visible: pricingVisible,
  //       subGroups: [
  //         {
  //           title: 'Pricing Detail',
  //           data: pricingDetail?.map((item: any) => [item.cLabel, item.cValue, item.cNotes]),
  //           visible: pricingVisible,
  //         },
  //       ],
  //     });
  //   }

  //   if (unitDetails) {
  //     data?.push({
  //       groupName: 'Unit Details',
  //       direction: 'column',
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(2, 2fr)',
  //       },
  //       visible: unitDetailsVisible,
  //       subGroups: [
  //         {
  //           title: 'Unit Details 1',
  //           data: unitDetails?.slice(0, 6).map((item: any) => [item.cLabel, item.cValue]),
  //           visible: unitDetailsVisible,
  //         },
  //         {
  //           title: 'Unit Details 2',
  //           data: unitDetails?.slice(6).map((item: any) => [item.cLabel, item.cValue]),
  //           visible: unitDetailsVisible,
  //         },
  //       ],
  //     });
  //   }

  //   if (electricalRequirements) {
  //     data.push({
  //       groupName: 'Electrical Requirements',
  //       direction: 'row',
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       visible:
  //         electricalRequirements?.coolingDXCVisible ||
  //         electricalRequirements?.unitDataVisible ||
  //         electricalRequirements?.preheatElecHeaterVisible ||
  //         electricalRequirements?.heatingElecHeaterVisible,
  //       subGroups: [
  //         {
  //           title: 'Unit',
  //           data: electricalRequirements?.unitData?.map((item: any) => [item.cLabel, item.cValue]),
  //           visible: electricalRequirements?.unitDataVisible,
  //         },
  //         {
  //           title: 'W-controller',
  //           data:
  //             electricalRequirements?.coolingDXCData !== undefined &&
  //             electricalRequirements?.coolingDXCData?.map((item: any) => [
  //               item.cLabel,
  //               item.cValue,
  //             ]),
  //           visible:
  //             electricalRequirements?.coolingDXCVisible !== undefined &&
  //             electricalRequirements?.coolingDXCVisible,
  //         },
  //         {
  //           title: 'Preheat Electric Heater',
  //           data:
  //             electricalRequirements?.preheatElecHeaterData !== undefined &&
  //             electricalRequirements?.preheatElecHeaterData?.map((item: any) => [
  //               item.cLabel,
  //               item.cValue,
  //             ]),
  //           visible:
  //             electricalRequirements?.preheatElecHeaterVisible !== undefined &&
  //             electricalRequirements?.preheatElecHeaterVisible,
  //         },
  //         {
  //           title: 'Heating Electric Heater',
  //           data:
  //             electricalRequirements?.heatingElecHeaterData !== undefined &&
  //             electricalRequirements?.heatingElecHeaterData?.map((item: any) => [
  //               item.cLabel,
  //               item.cValue,
  //             ]),
  //           visible:
  //             electricalRequirements?.heatingElecHeaterVisible !== undefined &&
  //             electricalRequirements?.heatingElecHeaterVisible,
  //         },
  //       ],
  //     });
  //   }

  //   if (preheatElecHeater) {
  //     data.push({
  //       groupName: 'Preheat Electric Heater',
  //       direction: 'column',
  //       visible: preheatElecHeater?.Visible,
  //       style: {},
  //       subGroups: [
  //         {
  //           title: 'Actual',
  //           data: preheatElecHeater?.Data,
  //           visible: preheatElecHeater?.Visible,
  //         },
  //       ],
  //     });
  //   }

  //   if (preheatHWC) {
  //     data.push({
  //       groupName: 'Preheat HWC',
  //       direction: 'row',
  //       visible: preheatHWC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: preheatHWC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: preheatHWC?.Entering,
  //         },
  //         {
  //           title: 'Leaving',
  //           data: preheatHWC?.Leaving,
  //         },
  //         {
  //           title: 'Valve & Actuator',
  //           data: preheatHWC?.ValveActuator,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatExchCORE) {
  //     data.push({
  //       groupName: 'Heat Exchanger',
  //       direction: 'row',
  //       visible: heatExchCORE?.performanceVisible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(1, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Design Conditions',
  //           data: heatExchCORE?.designConditions,
  //         },
  //         {
  //           title: 'Performance Leaving Air',
  //           data: heatExchCORE?.performanceLeavingAir,
  //         },
  //         {
  //           title: 'Performance',
  //           data: heatExchCORE?.performance,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatExchRECUTECH) {
  //     data.push({
  //       groupName: 'Heat Exchanger',
  //       direction: 'row',
  //       visible: heatExchRECUTECH?.performanceVisible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(1, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Design Conditions',
  //           data: heatExchRECUTECH?.designConditions,
  //         },
  //         {
  //           title: 'Performance Leaving Air',
  //           data: heatExchRECUTECH?.performanceLeavingAir,
  //         },
  //         {
  //           title: 'Performance',
  //           data: heatExchRECUTECH?.performance,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatExchPOLYBLOC) {
  //     data.push({
  //       groupName: 'Heat Exchanger',
  //       direction: 'row',
  //       visible: heatExchPOLYBLOC?.performanceVisible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(1, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Design Conditions',
  //           data: heatExchPOLYBLOC?.designConditions,
  //         },
  //         {
  //           title: 'Performance Leaving Air',
  //           data: heatExchPOLYBLOC?.performanceLeavingAir,
  //         },
  //         {
  //           title: 'Performance',
  //           data: heatExchPOLYBLOC?.performance,
  //         },
  //       ],
  //     });
  //   }

  //   if (coolingCWC) {
  //     data.push({
  //       groupName: 'Cooling CWC',
  //       direction: 'row',
  //       visible: coolingCWC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: coolingCWC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: coolingCWC?.Entering,
  //         },
  //         {
  //           title: 'Leaving',
  //           data: coolingCWC?.Leaving,
  //         },
  //         {
  //           title: 'Valve & Actuator',
  //           data: coolingCWC?.ValveActuator,
  //         },
  //       ],
  //     });
  //   }

  //   if (coolingDXC) {
  //     data.push({
  //       groupName: 'Cooling DXC',
  //       direction: 'row',
  //       visible: coolingDXC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: coolingDXC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: coolingDXC?.Entering,
  //         },
  //         [
  //           {
  //             title: 'Setpoint',
  //             data: coolingDXC?.Leaving,
  //           },
  //           {
  //             title: 'Coil Performance',
  //             data: coolingDXC?.PerfOutputs,
  //           },
  //         ],
  //         {
  //           title: 'VRV Integration Kit',
  //           data: coolingDXC?.EKEXV_Kit,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatingCondCoil) {
  //     data.push({
  //       groupName: 'Heating Mode DX Coil',
  //       direction: 'row',
  //       visible: heatingCondCoil?.Visible,
  //       style: {},
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: heatingCondCoil?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: heatingCondCoil?.Entering,
  //         },
  //         {
  //           title: 'Setpoint',
  //           data: heatingCondCoil?.Leaving,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatingElecHeater) {
  //     data.push({
  //       groupName: 'Heating Electric Heater',
  //       direction: 'column',
  //       visible: heatingElecHeater?.Visible,
  //       style: {},
  //       subGroups: [
  //         {
  //           title: 'Actual',
  //           data: heatingElecHeater?.Data,
  //         },
  //       ],
  //     });
  //   }

  //   if (heatingHWC) {
  //     data.push({
  //       groupName: 'Heating HWC',
  //       direction: 'row',
  //       visible: heatingHWC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: heatingHWC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: heatingHWC?.Entering,
  //         },
  //         {
  //           title: 'Leaving',
  //           data: heatingHWC?.Leaving,
  //         },
  //         {
  //           title: 'Valve & Actuator',
  //           data: heatingHWC?.ValveActuator,
  //         },
  //       ],
  //     });
  //   }

  //   if (reheatElecHeater) {
  //     data.push({
  //       groupName: 'Reheat Electric Heater',
  //       direction: 'column',
  //       visible: reheatElecHeater?.Visible,
  //       style: {},
  //       subGroups: [
  //         {
  //           title: 'Actual',
  //           data: reheatElecHeater?.Data,
  //         },
  //       ],
  //     });
  //   }

  //   if (reheatHWC) {
  //     data.push({
  //       groupName: 'Reheat HWC',
  //       direction: 'row',
  //       visible: reheatHWC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: reheatHWC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: reheatHWC?.Entering,
  //         },
  //         {
  //           title: 'Leaving',
  //           data: reheatHWC?.Leaving,
  //         },
  //         {
  //           title: 'Valve & Actuator',
  //           data: reheatHWC?.ValveActuator,
  //         },
  //       ],
  //     });
  //   }

  //   if (reheatHGRC) {
  //     data.push({
  //       groupName: 'Reheat HGRC',
  //       direction: 'row',
  //       visible: reheatHGRC?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(3, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Coil',
  //           data: reheatHGRC?.Data,
  //         },
  //         {
  //           title: 'Entering',
  //           data: reheatHGRC?.Entering,
  //         },
  //         [
  //           {
  //             title: 'Setpoint',
  //             data: reheatHGRC?.Leaving,
  //           },
  //           {
  //             title: 'Coil Performance',
  //             data: reheatHGRC?.PerfOutputs,
  //           },
  //         ],
  //         {
  //           title: 'VRV Integration Kit',
  //           data: reheatHGRC?.EKEXV_Kit,
  //         },
  //       ],
  //     });
  //   }

  //   if (supplyFan) {
  //     data.push({
  //       groupName: 'Supply Fan',
  //       direction: 'row',
  //       visible: supplyFan?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(2, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Fan Data',
  //           data: supplyFan?.Data,
  //         },
  //         {
  //           title: 'Graph',
  //           data: supplyFan?.GraphImageUrl,
  //         },
  //         {
  //           title: 'Sound Data',
  //           data: supplyFan?.soundData,
  //         },
  //       ],
  //     });
  //   }

  //   if (exhaustFan) {
  //     data.push({
  //       groupName: 'Exhaust Fan',
  //       direction: 'row',
  //       visible: exhaustFan?.Visible,
  //       style: {
  //         display: 'grid',
  //         gridTemplateColumns:
  //           exhaustFan?.GraphImageUrl !== null ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
  //       },
  //       subGroups: [
  //         {
  //           title: 'Fan Data',
  //           data: exhaustFan?.Data,
  //         },
  //         {
  //           title: 'Graph',
  //           data: exhaustFan?.GraphImageUrl,
  //         },
  //         {
  //           title: 'Sound Data',
  //           data: exhaustFan?.soundData,
  //         },
  //       ],
  //     });
  //   }

  //   if (soundData) {
  //     data.push({
  //       groupName: 'Unit Sound Data (Hz)',
  //       direction: 'row',
  //       style: {},
  //       visible: soundData?.Visible,
  //       subGroups: [
  //         {
  //           data: soundData?.Data,
  //         },
  //       ],
  //     });
  //   }

  //   return data;
  // }, [
  //   coolingCWC,
  //   coolingDXC,
  //   electricalRequirements,
  //   exhaustFan,
  //   heatExchCORE,
  //   heatExchPOLYBLOC,
  //   heatExchRECUTECH,
  //   heatingCondCoil,
  //   heatingElecHeater,
  //   heatingHWC,
  //   preheatElecHeater,
  //   preheatHWC,
  //   pricingDetail,
  //   pricingVisible,
  //   reheatElecHeater,
  //   reheatHGRC,
  //   reheatHWC,
  //   soundData,
  //   supplyFan,
  //   unitDetails,
  //   unitDetailsVisible,
  // ]);

  return (
    <RootStyle>
      <Container maxWidth="xl">
        {error && (
          <Box sx={{ maringLeft: 'auto', marginRight: 'auto', marginTop: '50px' }}>
            Server Error!
          </Box>
        )}
        {isLoadingSelectionInfo ? (
          <LinearProgress color="info" />
        ) : (
          <Stack spacing={5} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <AccordionSummary
                  // expandIcon={<Iconify icon="il:arrow-down" />}
                  // aria-controls="panel1a-content"
                  // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                Pricing Details
              </Typography>
            </AccordionSummary>
            <Grid item xs={12} sx={{margin:'10px 0px !important'}}>

              <CustomGroupBox title="">

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                  <TableBody>
                    {selectionData?.dtPricingDetail?.map((item: any, i: number) => (
                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                        <TableCell component="th" scope="row" align="left" sx={{ width: '25%', fontWeight: 300}}>
                          {item.cLabel}
                        </TableCell>
                        <TableCell component="th" scope="row" align="left" sx={{ width: '10%', fontWeight: 300}}>
                          {item.cValue}
                        </TableCell>
                        <TableCell component="th" scope="row" align="left" sx={{ width: '65%', fontWeight: 300}}>
                          {item.cNotes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </TableContainer>
              </Grid>         
            </Grid>
            </CustomGroupBox>
            </Grid>
            </Grid> 


            <Grid item xs={12}>
            <AccordionSummary
                  // expandIcon={<Iconify icon="il:arrow-down" />}
                  // aria-controls="panel1a-content"
                  // id="panel1a-header"
            >
              <Typography color="primary.main" variant="h6">
                Unit Details
              </Typography>
            </AccordionSummary>
            <Grid item xs={12} sx={{margin:'10px 0px !important'}}>
              <CustomGroupBox title="">
                <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                          {selectionData?.dtUnitDetails_1?.map((item: any, i: number) => (
                            <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, fontWeight: 600, fontStyle: 'bold'}}>
                              <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                {item.cLabel}
                              </TableCell>
                              <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                {item.cValue}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
              </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  <TableContainer component={Paper}>
                          <Table size="small">
                            <TableBody>
                              {selectionData?.dtUnitDetails_2?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, fontWeight: 600, fontStyle: 'bold'}}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      </TableContainer>
                </Grid> 
                </Grid>
              </CustomGroupBox>
            </Grid>
            </Grid>


            <Grid item xs={12}>
              <AccordionSummary
              // expandIcon={<Iconify icon="il:arrow-down" />}
              // aria-controls="panel1a-content"
              // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                Electrical Requirements
              </Typography>
              </AccordionSummary>
              <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                <Grid container spacing={2}>
                <Grid item xs={3} sx={{display: selectionData?.dtElecReqUnitOnlyElecData?.length > 0 ? 'block' : 'none' }}>
                <CustomGroupBox title="Unit">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqUnitOnlyElecData?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                    </CustomGroupBox>
                  </Grid>  
                  <Grid item xs={3} sx={{display: selectionData?.dtElecReqUnitPlusElecData?.length > 0 ? 'block' : 'none' }}>
                <CustomGroupBox title="Unit">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqUnitPlusElecData?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                    </CustomGroupBox>
                  </Grid>  
                  <Grid item xs={3} sx={{display: selectionData?.dtElecReqCoolingDXC?.length > 0 ? 'block' : 'none' }}>
                    <CustomGroupBox title="W-controller">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqCoolingDXC?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                    </CustomGroupBox>
                  </Grid> 
                  <Grid item xs={3} sx={{display: selectionData?.dtElecReqPreheatElecHeater?.length > 0 ? 'block' : 'none' }}>
                    <CustomGroupBox title="Preheat Electric Heater">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqPreheatElecHeater?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                    </CustomGroupBox>
                  </Grid> 
                  <Grid item xs={3} sx={{display: selectionData?.dtElecReqHeatingElecHeater?.length > 0 ? 'block' : 'none' }}>
                              <CustomGroupBox title="Heating Electric Heater">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqHeatingElecHeater?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                              </CustomGroupBox>
                  </Grid>    
                  <Grid item xs={3} sx={{display: selectionData?.dtElecReqReheatElecHeater?.length > 0 ? 'block' : 'none' }}>
                              <CustomGroupBox title="Heating Electric Heater">
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtElecReqReheatElecHeater?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                              </CustomGroupBox>
                  </Grid>    
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={4} sx={{display: selectionData?.dtPreheatElecHeaterData?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                Preheat Electric Heater
              </Typography>
              </AccordionSummary>
              <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomGroupBox title="Electric Heater">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtPreheatElecHeaterData?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>         
                      </Grid>
                    </CustomGroupBox>
                  </Grid>
                </Grid>           
              </Grid>
            </Grid>  


            <Grid item xs={12} sx={{display: selectionData?.dtPreheatHWC_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                    Preheat HWC
                  </Typography>
                </AccordionSummary>
                <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CustomGroupBox title="Coil">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtPreheatHWC_Data?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid>  
                    <Grid item xs={4}>
                      <CustomGroupBox title="Entering">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtPreheatHWC_Entering?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid> 
                    <Grid item xs={4}>
                      <CustomGroupBox title="Leaving">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtPreheatHWC_Leaving?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid> 
                  </Grid>
                  <Grid container spacing={2} sx={{display: selectionData?.dtPreheatHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none' }}>
                    <Grid item xs={8}>
                      <CustomGroupBox title="Valve & Actuator" 
                                      bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtPreheatHWC_ValveActuatorSize?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{display: selectionData?.dtPreheatHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none', margin:'15px 0px !important'}}>
                <Grid container spacing={2}>
                  </Grid>   
                </Grid>   */}
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtHX_FP_CORE_EntAir?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  Heat Exchanger
                  </Typography>
                </AccordionSummary>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <CustomGroupBox title="Design Conditions" 
                                  bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                      <TableBody>
                        {selectionData?.dtHX_FP_CORE_EntAir?.map((item: any, i: number) => (
                          <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '40%', fontWeight: 300}}>
                              {item.cLabel}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_2}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </CustomGroupBox>
                  <CustomGroupBox title="Performance Leaving Air" 
                                  bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                      <TableBody>
                        {selectionData?.dtHX_FP_CORE_LvgAir?.map((item: any, i: number) => (
                          <TableRow key={i} >
                            <TableCell component="th" scope="row" align="left" sx={{ width: '40%', fontWeight: 300}}>
                              {item.cLabel}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_2}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </CustomGroupBox>
                  <CustomGroupBox title="Performance" 
                                  bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                      <TableBody>
                        {selectionData?.dtHX_FP_CORE_Perf?.map((item: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '40%', fontWeight: 300}}>
                              {item.cLabel}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '30%', fontWeight: 300}}>
                              {item.cValue_2}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                  </CustomGroupBox>
                </Grid>  
              </Grid>
              <Grid container spacing={2} sx={{display: selectionData?.dtHX_FP_CORE_AHRIWarning?.length > 0 ? 'block' : 'none' }}> 
                <Grid item xs={2}/>
                <Grid item xs={10}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                            {selectionData?.dtHX_FP_CORE_AHRIWarning?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '100%', fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                    </TableContainer>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{display: selectionData?.dtHX_FP_CORE_CondWarning?.length > 0 ? 'block' : 'none' }}>                
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                      <Table size="small">
                      <TableBody>
                        {selectionData?.dtHX_FP_CORE_CondWarning?.map((item: any, i: number) => (
                          <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                            <TableCell component="th" scope="row" align="left" sx={{ width: '100%', fontWeight: 300}}>
                              {item.cValue}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtHX_FP_RECUTECH_EntAir?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  Heat Exchanger              
                  </Typography>
                </AccordionSummary>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                <CustomGroupBox title="Design Conditions" 
                                      bordersx={{ width: '100%', m: '50px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_RECUTECH_EntAir?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                <CustomGroupBox title="Performance Leaving Air" 
                                      bordersx={{ width: '100%', m: '10px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_RECUTECH_LvgAir?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                <CustomGroupBox title="Performance" 
                                      bordersx={{ width: '100%', m: '10px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_RECUTECH_Perf?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                </Grid>  
              </Grid>
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtHX_FP_POLYBLOC_EntAir?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  Heat Exchanger
                  </Typography>
                </AccordionSummary>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                <CustomGroupBox title="Design Conditions"
                                bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_POLYBLOC_EntAir?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                <CustomGroupBox title="Performance Leaving Air"
                                bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_POLYBLOC_LvgAir?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                <CustomGroupBox title="Performance"
                                bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                    <TableBody>
                      {selectionData?.dtHX_FP_POLYBLOC_Perf?.map((item: any, i: number) => (
                        <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cLabel}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                            {item.cValue_2}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </CustomGroupBox>
                </Grid>  
              </Grid>
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtCoolingCWC_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  Cooling CWC
                  </Typography>
                </AccordionSummary>
                  <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <CustomGroupBox title="Coil">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtCoolingCWC_Data?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                      </Grid>  
                      <Grid item xs={4}>
                        <CustomGroupBox title="Entering">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtCoolingCWC_Entering?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                      </Grid> 
                      <Grid item xs={4}>
                        <CustomGroupBox title="Leaving">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtCoolingCWC_Leaving?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                      </Grid> 
                    </Grid>
                    <Grid container spacing={2} sx={{display: selectionData?.dtCoolingCWC_ValveActuatorSize?.length > 0 ? 'block' : 'none' }}>
                      <Grid item xs={8}>
                        <CustomGroupBox title="Valve & Actuator" 
                                        bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtCoolingCWC_ValveActuatorSize?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                        </CustomGroupBox>
                       </Grid>

                    </Grid>
                  </Grid> 
                  {/* <Grid item xs={12} 
                            sx={{display: selectionData?.dtCoolingCWC_ValveActuatorSize?.length > 0 ? 'block' : 'none', margin:'15px 0px !important'}}>
                    <Grid container spacing={2}>
                    </Grid>              
                  </Grid>   */}
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtCoolingDXC_CM_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  Cooling DXC
                  </Typography>
                </AccordionSummary>
                <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CustomGroupBox title="Coil">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtCoolingDXC_CM_Data?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid>  
                    <Grid item xs={4}>
                      <CustomGroupBox title="Entering">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtCoolingDXC_CM_Entering?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid> 
                    <Grid item xs={4}>
                      <CustomGroupBox title="Setpoint">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtCoolingDXC_CM_Leaving?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                      <CustomGroupBox title="Coil Performance" 
                                      bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtCoolingDXC_CM_CoilPerfOutputs?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                    </Grid> 
                  </Grid>
                  <Grid container spacing={2} sx={{display: selectionData?.dtCoolingDXC_CM_EKEXV_KitData?.length > 0 ? 'block' : 'none' }}>                  
                    <Grid item xs={8}>
                      <CustomGroupBox title="VRV Integration Kit" 
                                      bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtCoolingDXC_CM_EKEXV_KitData?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                      </CustomGroupBox>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{display: selectionData?.dtCoolingDXC_CM_Warning?.length > 0 ? 'block' : 'none' }}>                
                    <Grid item xs={12}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtCoolingDXC_CM_Warning?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{ width: '100%', fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                    </Grid>

                  </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                  <Grid container spacing={2}>
                  </Grid>             
                </Grid>   */}
            </Grid>


            <Grid item xs={4} sx={{display: selectionData?.dtHeatingElecHeaterData?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                Heating Electric Heater
              </Typography>
              </AccordionSummary>
              <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomGroupBox title="Electric Heater">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtHeatingElecHeaterData?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>         
                      </Grid>
                    </CustomGroupBox>
                  </Grid>
                </Grid>           
              </Grid>
            </Grid>  


            <Grid item xs={12} sx={{display: selectionData?.dtHeatingHWC_Data?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Heating HWC
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <CustomGroupBox title="Coil">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtHeatingHWC_Data?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid>  
                        <Grid item xs={4}>
                          <CustomGroupBox title="Entering">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtHeatingHWC_Entering?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid> 
                        <Grid item xs={4}>
                          <CustomGroupBox title="Leaving">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtHeatingHWC_Leaving?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid> 
                      </Grid>
                      <Grid container spacing={2} sx={{display: selectionData?.dtHeatingHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none' }}>
                        <Grid item xs={8}>                              
                          <CustomGroupBox title="Valve & Actuator" 
                                          bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtHeatingHWC_ValveActuatorSize?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                          </CustomGroupBox>
                        </Grid>  

                      </Grid>
                    </Grid>
                    {/* <Grid item xs={12} 
                               sx={{display: selectionData?.dtHeatingHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none', margin:'15px 0px !important'}}>
                      <Grid container spacing={2}>
                      </Grid>         
                    </Grid>   */}

            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtHeatingCondCoil_Data !== undefined && 
                                             selectionData?.dtHeatingCondCoil_Data?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Heating Mode DX Coil
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                        <CustomGroupBox title="Coil">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtHeatingCondCoil_Data?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid>  
                        <Grid item xs={4}>
                        <CustomGroupBox title="Entering">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtHeatingCondCoil_Entering?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid> 
                        <Grid item xs={4}>
                        <CustomGroupBox title="Leaving">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtHeatingCondCoil_Leaving?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid> 
                      </Grid>
                    </Grid>
            </Grid>


            <Grid item xs={4} sx={{display: selectionData?.dtReheatElecHeaterData?.length > 0 ? 'block' : 'none' }}>
                <AccordionSummary
                          // expandIcon={<Iconify icon="il:arrow-down" />}
                          // aria-controls="panel1a-content"
                          // id="panel1a-header"
                >
                <Typography color="primary.main" variant="h6">
                  Reheat Electric Heater
                </Typography>
                </AccordionSummary>
                <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomGroupBox title="Electric Heater">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatElecHeaterData?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>         
                        </Grid>
                      </CustomGroupBox>
                    </Grid>
                  </Grid>           
                </Grid>
            </Grid>  


            <Grid item xs={12} sx={{display: selectionData?.dtReheatHWC_Data?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Reheat HWC
                    </Typography>
                  </AccordionSummary>
                  <Grid item xs={12} 
                             sx={{display: selectionData?.dtReheatHWC_Data?.length > 0 ? 'block' : 'none', margin:'10px 0px !important'}}>              
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                      <CustomGroupBox title="Coil">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtReheatHWC_Data?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                      </Grid>  
                      <Grid item xs={4}>
                      <CustomGroupBox title="Entering">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtReheatHWC_Entering?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                      </Grid> 
                      <Grid item xs={4}>
                      <CustomGroupBox title="Leaving">
                        <TableContainer component={Paper}>
                          <Table size="small">
                          <TableBody>
                            {selectionData?.dtReheatHWC_Leaving?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cLabel}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </CustomGroupBox>
                      </Grid> 
                    </Grid>
                    <Grid container spacing={2} sx={{display: selectionData?.dtReheatHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none' }}>
  
                      <Grid item xs={8}>
                      <CustomGroupBox title="Valve & Actuator" 
                                      bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatHWC_ValveActuatorSize?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12} 
                             sx={{display: selectionData?.dtReheatHWC_ValveActuatorSize?.length > 0 ? 'block' : 'none', margin:'15px 0px !important'}}>
                    <Grid container spacing={2}>
                      </Grid>
                    </Grid>   */}

            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtReheatHGRC_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
              // expandIcon={<Iconify icon="il:arrow-down" />}
              // aria-controls="panel1a-content"
              // id="panel1a-header"
            >
            <Typography color="primary.main" variant="h6">
                    Reheat HGRH
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'10px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <CustomGroupBox title="Coil">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatHGRC_Data?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid>  
                        <Grid item xs={4}>
                          <CustomGroupBox title="Entering">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatHGRC_Entering?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid> 
                        <Grid item xs={4}>
                          <CustomGroupBox title="Setpoint">
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatHGRC_Leaving?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                          <CustomGroupBox title="Coil Performance" 
                                          bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtReheatHGRC_CoilPerfOutputs?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </CustomGroupBox>
                        </Grid> 
                      </Grid>
                      <Grid container spacing={2} sx={{display: selectionData?.dtReheatHGRC_EKEXV_KitData?.length > 0 ? 'block' : 'none' }}>
                        <Grid item xs={8}>
                          <CustomGroupBox title="VRV Integration Kit" 
                                          bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtReheatHGRC_EKEXV_KitData?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cLabel}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                          </CustomGroupBox>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{display: selectionData?.dtReheatHGRC_Warning?.length > 0 ? 'block' : 'none' }}>
                        <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                  <TableBody>
                                    {selectionData?.dtReheatHGRC_Warning?.map((item: any, i: number) => (
                                      <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                        <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                          {item.cValue}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                      <Grid container spacing={2}>
                          </Grid>
                    </Grid>   */}
            </Grid>


            <Grid item xs={4} sx={{display: selectionData?.dtBackupHeatingElecHeaterData?.length > 0 ? 'block' : 'none' }}>
                <AccordionSummary
                          // expandIcon={<Iconify icon="il:arrow-down" />}
                          // aria-controls="panel1a-content"
                          // id="panel1a-header"
                >
                <Typography color="primary.main" variant="h6">
                  Backup Electric Heater
                </Typography>
                </AccordionSummary>
                <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <CustomGroupBox title="Electric Heater">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                              <TableBody>
                                {selectionData?.dtBackupHeatingElecHeaterData?.map((item: any, i: number) => (
                                  <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cLabel}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                      {item.cValue}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>         
                        </Grid>
                      </CustomGroupBox>
                    </Grid>
                  </Grid>           
                </Grid>
            </Grid>  


            <Grid item xs={12} sx={{display: selectionData?.dtSF_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Supply Fan
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'10px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                        <CustomGroupBox title="Fan Data">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtSF_Data?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid>  
                        <Grid item xs={7}>
                        <CustomGroupBox title="Graph">
                        <Image
                                src={
                                  intProdTypeId === 3
                                    ? `/${selectionData?.dtSF_Graph?.[0]?.cValue}`
                                    : `data:image/jpeg;base64,${selectionData?.dtSF_Graph?.[0]?.cValue}`
                                }
                                // height="100%" 
                                width={75}
                              />
                        </CustomGroupBox>
                        </Grid> 
                      </Grid>
                    </Grid>  
                    <Grid item xs={12} sx={{margin:'30px 0px !important'}}>
                        <CustomGroupBox title="Fan Sound Data (Hz)">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtSF_SoundData?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_2}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_3}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_4}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_5}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_6}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_7}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_8}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_9}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_10}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                    </Grid>  
            </Grid>


            <Grid item xs={12} 
                       sx={{display: (selectionData?.dtEF_Data !== undefined && selectionData?.dtEF_Data?.length > 0) ? 'block' : 'none' }}>
            <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Exhaust Fan
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'10px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                        <CustomGroupBox title="Fan Data">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtEF_Data?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid>  
                        <Grid item xs={7}>
                        <CustomGroupBox title="Graph">
                        <Image
                                src={
                                    intProdTypeId === 3
                                    ? `/${selectionData?.dtEF_Graph?.[0]?.cValue}`
                                    : `data:image/jpeg;base64,${selectionData?.dtEF_Graph?.[0]?.cValue}`
                                }
                                height="100%"
                              />
                        </CustomGroupBox>
                        </Grid> 
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sx={{margin:'30px 0px !important'}}>
                        <CustomGroupBox title="Fan Sound Data (Hz)">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtEF_SoundData?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_2}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_3}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_4}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_5}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_6}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_7}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_8}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_9}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_10}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid>  
                      </Grid>

                    </Grid>
            </Grid>


            <Grid item xs={12} sx={{display: selectionData?.dtSoundData?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    Unit Sound Data (Hz)
                    </Typography>
                  </AccordionSummary>
                    <Grid item xs={12} sx={{margin:'10px 0px !important'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <CustomGroupBox title="">
                          <TableContainer component={Paper}>
                            <Table size="small">
                            <TableBody>
                              {selectionData?.dtSoundData?.map((item: any, i: number) => (
                                <TableRow key={i} sx={{'&:last-child td, &:last-child th': {border: 0,}, }}>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cLabel}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_2}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_3}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_4}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_5}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_6}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_7}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_8}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_9}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left" sx={{fontWeight: 300}}>
                                    {item.cValue_10}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </CustomGroupBox>
                        </Grid>  
                      </Grid>

                    </Grid>
            </Grid>



            {/* {SelectionInfo?.map((item: any, index: number) => (
          
          <Accordion
                key={index}
                expanded={expanded[`panel${index}`]}
                sx={{ display: item.visible !== true ? 'none' : 'block' }}
                onChange={() =>
                  setExpanded({ ...expanded, [`panel${index}`]: !expanded[`panel${index}`] })
                }
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="il:arrow-down" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                    {item.groupName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={6}>
                    <Stack
                      direction={item.direction}
                      alignItems="stretch"
                      justifyContent="left"
                      spacing={3}
                      sx={{ ...item.style }}
                    >
                      {item.subGroups.map((element: any, i: number) =>
                        Array.isArray(element) ? (
                          <Box key={i}>
                            {element.map((ele, ii) => (
                              <CustomGroupBox
                                title={ele.title}
                                key={ele.title + ii}
                                bordersx={{
                                  display:
                                    ele.data !== undefined && ele.data.length > 0
                                      ? 'block'
                                      : 'none',
                                  width: 'auto',
                                  m: '10px 10px!important',
                                  padding: '20px',
                                }}
                                titlesx={{
                                  fontSize: '18px',
                                  transform: 'translate(25px, -10px) scale(0.75)',
                                }}
                              >
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                    <TableBody>
                                      {ele.data &&
                                        ele.data.map((row: any, iii: number) => (
                                          <TableRow
                                            key={iii}
                                            sx={{
                                              '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                          >
                                            {row?.map((rowItem: any, iiii: number) => (
                                              <TableCell
                                                key={rowItem + iiii}
                                                component="th"
                                                scope="row"
                                                align="left"
                                              >
                                                {rowItem}
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CustomGroupBox>
                            ))}
                          </Box>
                        ) : (
                          <CustomGroupBox
                            title={element.title}
                            key={element.title + index}
                            bordersx={{
                              display:
                                (element.title === 'Graph' ||
                                  (element.data !== undefined && element.data.length > 0)) &&
                                element.data !== null
                                  ? 'block'
                                  : 'none',
                              width: 'auto',
                              m: '10px 10px!important',
                              padding: '20px',
                            }}
                            titlesx={{
                              fontSize: '18px',
                              transform: 'translate(25px, -10px) scale(0.75)',
                            }}
                          >
                            {element.title === 'Graph' && element.data !== null && (
                              <Image
                                src={
                                  unitTypeData?.intProductTypeID === 3
                                    ? `/${element.data}`
                                    : element.data
                                }
                                height="100%"
                              />
                            )}

                            {element.title !== 'Graph' && (
                              <TableContainer component={Paper} sx={{ height: '100%' }}>
                                <Table size="small">
                                  <TableBody>
                                    {element.data &&
                                      element.data.map((row: any, idx: number) => (
                                        <TableRow
                                          key={idx}
                                          sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                          }}
                                        >
                                          {typeof row !== 'object'
                                            ? row?.map((rowitem: any, ii: number) => (
                                                <TableCell
                                                  key={ii}
                                                  component="th"
                                                  scope="row"
                                                  align="left"
                                                >
                                                  {rowitem}
                                                </TableCell>
                                              ))
                                            : Object.values(row)?.map(
                                                (rowItem: any, iii: number) => (
                                                  <TableCell
                                                    key={iii}
                                                    component="th"
                                                    scope="row"
                                                    align="left"
                                                  >
                                                    {rowItem}
                                                  </TableCell>
                                                )
                                              )}
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            )}
                          </CustomGroupBox>
                        )
                      )}
                    </Stack>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))} */}
          </Stack>
        )}
      </Container>
    </RootStyle>
  );
}

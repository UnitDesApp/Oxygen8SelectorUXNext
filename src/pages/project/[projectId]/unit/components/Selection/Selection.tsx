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
import { useGetSelectionInfo } from 'src/hooks/useApi';
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
  fontSize: '25px',
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
interface CustomGroupBoxProps {
  title: string;
  children: any;
  bordersx: any;
  titlesx: any;
}

function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
      {children}
    </CustomGroupBoxBorder>
  );
}

//------------------------------------------------
interface SelectionProps {
  unitTypeData: any;
  intUnitNo: number;
}

export default function Selection({ unitTypeData, intUnitNo }: SelectionProps) {
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

  const { data: selectionData, isLoading: isLoadingSelectionInfo } = useGetSelectionInfo({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: projectId,
    intProdTypeId: unitTypeData?.intProductTypeID,
    intUnitTypeId: unitTypeData?.intUnitTypeID,
    intUnitNo,
  });

  const viewSelectionInfo = useMemo(
    () => ({
      pricingDetail: selectionData?.pricingOutput?.pricingDataTbl,
      pricingVisible: selectionData?.pricingOutput?.visible,
      unitDetails: selectionData?.unitDetailsOutput?.unitDetails_1DataTbl.concat(
        selectionData?.unitDetailsOutput?.unitDetails_2DataTbl
      ),
      unitDetailsVisible: selectionData?.unitDetailsOutput.visible,
      electricalRequirements: {
        unitData: selectionData?.elecReqOutput?.unitDataTbl,
        unitDataVisible: selectionData?.elecReqOutput?.unitVisible,
        unitOnlyData: selectionData?.elecReqOutput?.unitOnlyDataTbl,
        unitOnlyDataVisible: selectionData?.elecReqOutput?.unitOnlyVisible,
        coolingDXCData: selectionData?.elecReqOutput?.coolingDXCDataTbl,
        coolingDXCVisible: selectionData?.elecReqOutput?.coolingDXCVisible,
        preheatElecHeaterData: selectionData?.elecReqOutput?.preheatElecHeaterDataTbl,
        preheatElecHeaterVisible: selectionData?.elecReqOutput?.preheatElecHeaterVisible,
        heatingElecHeaterData: selectionData?.elecReqOutput?.heatingElecHeaterDataTbl,
        heatingElecHeaterVisible: selectionData?.elecReqOutput?.heatingElecHeaterVisible,
      },
      preheatElecHeater: {
        Visible: selectionData?.preheatElecHeaterOutput?.visible,
        Data: selectionData?.preheatElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      preheatHWC: {
        Visible: selectionData?.preheatHWC_Output?.visible,
        Data: selectionData?.preheatHWC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.preheatHWC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.preheatHWC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        ValveActuatorVisible: selectionData?.preheatHWC_Output?.valveActuatorVisible,
        ValveActuator: selectionData?.preheatHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      heatExchCORE: {
        performanceVisible: selectionData?.fixedPlateCORE_Output?.visible,
        performance: selectionData?.fixedPlateCORE_Output?.performanceDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue_1,
          item.cValue_2,
        ]),
        designConditions: selectionData?.fixedPlateCORE_Output?.enteringDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        performanceLeavingAir: selectionData?.fixedPlateCORE_Output?.leavingDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        // performanceLeavingAirVisible: selectionData?.fixedPlateCORE_Output?.gvOutHX_FP_LvgAirVisible,
      },
      heatExchRECUTECH: {
        performanceVisible: selectionData?.fixedPlateRECUTECH_Output?.visible,
        performance: selectionData?.fixedPlateRECUTECH_Output?.performanceDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        designConditions: selectionData?.fixedPlateRECUTECH_Output?.enteringDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        // designConditionsVisible: selectionData?.fixedPlateRECUTECH_Output?.gvOutHX_FP_EntAirVisible,
        performanceLeavingAir: selectionData?.fixedPlateRECUTECH_Output?.leavingDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        // performanceLeavingAirVisible: selectionData?.fixedPlateRECUTECH_Output?.gvOutHX_FP_LvgAirVisible,
      },
      heatExchPOLYBLOC: {
        performanceVisible: selectionData?.fixedPlatePOLYBLOC_Output?.visible,
        performance: selectionData?.fixedPlatePOLYBLOC_Output?.performanceDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        designConditions: selectionData?.fixedPlatePOLYBLOC_Output?.enteringDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        // designConditionsVisible: selectionData?.fixedPlatePOLYBLOC_Output?.gvOutHX_FP_EntAirVisible,
        performanceLeavingAir: selectionData?.fixedPlatePOLYBLOC_Output?.leavingDataTbl?.map(
          (item: any) => [item.cLabel, item.cValue_1, item.cValue_2]
        ),
        // performanceLeavingAirVisible: selectionData?.fixedPlatePOLYBLOC_Output?.gvOutHX_FP_LvgAirVisible,
      },
      coolingCWC: {
        Visible: selectionData?.coolingCWC_Output?.visible,
        Data: selectionData?.coolingCWC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.coolingCWC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.coolingCWC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        ValveActuatorVisible: selectionData?.coolingCWC_Output?.valveActuatorVisible,
        ValveActuator: selectionData?.coolingCWC_Output?.valveActuatorDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      coolingDXC: {
        Visible: selectionData?.coolingDXC_Output?.visible,
        Data: selectionData?.coolingDXC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.coolingDXC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.coolingDXC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        PerfOutputs: selectionData?.coolingDXC_Output?.perfOutputsDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        EKEXV_Kit: selectionData?.coolingDXC_Output?.ekexvKitDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      heatingCondCoil: {
        Visible: selectionData?.heatingCondCoilOutput?.visible,
        Data: selectionData?.heatingCondCoilOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.heatingCondCoilOutput?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.heatingCondCoilOutput?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      heatingElecHeater: {
        Visible: selectionData?.heatingElecHeaterOutput?.visible,
        Data: selectionData?.heatingElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      heatingHWC: {
        Visible: selectionData?.heatingHWC_Output?.visible,
        Data: selectionData?.heatingHWC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.heatingHWC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.heatingHWC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        ValveActuatorVisible: selectionData?.heatingHWC_Output?.valveActuatorVisible,
        ValveActuator: selectionData?.heatingHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      reheatElecHeater: {
        Visible: selectionData?.reheatElecHeaterOutput?.visible,
        Data: selectionData?.reheatElecHeaterOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      reheatHWC: {
        Visible: selectionData?.reheatHWC_Output?.visible,
        Data: selectionData?.reheatHWC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.reheatHWC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.reheatHWC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        ValveActuatorVisible: selectionData?.reheatHWC_Output?.valveActuatorVisible,
        ValveActuator:
          selectionData?.reheatHWC_Output?.valveActuatorDataTbl?.map((item: any) => [
            item.cLabel,
            item.cValue,
          ]) || [],
      },
      reheatHGRC: {
        Visible: selectionData?.reheatHGRC_Output?.visible,
        Data: selectionData?.reheatHGRC_Output?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Entering: selectionData?.reheatHGRC_Output?.enteringDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        Leaving: selectionData?.reheatHGRC_Output?.leavingDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        PerfOutputs: selectionData?.reheatHGRC_Output?.performanceDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        EKEXV_Kit: selectionData?.reheatHGRC_Output?.ekexvKitDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
      },
      supplyFan: {
        Visible: selectionData?.supplyFanOutput?.visible,
        Data: selectionData?.supplyFanOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        GraphImageUrl: selectionData?.supplyFanOutput?.graphImageUrl,
        soundDataVisible: selectionData?.supplyFanOutput?.soundDataVisible,
        soundData: selectionData?.supplyFanOutput?.soundDataDataTbl,
      },
      exhaustFan: {
        Visible: selectionData?.exhaustFanOutput?.visible,
        Data: selectionData?.exhaustFanOutput?.featuresDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue,
        ]),
        GraphImageUrl: selectionData?.exhaustFanOutput?.graphImageUrl,
        soundDataVisible: selectionData?.exhaustFanOutput?.soundDataVisible,
        soundData: selectionData?.exhaustFanOutput?.soundDataDataTbl,
      },
      soundData: {
        Visible: selectionData?.soundDataOutput?.visible,
        Data: selectionData?.soundDataOutput?.soundDataDataTbl?.map((item: any) => [
          item.cLabel,
          item.cValue_1,
          item.cValue_2,
          item.cValue_3,
          item.cValue_4,
          item.cValue_5,
          item.cValue_6,
          item.cValue_7,
          item.cValue_8,
          item.cValue_9,
          item.cValue_10,
        ]),
      },
    }),
    [selectionData]
  );

  const {
    pricingDetail,
    pricingVisible,
    unitDetails,
    unitDetailsVisible,
    electricalRequirements,
    preheatElecHeater,
    preheatHWC,
    heatExchCORE,
    heatExchRECUTECH,
    heatExchPOLYBLOC,
    coolingCWC,
    coolingDXC,
    heatingCondCoil,
    heatingElecHeater,
    heatingHWC,
    reheatElecHeater,
    reheatHWC,
    reheatHGRC,
    supplyFan,
    exhaustFan,
    soundData,
  } = viewSelectionInfo;

  const SelectionInfo: any = useMemo(() => {
    const data = [];

    if (pricingDetail) {
      data?.push({
        groupName: 'Pricing',
        direction: 'column',
        style: {},
        visible: pricingVisible,
        subGroups: [
          {
            title: 'Pricing Detail',
            data: pricingDetail?.map((item: any) => [item.cLabel, item.cValue, item.cNotes]),
            visible: pricingVisible,
          },
        ],
      });
    }

    if (unitDetails) {
      data?.push({
        groupName: 'Unit Details',
        direction: 'column',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 2fr)',
        },
        visible: unitDetailsVisible,
        subGroups: [
          {
            title: 'Unit Details 1',
            data: unitDetails?.slice(0, 6).map((item: any) => [item.cLabel, item.cValue]),
            visible: unitDetailsVisible,
          },
          {
            title: 'Unit Details 2',
            data: unitDetails?.slice(6).map((item: any) => [item.cLabel, item.cValue]),
            visible: unitDetailsVisible,
          },
        ],
      });
    }

    if (electricalRequirements) {
      data.push({
        groupName: 'Electrical Requirements',
        direction: 'row',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        visible:
          electricalRequirements?.coolingDXCVisible ||
          electricalRequirements?.unitDataVisible ||
          electricalRequirements?.preheatElecHeaterVisible ||
          electricalRequirements?.heatingElecHeaterVisible,
        subGroups: [
          {
            title: 'Unit',
            data: electricalRequirements?.unitData?.map((item: any) => [item.cLabel, item.cValue]),
            visible: electricalRequirements?.unitDataVisible,
          },
          {
            title: 'W-controller',
            data:
              electricalRequirements?.coolingDXCData !== undefined &&
              electricalRequirements?.coolingDXCData?.map((item: any) => [
                item.cLabel,
                item.cValue,
              ]),
            visible:
              electricalRequirements?.coolingDXCVisible !== undefined &&
              electricalRequirements?.coolingDXCVisible,
          },
          {
            title: 'Preheat Electric Heater',
            data:
              electricalRequirements?.preheatElecHeaterData !== undefined &&
              electricalRequirements?.preheatElecHeaterData?.map((item: any) => [
                item.cLabel,
                item.cValue,
              ]),
            visible:
              electricalRequirements?.preheatElecHeaterVisible !== undefined &&
              electricalRequirements?.preheatElecHeaterVisible,
          },
          {
            title: 'Heating Electric Heater',
            data:
              electricalRequirements?.heatingElecHeaterData !== undefined &&
              electricalRequirements?.heatingElecHeaterData?.map((item: any) => [
                item.cLabel,
                item.cValue,
              ]),
            visible:
              electricalRequirements?.heatingElecHeaterVisible !== undefined &&
              electricalRequirements?.heatingElecHeaterVisible,
          },
        ],
      });
    }

    if (preheatElecHeater) {
      data.push({
        groupName: 'Preheat Electric Heater',
        direction: 'column',
        visible: preheatElecHeater?.Visible,
        style: {},
        subGroups: [
          {
            title: 'Actual',
            data: preheatElecHeater?.Data,
            visible: preheatElecHeater?.Visible,
          },
        ],
      });
    }

    if (preheatHWC) {
      data.push({
        groupName: 'Preheat HWC',
        direction: 'row',
        visible: preheatHWC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: preheatHWC?.Data,
          },
          {
            title: 'Entering',
            data: preheatHWC?.Entering,
          },
          {
            title: 'Leaving',
            data: preheatHWC?.Leaving,
          },
          {
            title: 'Valve & Actuator',
            data: preheatHWC?.ValveActuator,
          },
        ],
      });
    }

    if (heatExchCORE) {
      data.push({
        groupName: 'Heat Exchanger',
        direction: 'row',
        visible: heatExchCORE?.performanceVisible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
        subGroups: [
          {
            title: 'Design Conditions',
            data: heatExchCORE?.designConditions,
          },
          {
            title: 'Performance Leaving Air',
            data: heatExchCORE?.performanceLeavingAir,
          },
          {
            title: 'Performance',
            data: heatExchCORE?.performance,
          },
        ],
      });
    }

    if (heatExchRECUTECH) {
      data.push({
        groupName: 'Heat Exchanger',
        direction: 'row',
        visible: heatExchRECUTECH?.performanceVisible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
        subGroups: [
          {
            title: 'Design Conditions',
            data: heatExchRECUTECH?.designConditions,
          },
          {
            title: 'Performance Leaving Air',
            data: heatExchRECUTECH?.performanceLeavingAir,
          },
          {
            title: 'Performance',
            data: heatExchRECUTECH?.performance,
          },
        ],
      });
    }

    if (heatExchPOLYBLOC) {
      data.push({
        groupName: 'Heat Exchanger',
        direction: 'row',
        visible: heatExchPOLYBLOC?.performanceVisible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
        subGroups: [
          {
            title: 'Design Conditions',
            data: heatExchPOLYBLOC?.designConditions,
          },
          {
            title: 'Performance Leaving Air',
            data: heatExchPOLYBLOC?.performanceLeavingAir,
          },
          {
            title: 'Performance',
            data: heatExchPOLYBLOC?.performance,
          },
        ],
      });
    }

    if (coolingCWC) {
      data.push({
        groupName: 'Cooling CWC',
        direction: 'row',
        visible: coolingCWC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: coolingCWC?.Data,
          },
          {
            title: 'Entering',
            data: coolingCWC?.Entering,
          },
          {
            title: 'Leaving',
            data: coolingCWC?.Leaving,
          },
          {
            title: 'Valve & Actuator',
            data: coolingCWC?.ValveActuator,
          },
        ],
      });
    }

    if (coolingDXC) {
      data.push({
        groupName: 'Cooling DXC',
        direction: 'row',
        visible: coolingDXC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: coolingDXC?.Data,
          },
          {
            title: 'Entering',
            data: coolingDXC?.Entering,
          },
          [
            {
              title: 'Setpoint',
              data: coolingDXC?.Leaving,
            },
            {
              title: 'Coil Performance',
              data: coolingDXC?.PerfOutputs,
            },
          ],
          {
            title: 'VRV Integration Kit',
            data: coolingDXC?.EKEXV_Kit,
          },
        ],
      });
    }

    if (heatingCondCoil) {
      data.push({
        groupName: 'Heating Mode DX Coil',
        direction: 'row',
        visible: heatingCondCoil?.Visible,
        style: {},
        subGroups: [
          {
            title: 'Coil',
            data: heatingCondCoil?.Data,
          },
          {
            title: 'Entering',
            data: heatingCondCoil?.Entering,
          },
          {
            title: 'Setpoint',
            data: heatingCondCoil?.Leaving,
          },
        ],
      });
    }

    if (heatingElecHeater) {
      data.push({
        groupName: 'Heating Electric Heater',
        direction: 'column',
        visible: heatingElecHeater?.Visible,
        style: {},
        subGroups: [
          {
            title: 'Actual',
            data: heatingElecHeater?.Data,
          },
        ],
      });
    }

    if (heatingHWC) {
      data.push({
        groupName: 'Heating HWC',
        direction: 'row',
        visible: heatingHWC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: heatingHWC?.Data,
          },
          {
            title: 'Entering',
            data: heatingHWC?.Entering,
          },
          {
            title: 'Leaving',
            data: heatingHWC?.Leaving,
          },
          {
            title: 'Valve & Actuator',
            data: heatingHWC?.ValveActuator,
          },
        ],
      });
    }

    if (reheatElecHeater) {
      data.push({
        groupName: 'Reheat Electric Heater',
        direction: 'column',
        visible: reheatElecHeater?.Visible,
        style: {},
        subGroups: [
          {
            title: 'Actual',
            data: reheatElecHeater?.Data,
          },
        ],
      });
    }

    if (reheatHWC) {
      data.push({
        groupName: 'Reheat HWC',
        direction: 'row',
        visible: reheatHWC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: reheatHWC?.Data,
          },
          {
            title: 'Entering',
            data: reheatHWC?.Entering,
          },
          {
            title: 'Leaving',
            data: reheatHWC?.Leaving,
          },
          {
            title: 'Valve & Actuator',
            data: reheatHWC?.ValveActuator,
          },
        ],
      });
    }

    if (reheatHGRC) {
      data.push({
        groupName: 'Reheat HGRC',
        direction: 'row',
        visible: reheatHGRC?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
        subGroups: [
          {
            title: 'Coil',
            data: reheatHGRC?.Data,
          },
          {
            title: 'Entering',
            data: reheatHGRC?.Entering,
          },
          [
            {
              title: 'Setpoint',
              data: reheatHGRC?.Leaving,
            },
            {
              title: 'Coil Performance',
              data: reheatHGRC?.PerfOutputs,
            },
          ],
          {
            title: 'VRV Integration Kit',
            data: reheatHGRC?.EKEXV_Kit,
          },
        ],
      });
    }

    if (supplyFan) {
      data.push({
        groupName: 'Supply Fan',
        direction: 'row',
        visible: supplyFan?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        subGroups: [
          {
            title: 'Fan Data',
            data: supplyFan?.Data,
          },
          {
            title: 'Graph',
            data: supplyFan?.GraphImageUrl,
          },
          {
            title: 'Sound Data',
            data: supplyFan?.soundData,
          },
        ],
      });
    }

    if (exhaustFan) {
      data.push({
        groupName: 'Exhaust Fan',
        direction: 'row',
        visible: exhaustFan?.Visible,
        style: {
          display: 'grid',
          gridTemplateColumns:
            exhaustFan?.GraphImageUrl !== null ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
        },
        subGroups: [
          {
            title: 'Fan Data',
            data: exhaustFan?.Data,
          },
          {
            title: 'Graph',
            data: exhaustFan?.GraphImageUrl,
          },
          {
            title: 'Sound Data',
            data: exhaustFan?.soundData,
          },
        ],
      });
    }

    if (soundData) {
      data.push({
        groupName: 'Unit Sound Data (Hz)',
        direction: 'row',
        style: {},
        visible: soundData?.Visible,
        subGroups: [
          {
            data: soundData?.Data,
          },
        ],
      });
    }

    return data;
  }, [
    coolingCWC,
    coolingDXC,
    electricalRequirements,
    exhaustFan,
    heatExchCORE,
    heatExchPOLYBLOC,
    heatExchRECUTECH,
    heatingCondCoil,
    heatingElecHeater,
    heatingHWC,
    preheatElecHeater,
    preheatHWC,
    pricingDetail,
    pricingVisible,
    reheatElecHeater,
    reheatHGRC,
    reheatHWC,
    soundData,
    supplyFan,
    unitDetails,
    unitDetailsVisible,
  ]);

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
            {SelectionInfo?.map((item: any, index: number) => (
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
            ))}
          </Stack>
        )}
      </Container>
    </RootStyle>
  );
}

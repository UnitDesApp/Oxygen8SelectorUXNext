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
  Button,
} from '@mui/material';
// lodash
import { isEmpty } from 'lodash';
import { useGetSavedJob, useGetUnitSelection } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { PATH_APP } from 'src/routes/paths';
import * as Ids from 'src/utils/ids';
import UnitInfo from '../UnitInfo/UnitInfo';

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
  fontFamily: '__Public_Sans_e50a27, __Public_Sans_Fallback_e50a27, Helvetica, Arial, sans-serif',
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
  intUnitTypeId: number;
  setCurrentStep: (value: number) => void;
}

// export default function Selection({ unitTypeData, intUnitNo }: SelectionProps) {
export default function Selection({ intJobId, intUnitNo, intProdTypeId, intUnitTypeId, setCurrentStep }: SelectionProps) {
  const { projectId } = useRouter().query;
  const {
    data: savedJob,
  } = useGetSavedJob(
    { intJobId: projectId },
    {
      enabled: !!projectId,
    }
  );

  const [error, setError] = useState(null);
  const [isVisiblePricing, setIsVisiblePricing] = useState<boolean>(false);
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

  const { data: selectionData, isLoading: isLoadingSelectionInfo, refetch, isFetching: isFetchingSelectionInfo } = useGetUnitSelection({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: projectId,
    intUnitNo,
    intProdTypeId,
    // intUnitTypeId: unitTypeData?.intUnitTypeID,
  });

  const { push } = useRouter();

  
  useEffect(() =>  {
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  useEffect(() => {
    const UAL = typeof window !== 'undefined' && localStorage.getItem('UAL');
    switch (Number(UAL)) {
      case Ids.intUAL_Admin:
      case Ids.intUAL_AdminLvl_1:
        setIsVisiblePricing(true);
        break;
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_1:
      case Ids.intUAL_IntLvl_2:
        setIsVisiblePricing(true);
        break;
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        setIsVisiblePricing(false);
        break;
      default:
        setIsVisiblePricing(false);
        break;
    }
  }, []);
  


  const onClickUnitInfo = () => {
   setCurrentStep(1)
    // setCurrentStep(1);
    push(PATH_APP.editUnit(projectId?.toString() || '0', intUnitNo?.toString() || '0'));
  };

  const onClickUnitList = () => {
     // setCurrentStep(1);
     push(PATH_APP.projectDashboard(projectId?.toString() || '0', 'unitlist'));
    };

  const imgSFUrl = '';
  const imgSF = selectionData?.dtSF_Graph?.[0]?.cValue?.replace(/^.*[\\/]/, '')
  const imgEF = selectionData?.dtEF_Graph?.[0]?.cValue?.replace(/^.*[\\/]/, '')

const fanImgFiles = ["FanCurveH04_GTB025FHC19R.bmp", 
                    "FanCurvePSC_PI2E25080TB2M_IS_SB.png", 
                    "FanCurvePSC_PI2E280133TB2M_IS_SB_2Fan.png", 
                    "FanCurvePSC_PI2E280133TB2M_IS_SB.png"]
const filteredImgSF = fanImgFiles.filter((item) => item.includes(imgSF));  
const filteredImgEF = fanImgFiles.filter((item) => item.includes(imgEF));  

let imgSFData = "";
let imgEFData = "";

if (fanImgFiles.includes(imgSF)) {
  imgSFData = `/assets/Images/${imgSF}`;
} else {
  imgSFData = `data:image/jpeg;base64,${selectionData?.dtSF_Graph?.[0]?.cValue}`;
}

if (fanImgFiles.includes(imgEF)) {
  imgEFData = `/assets/Images/${imgEF}`;
} else {
  imgEFData = `data:image/jpeg;base64,${selectionData?.dtEF_Graph?.[0]?.cValue}`;
}
  

  return (
    <RootStyle>
      <Typography color="primary.main" variant="h3" sx={{display:'flex',justifyContent:'center'}}>
           {savedJob?.[0]?.job_name}
      </Typography>
      <Typography color="primary.main" variant="h3" sx={{display:'flex',justifyContent:'center',mt:'10px'}}>
           {selectionData?.dtUnitDetails_1?.[0]?.cValue}
      </Typography>
      <Container maxWidth="xl">
        {error && (
          <Box sx={{ maringLeft: 'auto', marginRight: 'auto', marginTop: '50px' }}>
            Server Error!
          </Box>
        )}
        {isLoadingSelectionInfo || isFetchingSelectionInfo ? (
          <LinearProgress color="info" />
        ) : (
          <>
        <Stack spacing={5} sx={{ mt: 2}}>
            <Grid item xs={12} sx={{display: isVisiblePricing === true ? 'block' : 'none' }}>
              <AccordionSummary
                  // expandIcon={<Iconify icon="il:arrow-down" />}
                  // aria-controls="panel1a-content"
                  // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                PRICING BREAKDOWN
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
                UNIT SUMMARY
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
                ELECTRICAL REQUIREMENTS
              </Typography>
              </AccordionSummary>
              <Typography color="primary.main" variant="body2">
                  {selectionData?.strElecReqQty}
              </Typography>                
              <Grid item xs={12} sx={{margin:'15px 0px !important'}}>
                <Grid container spacing={2}>
              <Grid item xs={3} sx={{margin:'0px 0px !important'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{display: selectionData?.dtElecReqUnitPlusElecData?.length > 0 ? 'block' : 'none' }}>
                    <CustomGroupBox title={selectionData?.strOutElecReqUnitData}>
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
                    <Grid item xs={12} sx={{display: selectionData?.dtElecReqUnitOnlyElecData?.length > 0 ? 'block' : 'none' }}>
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
                  </Grid>
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
              <Grid container spacing={2} sx={{display: selectionData?.dtElecReqNotesWarnings?.length > 0 ? 'block' : 'none' }}> 
                <Grid item xs={2}/>
                <Grid item xs={10}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                            {selectionData?.dtElecReqNotesWarnings?.map((item: any, i: number) => (
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


            <Grid item xs={12} sx={{display: selectionData?.dtMixingSection?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                    MIXING SECTION
                  </Typography>
                </AccordionSummary>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <CustomGroupBox title="Design Conditions" bordersx={{ width: '100%', m: '15px 0px !important', padding: '0px',}}>
                    <TableContainer component={Paper}>
                      <Table size="small">
                      <TableBody>
                        {selectionData?.dtMixingSection?.map((item: any, i: number) => (
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



            <Grid item xs={4} sx={{display: selectionData?.dtPreheatElecHeaterData?.length > 0 ? 'block' : 'none' }}>
              <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                PRE-HEAT: EC
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
                    PRE-HEAT: HWC
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
                      <CustomGroupBox title="Valve & Actuator"  bordersx={{ width: '100%', m: '30px 0px !important', padding: '0px',}}>
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
                    HEAT EXCHANGER: ERV
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


            <Grid item xs={12} sx={{display: selectionData?.dtHX_FP_POLYBLOC_EntAir?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                    HEAT EXCHANGER: ERV
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


            <Grid item xs={12} sx={{display: selectionData?.dtHX_FP_RECUTECH_EntAir?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  HEAT EXCHANGER: HRV              
                  </Typography>
                </AccordionSummary>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                <CustomGroupBox title="Design Conditions"  bordersx={{ width: '100%', m: '50px !important', padding: '0px',}}>
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
                <CustomGroupBox title="Performance Leaving Air" bordersx={{ width: '100%', m: '10px !important', padding: '0px',}}>
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


            <Grid item xs={12} sx={{display: selectionData?.dtCoolingCWC_Data?.length > 0 ? 'block' : 'none' }}>
            <AccordionSummary
                      // expandIcon={<Iconify icon="il:arrow-down" />}
                      // aria-controls="panel1a-content"
                      // id="panel1a-header"
                >
                  <Typography color="primary.main" variant="h6">
                  COOLING: CWC
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
                  COOLING: DX
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
                HEATING: EC
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
                    HEATING: HW
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
                    HEATING: DX
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
                  REHEAT: EC
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
                    REHEAT: HW
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
              REHEAT: HGRH
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
                  BACKUP HEAT: EC
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
                    SUPPLY FAN
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
                              //   src={
                              //     intProdTypeId === 3
                              //     ? `/${selectionData?.dtSF_Graph?.[0]?.cValue}`
                              //     : `data:image/jpeg;base64,${selectionData?.dtSF_Graph?.[0]?.cValue}`
                              // }
                              src={imgSFData}
                              // height="100%" 
                                width={75}
                              />
                        </CustomGroupBox>
                        </Grid> 
                      </Grid>
                    </Grid>  
                    <Grid item xs={12} sx={{margin:'30px 0px !important', display:'none' }}>
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


            <Grid item xs={12} sx={{display: (selectionData?.dtEF_Data !== undefined && selectionData?.dtEF_Data?.length > 0) ? 'block' : 'none' }}>
            <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        // aria-controls="panel1a-content"
                        // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                    EXHAUST FAN
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
                                // src={
                                //     intProdTypeId === 3
                                //     ? `/${selectionData?.dtEF_Graph?.[0]?.cValue}`
                                //     : `data:image/jpeg;base64,${selectionData?.dtEF_Graph?.[0]?.cValue}`
                                // }

                                src={imgEFData}
                                height="100%"
                              />
                        </CustomGroupBox>
                        </Grid> 
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sx={{margin:'30px 0px !important', display:'none' }}>
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
                    {/* Unit Sound Data (Hz) */}
                    SOUND DATA
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


                <Grid item xs={12}>
                  <AccordionSummary
                  // expandIcon={<Iconify icon="il:arrow-down" />}
                  // aria-controls="panel1a-content"
                  // id="panel1a-header"
                  >
                    <Typography color="primary.main" variant="h6">
                      CONFIGURATION NOTES 
                    </Typography>
                  </AccordionSummary>
                  {/* <Typography color="primary.main" variant="body2">
                  {selectionData?.strElecReqQty}
              </Typography>                 */}
                  <Grid item xs={12} sx={{ margin: '0px 0px !important' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3} sx={{ margin: '0px 0px !important' }}>
                        <Grid container spacing={2} sx={{ display: selectionData?.dtConfigNotes?.length > 0 ? 'block' : 'none' }}>
                          {/* <Grid item xs={2} /> */}
                          <Grid item xs={10}>
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableBody>
                                  {selectionData?.dtConfigNotes?.map((item: any, i: number) => (
                                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0, }, }}>
                                      <TableCell component="th" scope="row" align="left" sx={{ width: '100%', fontWeight: 300 }}>
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
                    </Grid>
                  </Grid>
                  {/* <Grid container spacing={2} sx={{ display: selectionData?.dtConfigNotes?.length > 0 ? 'block' : 'none' }}>
                    <Grid item xs={2} />
                    <Grid item xs={10}>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableBody>
                            {selectionData?.dtConfigNotes?.map((item: any, i: number) => (
                              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0, }, }}>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '100%', fontWeight: 300 }}>
                                  {item.cValue}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid> */}
                </Grid>



          </Stack>
          <Stack direction="row" justifyContent="center" textAlign="center">
            <Button
                variant="contained"
                color="primary"
                onClick={onClickUnitInfo}
                // sx={{ display: currentStep === 2 && !isProcessingData ? 'inline-flex' : 'none' }}
                sx={{width:'10%', marginTop:'25px', marginLeft:'5px', marginRight:'5px'}}            
                // startIcon={<Iconify icon="akar-icons:arrow-left" />}
              >
              Edit Unit
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={onClickUnitList}
                // sx={{ display: currentStep === 2 && !isProcessingData ? 'inline-flex' : 'none' }}
                sx={{width:'10%', marginTop:'25px', marginLeft:'5px', marginRight:'5px'}}            
                // startIcon={<Iconify icon="akar-icons:arrow-left" />}
              >
              Save
            </Button>          
          </Stack>
          </>
        )}
      </Container>
    </RootStyle>
  );
}

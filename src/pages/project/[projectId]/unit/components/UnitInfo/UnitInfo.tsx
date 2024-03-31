import React, { useCallback, useState, useEffect } from 'react';
// @mui
import { Alert, Box, Container, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import { useGetAllBaseData, useGetUnitInfo } from 'src/hooks/useApi';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import UnitInfoForm from './UnitInfoForm';
import { GetAllBaseData, GetUnitInfo } from 'src/api/website/backend_helper';

//------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
  },
}));

interface TUnitInfoData {
  oUnit?: {
    intProdTypeId?: number;
    intUnitTypeId?: number;
  };
}

//------------------------------------------------
type UnitInfoProps = {
  projectId: number;
  unitId?: number;
  setIsSavedUnit?: Function;
  isSavedUnit: boolean;
  setFunction?: Function;
  intProductTypeID?: number;
  intUnitTypeID?: number;
  edit?: boolean;
  txbProductType?: string;
  txbUnitType?: string;
  unitInfoData?: any;
};

export default function UnitInfo({
  projectId,
  unitId,
  setIsSavedUnit,
  isSavedUnit,
  intProductTypeID,
  intUnitTypeID,
  setFunction,
  edit = false,
  txbProductType,
  txbUnitType,
  unitInfoData,
}: UnitInfoProps) {

  const [baseData, setbaseData] = useState(null)
  const [unitData, setunitData] = useState(null)
  const [isLoadingUnitInfo, setisLoadingUnitInfo] = useState(true)
  const [isLoadingBaseData, setisLoadingBaseData] = useState(true)
  const [unitInfo, setunitInfo] = useState<TUnitInfoData>({})

  useEffect(() => {
    GetUnitInfo({
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      // intProjectID: projectId,
      intJobId: projectId,
      intUnitNo: edit ? unitId : -1,
    }).then((res: any) => {
      setunitData(JSON.parse(res)['unitInfo']);
      setunitInfo(JSON.parse(res)['unitInfo']);
      setisLoadingUnitInfo(false);
    })

    GetAllBaseData().then((res: any) => {
      setbaseData(JSON.parse(res));
      setisLoadingBaseData(false);
    })
    return () => {
      // second
    }
  }, [])


  // ----------------------- Success State and Handle Close ---------------------------
  const [openSuccess, setOpenSuccess] = useState(false);
  const handleCloseSuccess = useCallback(() => {
    setOpenSuccess(false);
  }, []);

  // ----------------------- Error State and Handle Close -----------------------------
  const [openError, setOpenError] = useState(false);
  const handleCloseError = () => {
    setOpenError(false);
  };
  
  return (
    <RootStyle>
      <Container>
        {
          (isLoadingBaseData || isLoadingUnitInfo) &&
          (<CircularProgressLoading />)
        }
        <Box>
          {(unitData && baseData && unitInfo) && (
            <UnitInfoForm
              projectId={projectId}
              unitId={edit ? unitId : -1}
              baseData={baseData}
              unitInfo={unitInfo}
              setIsSavedUnit={setIsSavedUnit}
              isSavedUnit={isSavedUnit}
              onSuccess={() => setOpenSuccess(true)}
              onError={() => setOpenError(true)}
              edit={edit}
              intProductTypeID={intProductTypeID || (unitInfo?.oUnit?.intProdTypeId ?? 0)}
              intUnitTypeID={intUnitTypeID || (unitInfo?.oUnit?.intUnitTypeId ?? 0)}
              setFunction={setFunction}
              txbProductType={txbProductType}
              txbUnitType={txbUnitType}
            />
          )}
        </Box>
      </Container>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Unit was successfully added!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Server Error!
        </Alert>
      </Snackbar>
    </RootStyle>
  );
}

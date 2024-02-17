/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
  colors,
} from '@mui/material';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { unitEditFormSchema, useGetDefaultValue } from 'src/hooks/useUnit';
import * as IDs from 'src/utils/ids';
import { useAuthContext } from 'src/auth/useAuthContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useApiContext } from 'src/contexts/ApiContext';
import {
  getBypass,
  getComponentInfo,
  getCustomInputsInfo,
  getDXCoilRefrigDesignCondInfo,
  getDamperAndActuatorInfo,
  getDehumidificationInfo,
  getDrainPanInfo,
  getElecHeaterVoltageInfo,
  getExhaustAirESP,
  getHandingInfo,
  getHeatElecHeaterInstallationInfo,
  getHeatPumpInfo,
  getHeatingFluidDesignCondInfo,
  getItemsAddedOnIDDataTable,
  getLocation,
  getOrientation,
  getPreheatElecHeaterInstallationInfo,
  getReheatInfo,
  getRemainingOpeningsInfo,
  getSummerReturnAirCFM,
  getSummerSupplyAirCFM,
  getSupplyAirESPInfo,
  getSupplyAirOpeningInfo,
  getUALInfo,
  getUnitModel,
  getUnitVoltage,
  getValveAndActuatorInfo,
} from './handleUnitModel';
import { getUnitModelCodes } from './getUnitNoteCodes';

//------------------------------------------------
type UnitInfoFormProps = {
  projectId: number;
  unitId?: number;
  intProductTypeID: number;
  intUnitTypeID: number;
  setIsSavedUnit?: Function;
  isSavedUnit?: boolean;
  setFunction?: Function;
  edit?: boolean;
  unitInfo?: any;
  baseData?: any;
  onSuccess?: Function;
  onError?: Function;
  txbProductType?: string;
  txbUnitType?: string;
};

export default function UnitInfoForm({
  projectId,
  unitId,
  setIsSavedUnit,
  isSavedUnit,
  setFunction,
  edit = false,
  unitInfo,
  baseData,
  onSuccess,
  onError,
  intProductTypeID,
  intUnitTypeID,
  txbProductType,
  txbUnitType,
}: UnitInfoFormProps) {
  const api = useApiContext();
  const [isLoading, setIsLoading] = useState(true);
  const [remainingOpeningsInfo, setRemainingOpeningsInfo] = useState<any>({});
  const isResetCalled = useRef(false);
  const user = useAuthContext();

  // ------------------------------- Checkbox State -----------------------------------
  const [ckbBypassVal, setCkbBypassVal] = useState(false);
  const [ckbDrainPanVal, setCkbDrainPanVal] = useState(false);
  const [ckbVoltageSPPVal, setCkbVoltageSPPVal] = useState(false);
  const [ckbDehumidificationVal, setCkbDehumidificationVal] = useState(false);
  const [ckbValveAndActuatorVal, setCkbValveAndActuatorVal] = useState(false);
  const [ckbHeatPumpVal, setCkbHeatPumpVal] = useState(false);
  const [ckbDownshotVal, setCkbDownshotVal] = useState(false);
  const [ckbFlowRateAndCap, setCkbFlowRateAndCap] = useState({
    ckbPreheatHWC_UseCap: false,
    ckbPreheatHWC_UseFlowRate: false,
    ckbCoolingCWC_UseCap: false,
    ckbCoolingCWC_UseFlowRate: false,
    ckbHeatingHWC_UseCap: false,
    ckbHeatingHWC_UseFlowRate: false,
    ckbReheatHWC_UseCap: false,
    ckbReheatHWC_UseFlowRate: false,
  });

  // ------------------------- Initialize Checkbox Values -----------------------------
  useEffect(() => {
    if (edit) {
      setCkbBypassVal(!!unitInfo?.ckbBypassVal);
      setCkbDrainPanVal(!!unitInfo?.ckbDrainPanVal);
      setCkbVoltageSPPVal(!!unitInfo?.ckbVoltageSPPVal);
      setCkbDehumidificationVal(!!unitInfo?.ckbDehumidificationVal);
      setCkbValveAndActuatorVal(!!unitInfo?.ckbValveAndActuatorVal);
      setCkbHeatPumpVal(!!unitInfo?.ckbHeatPumpVal);
      setCkbDownshotVal(!!unitInfo?.ckbDownshot?.isDownshot);
      setCkbFlowRateAndCap({
        ckbPreheatHWC_UseCap: false,
        ckbPreheatHWC_UseFlowRate: false,
        ckbCoolingCWC_UseCap: false,
        ckbCoolingCWC_UseFlowRate: false,
        ckbHeatingHWC_UseCap: false,
        ckbHeatingHWC_UseFlowRate: false,
        ckbReheatHWC_UseCap: false,
        ckbReheatHWC_UseFlowRate: false,
      });
    }
  }, [
    edit,
    unitInfo?.ckbBypassVal,
    unitInfo?.ckbDehumidificationChecked,
    unitInfo?.ckbDehumidificationVal,
    unitInfo?.ckbDownshot?.isDownshot,
    unitInfo?.ckbDrainPanVal,
    unitInfo?.ckbHeatPumpVal,
    unitInfo?.ckbValveAndActuatorVal,
    unitInfo?.ckbVoltageSPPVal,
  ]);

  // -------------------------  Accordion Pannel State -----------------------------
  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: true,
    panel3: true,
    panel4: true,
    panel5: true,
    panel6: true,
    panel7: true,
    panel8: true,
  });

  // ---------------------- Initalize Default Values ---------------------
  const defaultValues = useGetDefaultValue(edit, unitInfo, baseData);

  // ---------------- Initalize Form with default values -----------------
  const methods = useForm({
    resolver: yupResolver(unitEditFormSchema),
    defaultValues,
  });

  // -------------------------- Form Methods -----------------------------
  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors);

  useEffect(() => {
    if (!isLoading && !isResetCalled.current) {
      reset(defaultValues);
      isResetCalled.current = true;
    }
  }, [isLoading, reset, defaultValues]);

  // ------------------------- Form State Values --------------------------
  const values = watch();

  /*
   * Style functions that check if the compoment should be displayed or not
   */
  const getDisplay = useCallback((key: boolean) => ({ display: key ? 'block' : 'none' }), []);
  const getInlineDisplay = useCallback(
    (key: boolean) => ({ display: key ? 'inline-flex' : 'none' }),
    []
  );

  // -------------------- Get All Unit Information --------------------------
  const getAllFormData = useCallback(
    () => ({
      ...getValues(),
      intProjectID: projectId,
      intUnitNo: edit ? unitId : 0,
      intProductTypeID,
      intUnitTypeID,
      ddlUnitTypeId: intUnitTypeID,
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
      ckbBypassVal,
      ckbDrainPanVal,
      ckbVoltageSPPVal,
      ckbDehumidificationVal,
      ckbValveAndActuatorVal,
      ckbHeatPumpVal,
      ckbDownshotVal,
      ...ckbFlowRateAndCap,
    }),
    [
      getValues,
      projectId,
      edit,
      unitId,
      intProductTypeID,
      intUnitTypeID,
      ckbBypassVal,
      ckbDrainPanVal,
      ckbVoltageSPPVal,
      ckbDehumidificationVal,
      ckbValveAndActuatorVal,
      ckbHeatPumpVal,
      ckbDownshotVal,
      ckbFlowRateAndCap,
    ]
  );

  // --------------------------- Submit (Save) -----------------------------
  const onSubmit = useCallback(async () => {
    try {
      const data = await api.project.saveUnitInfo(getAllFormData());
      if (onSuccess) onSuccess(true);
      if (setIsSavedUnit) setIsSavedUnit(data?.intUnitNo || 0);
    } catch (e) {
      console.log(e);
      if (onError) onError(true);
    }
  }, [edit, onSuccess, onError, getAllFormData, setIsSavedUnit]);

  // -------------------- Get String Unit Model Codes ----------------------
  const { strUnitModelValue } = useMemo(() => {
    if (!values.ddlUnitModelId || values.ddlUnitModelId === '') return { strUnitModelValue: '' };
    let unitModel = [];

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeNovaID:
        unitModel = baseData.novaUnitModel;
        break;
      case IDs.intProdTypeVentumID:
        unitModel = baseData.ventumHUnitModel;
        break;
      case IDs.intProdTypeVentumLiteID:
        unitModel = baseData.ventumLiteUnitModel;
        break;
      case IDs.intProdTypeVentumPlusID:
        unitModel = baseData.ventumPlusUnitModel;
        break;
      case IDs.intProdTypeTerraID:
        unitModel = baseData.terraUnitModel;
        break;
      default:
        break;
    }

    const unitModelValue = unitModel?.filter((item: any) => item.id === values.ddlUnitModelId)?.[0]
      ?.value;

    return getUnitModelCodes(
      unitModelValue,
      intProductTypeID,
      intUnitTypeID,
      values.ddlLocationId,
      values.ddlOrientationId,
      Number(ckbBypassVal),
      baseData
    );
  }, [
    ckbBypassVal,
    baseData,
    intProductTypeID,
    intUnitTypeID,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.ddlUnitModelId,
  ]);

  /* ---------------------------- Start OnChange functions ---------------------------- */
  const ddlLocationChanged = useCallback(
    (e: any) => setValue('ddlLocationId', Number(e.target.value)),
    [setValue]
  );

  const ddlOrientationChanged = useCallback(
    (e: any) => setValue('ddlOrientationId', Number(e.target.value)),
    [setValue]
  );

  const ddlUnitModelChanged = useCallback(
    (e: any) => setValue('ddlUnitModelId', Number(e.target.value)),
    [setValue]
  );

  const ddlUnitVoltageChanged = useCallback(
    (e: any) => setValue('ddlUnitVoltageId', Number(e.target.value)),
    [setValue]
  );

  const ddlPreheatCompChanged = useCallback(
    (e: any) => setValue('ddlPreheatCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlCoolingCompChanged = useCallback(
    (e: any) => setValue('ddlCoolingCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlHeatingCompChanged = useCallback(
    (e: any) => setValue('ddlHeatingCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlReheatCompChanged = useCallback(
    (e: any) => setValue('ddlReheatCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlElecHeaterVoltageId', Number(e.target.value)),
    [setValue]
  );

  const ckbHeatPumpChanged = useCallback(
    () => setCkbHeatPumpVal(!ckbHeatPumpVal),
    [ckbHeatPumpVal]
  );

  const ckbDehumidificationChanged = useCallback(() => {
    setCkbDehumidificationVal(!ckbDehumidificationVal);
    console.log('ckbDehumidificationVal:', ckbDehumidificationVal);
  }, [ckbDehumidificationVal]);

  const setValueWithCheck = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
      } else if (!Number.isNaN(+e.target.value)) {
        setValue(key, parseFloat(e.target.value));
        return true;
      }
      return false;
    },
    [setValue]
  );

  const ddlHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlHandingId', Number(e.target.value));
    },
    [setValue]
  );

  const ddlSupplyAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlSupplyAirOpeningId', Number(e.target.value));
      setValue('ddlSupplyAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlExhaustAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlExhaustAirOpeningId', Number(e.target.value));
      setValue('ddlExhaustAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlOutdoorAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlOutdoorAirOpeningId', Number(e.target.value));
      setValue('ddlOutdoorAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlReturnAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlReturnAirOpeningId', Number(e.target.value));
      setValue('ddlReturnAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  /* ---------------------------- End OnChange functions ---------------------------- */

  // ---------------------------- Check if UnitType is AHU ----------------------------
  const isUnitTypeAHU = useCallback(() => intUnitTypeID === IDs.intUnitTypeAHU_ID, [intUnitTypeID]);

  // ------------------------------- Drop Files Option --------------------------------
  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'layoutImage',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // ----------------------- Get UnitModel Dropdown List ---------------------------
  const unitModel = useMemo(() => {
    const { unitModelList, summerSupplyAirCFM } = getUnitModel(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      Number(values.ddlUnitModelId),
      Number(values.ddlLocationId),
      Number(values.ddlOrientationId),
      values.txbSummerSupplyAirCFM,
      Number(ckbBypassVal),
      Number(user?.UAL || 0)
    );

    const filteredUnitModel = unitModelList?.filter((item: any) => item.id) || [];

    if (filteredUnitModel.length > 0) {
      setValue('ddlUnitModelId', filteredUnitModel?.[0]?.id);
    }

    if (summerSupplyAirCFM && values.txbSummerSupplyAirCFM === summerSupplyAirCFM.toString()) {
      setValue('txbSummerSupplyAirCFM', summerSupplyAirCFM.toString());
    }

    return unitModelList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseData,
    intUnitTypeID,
    intProductTypeID,
    values.ddlUnitModelId,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.txbSummerSupplyAirCFM,
    ckbBypassVal,
    user?.UAL,
    setValue,
  ]);

  // ------------------------------ Get Bypass State -------------------------------
  const ckbBypassInfo = useMemo(() => {
    const result = getBypass(
      baseData,
      intProductTypeID,
      values.ddlUnitModelId,
      values.ddlOrientationId,
      Number(ckbBypassVal)
    );
    setCkbBypassVal(!!result.checked);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseData, intProductTypeID, values.ddlOrientationId, values.ddlUnitModelId]);

  // ---------------------------- Get Orientation Info -----------------------------
  const orientationInfo = useMemo(() => {
    const orientationData = getOrientation(
      baseData,
      intProductTypeID,
      intUnitTypeID,
      values.ddlLocationId,
      Number(values.txbSummerSupplyAirCFM)
    );

    if (
      orientationData?.filter((item: any) => item.id && item.id === values.ddlOrientationId)
        .length === 0
    ) {
      setValue('ddlOrientationId', orientationData?.[0]?.id || 0);
    }

    return orientationData;
  }, [
    baseData,
    intProductTypeID,
    intUnitTypeID,
    setValue,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.txbSummerSupplyAirCFM,
  ]);

  // ---------------------------- Get Orientation Info -----------------------------
  const locationInfo = useMemo(() => {
    const locations = getLocation(baseData, intProductTypeID, intUnitTypeID);

    if (locations?.filter((item: any) => item.id === values.ddlLocationId)?.length === 0) {
      setValue('ddlLocationId', locations[0].id);
    }

    return locations;
  }, [baseData, intProductTypeID, intUnitTypeID, setValue, values.ddlLocationId]);

  // ---------------------------- Get Unit Voltage Info -----------------------------
  const unitVoltage = useMemo(() => {
    const { unitVoltageList, ddlUnitVoltageId } = getUnitVoltage(
      baseData,
      intProductTypeID,
      strUnitModelValue
    );
    if (unitVoltageList?.filter((item: any) => item.id === values.ddlUnitVoltageId)?.length === 0) {
      setValue('ddlUnitVoltageId', ddlUnitVoltageId);
    }
    return unitVoltageList;
  }, [baseData, intProductTypeID, strUnitModelValue, values.ddlUnitVoltageId, setValue]);

  // ---------------------------- Get QAFilter Model DDL -----------------------------
  const OAFilterModel = useMemo(
    () => baseData?.filterModel?.filter((item: any) => item.outdoor_air === 1),
    [baseData]
  );

  // ---------------------------- Get RAFilter Model DDL -----------------------------
  const RAFilterModel = useMemo(
    () => baseData?.filterModel?.filter((item: any) => item.return_air === 1),
    [baseData]
  );

  // ---------------------------- Initialize QAFilter Model --------------------------
  useEffect(() => {
    if (
      OAFilterModel?.filter((item: any) => item?.id === values.ddlOA_FilterModelId).length === 0
    ) {
      setValue('ddlOA_FilterModelId', OAFilterModel[0].id);
    }
  }, [setValue, OAFilterModel, values.ddlOA_FilterModelId]);

  // ---------------------------- Initialize RAFilter Model --------------------------
  useEffect(() => {
    if (
      RAFilterModel?.filter((item: any) => item?.id === values.ddlRA_FilterModelId).length === 0
    ) {
      setValue('ddlRA_FilterModelId', RAFilterModel[0].id);
    }
  }, [setValue, RAFilterModel, values.ddlOA_FilterModelId]);

  // ------------------------- Get each complete informaiton --------------------------
  const { dtPreheatComp, dtCoolingComp, dtHeatingComp } = useMemo(
    () => getComponentInfo(baseData, Number(intProductTypeID), Number(intUnitTypeID)),
    [baseData, intProductTypeID, intUnitTypeID]
  );

  const { dtReheatComp } = useMemo(
    () =>
      getReheatInfo(
        baseData,
        ckbDehumidificationVal,
        Number(values.ddlCoolingCompId),
        Number(user?.UAL || 0),
        Number(intUnitTypeID),
        Number(intProductTypeID),
        Number(values.ddlUnitModelId)
      ),
    [
      ckbDehumidificationVal,
      baseData,
      intProductTypeID,
      intUnitTypeID,
      user?.UAL,
      values.ddlCoolingCompId,
      values.ddlUnitModelId,
    ]
  );

  // ---------------- Get Preheat Elec Heater Installation Info --------------------
  const preheatElecHeaterInstallationInfo = useMemo(() => {
    const result = getPreheatElecHeaterInstallationInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlLocationId),
      intProductTypeID
    );

    if (!edit)
      setValue(
        'ddlPreheatElecHeaterInstallationId',
        result?.ddlPreheatElecHeaterInstallationId || 1
      );

    return result.ddlPreheatElecHeaterInstallationDataTbl;
  }, [edit, baseData, setValue, intProductTypeID, values.ddlLocationId, values.ddlPreheatCompId]);

  const customInputs = useMemo(
    () =>
      getCustomInputsInfo(
        Number(values.ddlPreheatCompId),
        Number(values.ddlCoolingCompId),
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId),
        Number(intUnitTypeID)
      ),
    [
      intUnitTypeID,
      values.ddlCoolingCompId,
      values.ddlHeatingCompId,
      values.ddlPreheatCompId,
      values.ddlReheatCompId,
    ]
  );

  // -------------- Get User Authentication Level from LocalStorage ----------------
  const ualInfo = useMemo(
    () => getUALInfo(Number(typeof window !== 'undefined' && localStorage.getItem('UAL'))),
    []
  );

  // -------------- Get Heating Pump Information ----------------
  const heatPumpInfo = useMemo(() => {
    const result = getHeatPumpInfo(Number(values.ddlCoolingCompId));
    ckbHeatPumpChanged();
    return result;
  }, [values.ddlCoolingCompId]);

  // -------------- Get Dehumidification Information ----------------
  const dehumidificationInfo = useMemo(
    () => getDehumidificationInfo(Number(values.ddlCoolingCompId)),
    [values.ddlCoolingCompId]
  );

  // -------------- Get Coil Refrigerate Design Condition Information ----------------
  const dxCoilRefrigDesignCondInfo = useMemo(
    () =>
      getDXCoilRefrigDesignCondInfo(
        Number(typeof window !== 'undefined' && localStorage.getItem('UAL')),
        Number(values.ddlCoolingCompId)
      ),
    [values.ddlCoolingCompId]
  );

  const heatElecHeaterInstallationInfo = useMemo(
    () =>
      getHeatElecHeaterInstallationInfo(
        baseData,
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId)
      ),
    [baseData, intProductTypeID, values.ddlHeatingCompId, values.ddlReheatCompId]
  );

  const heatingFluidDesignCondInfo = useMemo(() => {
    const result = getHeatingFluidDesignCondInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId)
    );

    if (!edit) {
      setValue('ddlHeatingFluidTypeId', result?.ddlHeatingFluidTypeId);
      setValue('ddlHeatingFluidConcentrationId', result?.ddlHeatingFluidConcentrationId);
    }

    return result;
  }, [
    edit,
    baseData,
    setValue,
    values.ddlHeatingCompId,
    values.ddlPreheatCompId,
    values.ddlReheatCompId,
  ]);

  const damperAndActuatorInfo = useMemo(() => {
    const result = getDamperAndActuatorInfo(
      baseData,
      Number(intProductTypeID),
      Number(values.ddlLocationId)
    );
    if (!edit) setValue('ddlDamperAndActuatorId', result?.ddlDamperAndActuatorId);
    return result;
  }, [edit, baseData, setValue, intProductTypeID, values.ddlLocationId]);

  const elecHeaterVoltageInfo = useMemo(() => {
    const result = getElecHeaterVoltageInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId),
      Number(intProductTypeID),
      Number(intUnitTypeID),
      Number(values.ddlElecHeaterVoltageId),
      Number(values.ddlUnitVoltageId),
      Number(ckbVoltageSPPVal),
      strUnitModelValue
    );

    if (!edit) setValue('ddlElecHeaterVoltageId', result?.ddlElecHeaterVoltageId);

    return result;
  }, [
    edit,
    ckbVoltageSPPVal,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlElecHeaterVoltageId,
    values.ddlHeatingCompId,
    values.ddlPreheatCompId,
    values.ddlReheatCompId,
    values.ddlUnitVoltageId,
    strUnitModelValue,
  ]);

  const valveAndActuatorInfo = useMemo(
    () =>
      getValveAndActuatorInfo(
        Number(values.ddlCoolingCompId),
        Number(values.ddlPreheatCompId),
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId)
      ),
    [
      values.ddlCoolingCompId,
      values.ddlHeatingCompId,
      values.ddlPreheatCompId,
      values.ddlReheatCompId,
    ]
  );

  const drainPanInfo = useMemo(
    () => getDrainPanInfo(Number(intProductTypeID), Number(intUnitTypeID)),
    [intProductTypeID, intUnitTypeID]
  );

  const handingInfo = useMemo(() => {
    const result = getHandingInfo(baseData);
    if (!edit) setValue('ddlHandingId', result.ddlHandingId);
    return result;
  }, [edit, baseData, setValue]);

  const supplyAirOpeningInfo = useMemo(() => {
    const result = getSupplyAirOpeningInfo(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      Number(values.ddlLocationId),
      Number(values.ddlOrientationId),
      values.ddlSupplyAirOpeningId,
      values.ddlSupplyAirOpeningText,
      Number(values.ddlCoolingCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId)
    );

    setValue('ddlSupplyAirOpeningId', result?.ddlSupplyAirOpeningId);
    setValue('ddlSupplyAirOpeningText', result?.ddlSupplyAirOpeningText);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edit,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlCoolingCompId,
    values.ddlHeatingCompId,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.ddlReheatCompId,
  ]);

  useEffect(() => {
    if (!values.ddlOrientationId || !values.ddlSupplyAirOpeningText || !intProductTypeID) return;

    const result = getRemainingOpeningsInfo(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      values.ddlSupplyAirOpeningText,
      Number(values.ddlOrientationId)
    );

    if (!edit) setValue('ddlExhaustAirOpeningId', result?.ddlExhaustAirOpeningId);
    if (!edit) setValue('ddlExhaustAirOpeningText', result?.ddlExhaustAirOpeningText);
    if (!edit) setValue('ddlOutdoorAirOpeningId', result?.ddlOutdoorAirOpeningId);
    if (!edit) setValue('ddlOutdoorAirOpeningText', result?.ddlOutdoorAirOpeningText);
    if (!edit) setValue('ddlReturnAirOpeningId', result?.ddlReturnAirOpeningId);
    if (!edit) setValue('ddlReturnAirOpeningText', result?.ddlReturnAirOpeningText);

    setRemainingOpeningsInfo(result);
  }, [
    edit,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlOrientationId,
    values.ddlSupplyAirOpeningText,
  ]);

  // onChange functions
  const handleBlurSummerSupplyAirCFM = useCallback(
    (e: any) => {
      const value = getSummerSupplyAirCFM(
        e.target.value,
        intProductTypeID,
        Number(user?.UAL || 0),
        Number(ckbBypassVal)
      );
      setValue('txbSummerSupplyAirCFM', value);
      setValue('txbSummerReturnAirCFM', value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ckbBypassVal, getAllFormData, setValue, user?.UAL || 0]
  );

  const handleBlurSummerReturnAirCFM = useCallback(
    (e: any) => {
      const value = getSummerReturnAirCFM(
        e.target.value,
        getAllFormData(),
        Number(user?.UAL || 0),
        baseData
      );
      setValue('txbSummerReturnAirCFM', value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseData, getAllFormData, setValue, user?.UAL || 0]
  );

  const handleBlurSupplyAirESP = useCallback(
    (e: any) => {
      const value = getSupplyAirESPInfo(e.target.value, intProductTypeID, values.ddlUnitModelId);
      setValue('txbSupplyAirESP', value);
    },
    [setValue, intProductTypeID, values.ddlUnitModelId]
  );

  const handleBlurExhaustAirESP = useCallback(
    (e: any) => {
      const value = getExhaustAirESP(
        e.target.value,
        intProductTypeID,
        intUnitTypeID,
        values.ddlUnitModelId
      );
      setValue('txbExhaustAirESP', value);
    },
    [setValue, intProductTypeID, intUnitTypeID, values.ddlUnitModelId]
  );

  const isAvailable = useCallback((value: any[]) => !!value && value.length > 0, []);
  if (edit && setFunction) setFunction(handleSubmit(onSubmit));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ marginBottom: '150px' }}>
        {edit ? (
          <Stack direction="row" alignContent="center" justifyContent="center">
            <Typography variant="h3" color="primary.main">
              {getValues('txtTag')}
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignContent="center" justifyContent="center">
            <Typography variant="h3" color="primary.main">
              {txbProductType || ''}/{txbUnitType || ''}
            </Typography>
          </Stack>
        )}
        <Accordion
          expanded={expanded.panel1}
          onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              UNIT DETAILS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={5}>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <RHFTextField size="small" name="txtTag" label="Tag" />
                  <RHFTextField
                    size="small"
                    name="txbQty"
                    label="Quantity"
                    // onChange={(e: any) => {
                    //   setValueWithCheck(e, 'txbQty');
                    // }}
                  />
                  {isAvailable(baseData?.unitType) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitTypeId"
                      label="Unit Type"
                      placeholder=""
                      disabled
                    >
                      {baseData?.unitType.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(locationInfo) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlLocationId"
                      label="Location"
                      placeholder=""
                      onChange={ddlLocationChanged}
                    >
                      {locationInfo?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  <FormControlLabel
                    sx={getInlineDisplay(ckbDownshotVal)}
                    control={
                      <Checkbox
                        name="ckbDownshotVal"
                        checked={ckbDownshotVal}
                        onChange={() => setCkbDownshotVal(!ckbDownshotVal)}
                      />
                    }
                    label="Downshot"
                  />
                  {isAvailable(orientationInfo) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOrientationId"
                      label="Orientation"
                      placeholder=""
                      onChange={ddlOrientationChanged}
                    >
                      {orientationInfo?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(baseData?.controlsPreference) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlControlsPreferenceId"
                      label="Control Preference"
                      placeholder=""
                      onChange={(e: any) => {
                        setValue('ddlControlsPreferenceId', Number(e.target.value));
                      }}
                    >
                      {baseData?.controlsPreference?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>
              </Grid>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <RHFTextField
                    size="small"
                    name="txbSummerSupplyAirCFM"
                    label="Supply Air (CFM)"
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbSummerSupplyAirCFM');
                    }}
                    onBlur={handleBlurSummerSupplyAirCFM}
                  />
                  <RHFTextField
                    size="small"
                    name="txbSummerReturnAirCFM"
                    label="Exhaust Air (CFM)"
                    sx={getDisplay(!isUnitTypeAHU())}
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbSummerReturnAirCFM');
                    }}
                    onBlur={handleBlurSummerReturnAirCFM}
                  />
                  <RHFTextField
                    size="small"
                    name="txbSupplyAirESP"
                    label="Supply Air ESP (inH2O)"
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbSupplyAirESP');
                    }}
                    onBlur={handleBlurSupplyAirESP}
                  />
                  <RHFTextField
                    size="small"
                    name="txbExhaustAirESP"
                    label="Exhaust Air ESP (inH2O)"
                    sx={getDisplay(!isUnitTypeAHU())}
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbExhaustAirESP');
                    }}
                    onBlur={handleBlurExhaustAirESP}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <FormControlLabel
                    sx={getDisplay(
                      intProductTypeID === IDs.intProdTypeVentumLiteID || isUnitTypeAHU()
                    )}
                    control={
                      <Checkbox
                        name="ckbBypassVal"
                        sx={{
                          color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary',
                          size: 'small',
                        }}
                        checked={ckbBypassVal}
                        onChange={() => setCkbBypassVal(!ckbBypassVal)}
                        disabled={!ckbBypassInfo.enabled}
                      />
                    }
                    label={`Bypass for Economizer: ${ckbBypassInfo.text}`}
                  />
                  {isAvailable(unitModel) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitModelId"
                      label="Unit Model"
                      onChange={ddlUnitModelChanged}
                    >
                      {unitModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(unitVoltage) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitVoltageId"
                      label="Unit Voltage"
                      onChange={ddlUnitVoltageChanged}
                    >
                      {unitVoltage?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  <FormControlLabel
                    sx={getDisplay(intProductTypeID === IDs.intProdTypeVentumLiteID)}
                    control={
                      <Checkbox
                        name="ckbVoltageSPPVal"
                        checked={ckbVoltageSPPVal}
                        onChange={() => setCkbVoltageSPPVal(!ckbVoltageSPPVal)}
                      />
                    }
                    label="Single Point Power Connection"
                  />
                  {isAvailable(OAFilterModel) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOA_FilterModelId"
                      label="OA Filter"
                      onChange={(e: any) => setValue('ddlOA_FilterModelId', Number(e.target.value))}
                    >
                      {OAFilterModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(RAFilterModel) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlRA_FilterModelId"
                      label="RA Filter"
                      onChange={(e: any) => setValue('ddlRA_FilterModelId', Number(e.target.value))}
                    >
                      {RAFilterModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel2}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              PRE-HEAT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtPreheatComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCompId"
                    label="Preheat"
                    sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
                    onChange={ddlPreheatCompChanged}
                  >
                    {dtPreheatComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCoilHandingId"
                    label="Preheat Coil Handing"
                    sx={getDisplay(values.ddlPreheatCompId > 0)}
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlPreheatCompId === IDs.intCompElecHeaterID) }}
              >
                {isAvailable(preheatElecHeaterInstallationInfo) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatElecHeaterInstallationId"
                    label="Preheat Elec. Heater Installation"
                    onChange={(e: any) =>
                      setValue('ddlPreheatElecHeaterInstallationId', Number(e.target.value))
                    }
                    placeholder=""
                  >
                    {preheatElecHeaterInstallationInfo?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlPreheatCompId === IDs.intCompHWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Heating Fluid Type"
                  >
                    {baseData?.fluidType?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Heating Fluid %"
                  >
                    {getItemsAddedOnIDDataTable(
                      baseData?.fluidConcentration,
                      'fluid_type_id',
                      Number(values.ddlHeatingFluidTypeId)
                    )?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Heating Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidEntTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Heating Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseCapVisible)}
                  control={
                    <Checkbox
                      name="ckbPreheatHWC_UseCap"
                      checked={ckbFlowRateAndCap.ckbPreheatHWC_UseCap}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbPreheatHWC_UseCap: !ckbFlowRateAndCap.ckbPreheatHWC_UseCap,
                        });
                      }}
                    />
                  }
                  label="Preheat HWC Use Capacity"
                />
                <RHFTextField
                  size="small"
                  name="txbPreheatHWC_Cap"
                  label="Preheat HWC Capacity (MBH)"
                  sx={getDisplay(customInputs.divPreheatHWC_UseCapVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbPreheatHWC_Cap');
                  }}
                />
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  control={
                    <Checkbox
                      name="ckbPreheatHWC_UseFlowRate"
                      checked={!!ckbFlowRateAndCap.ckbPreheatHWC_UseFlowRate}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbPreheatHWC_UseFlowRate: !ckbFlowRateAndCap.ckbPreheatHWC_UseFlowRate,
                        });
                      }}
                    />
                  }
                  label="Preheat HWC Use Flow Rate"
                />
                <RHFTextField
                  size="small"
                  name="txbPreheatHWC_FlowRate"
                  label="Preheat HWC Flow Rate (GPM)"
                  sx={getDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbPreheatHWC_FlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel3}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel3: !expanded.panel3 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              COOLING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtCoolingComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCompId"
                    label="Cooling"
                    onChange={ddlCoolingCompChanged}
                  >
                    {dtCoolingComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointDB"
                  label="Cooling LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    values.ddlCoolingCompId === IDs.intCompCWC_ID ||
                      values.ddlCoolingCompId === IDs.intCompDX_ID
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbSummerCoolingSetpointDB');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointWB"
                  label="Cooling LAT Setpoint WB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(values.ddlCoolingCompId) === IDs.intCompCWC_ID ||
                      Number(values.ddlCoolingCompId) === IDs.intCompDX_ID
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbSummerCoolingSetpointWB');
                  }}
                />
                <FormControlLabel
                  sx={getInlineDisplay(values.ddlCoolingCompId === IDs.intCompDX_ID)}
                  control={
                    <Checkbox
                      name="ckbHeatPumpVal"
                      checked={ckbHeatPumpVal}
                      onChange={ckbHeatPumpChanged}
                    />
                  }
                  label="Heat Pump"
                />
                <FormControlLabel
                  sx={getInlineDisplay(
                    values.ddlCoolingCompId === IDs.intCompCWC_ID ||
                      values.ddlCoolingCompId === IDs.intCompDX_ID
                  )}
                  control={
                    <Checkbox
                      name="ckbDehumidificationVal"
                      checked={ckbDehumidificationVal}
                      onClick={ckbDehumidificationChanged}
                    />
                  }
                  label="Dehumidification"
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCoilHandingId"
                    label="Cooling Coil Handing"
                    sx={getDisplay(Number(values.ddlCoolingCompId) > 1)}
                    onChange={(e: any) =>
                      setValue('ddlCoolingCoilHandingId', Number(e.target.value))
                    }
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  ...getDisplay(dxCoilRefrigDesignCondInfo.divDXCoilRefrigDesignCondVisible),
                  mb: 3,
                }}
              >
                <RHFTextField
                  size="small"
                  name="txbRefrigSuctionTemp"
                  label="Suction Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigSuctionTemp');
                  }}
                />

                <RHFTextField
                  size="small"
                  name="txbRefrigLiquidTemp"
                  label="Liquid Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigLiquidTemp');
                  }}
                />

                <RHFTextField
                  size="small"
                  name="txbRefrigSuperheatTemp"
                  label="Superheat Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigSuperheatTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(Number(values.ddlCoolingCompId) === IDs.intCompCWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingFluidTypeId"
                    label="Cooling Fluid Type"
                  >
                    {baseData?.fluidType?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingFluidConcentrationId"
                    label="Cooling Fluid %"
                  >
                    {getItemsAddedOnIDDataTable(
                      baseData?.fluidConcentration,
                      'fluid_type_id',
                      Number(values.ddlCoolingFluidTypeId)
                    )?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbCoolingFluidEntTemp"
                  label="Cooling Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbCoolingFluidEntTemp');
                  }}
                />

                <RHFTextField
                  size="small"
                  name="txbCoolingFluidLvgTemp"
                  label="Cooling Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbCoolingFluidLvgTemp');
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <FormControlLabel
                  sx={{
                    ...getInlineDisplay(customInputs.divCoolingCWC_UseCapVisible),
                    margin: 0,
                  }}
                  control={
                    <Checkbox
                      name="ckbCoolingCWC_UseCap"
                      checked={!!ckbFlowRateAndCap.ckbCoolingCWC_UseCap}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbCoolingCWC_UseCap: !ckbFlowRateAndCap.ckbCoolingCWC_UseCap,
                        });
                      }}
                    />
                  }
                  label="Cooling CWC Use Capacity"
                />
                <RHFTextField
                  size="small"
                  name="txbCoolingCWC_Cap"
                  label="Cooling CWC Capacity (MBH)"
                  sx={getDisplay(customInputs.divCoolingCWC_UseCapVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbCoolingCWC_Cap');
                  }}
                />
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={
                    <Checkbox
                      name="ckbCoolingCWC_UseFlowRate"
                      checked={!!ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbCoolingCWC_UseFlowRate: !ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate,
                        });
                      }}
                    />
                  }
                  label="Cooling CWC Use Flow Rate"
                />
                <RHFTextField
                  size="small"
                  name="txbCoolingCWC_FlowRate"
                  label="Cooling CWC Flow Rate (GPM)"
                  sx={getDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbCoolingCWC_FlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel4}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel4: !expanded.panel4 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              HEATING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtHeatingComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCompId"
                    label="Heating"
                    sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
                    onChange={ddlHeatingCompChanged}
                  >
                    {dtHeatingComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbWinterHeatingSetpointDB"
                  label="Heating LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(values.ddlHeatingCompId) === IDs.intCompElecHeaterID ||
                      Number(values.ddlHeatingCompId) === IDs.intCompHWC_ID ||
                      ckbHeatPumpVal
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbWinterHeatingSetpointDB');
                  }}
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHandingId"
                    label="Heating Coil Handing"
                    sx={getDisplay(Number(values.ddlHeatingCompId) > 1)}
                    onChange={(e: any) =>
                      setValue('ddlHeatingCoilHandingId', Number(e.target.value))
                    }
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlHeatingCompId === IDs.intCompElecHeaterID) }}
              >
                {isAvailable(
                  heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl
                ) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatElecHeaterInstallationId"
                    label="Heating Elec. Heater Installation"
                    onChange={(e: any) =>
                      setValue('ddlHeatElecHeaterInstallationId', Number(e.target.value))
                    }
                    placeholder=""
                  >
                    {heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlHeatingCompId === IDs.intCompHWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Heating Fluid Type"
                  >
                    {baseData?.fluidType?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidType && baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Heating Fluid %"
                  >
                    {getItemsAddedOnIDDataTable(
                      baseData?.fluidConcentration,
                      'fluid_type_id',
                      Number(values.ddlHeatingFluidTypeId)
                    )?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Heating Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidEntTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Heating Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  ...getDisplay(
                    values.ddlHeatingCompId === IDs.intCompHWC_ID && ualInfo.divCustomVisible
                  ),
                }}
              >
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={
                    <Checkbox
                      name="ckbHeatingHWC_UseCap"
                      checked={!!ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbCoolingCWC_UseFlowRate: !ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate,
                        });
                      }}
                    />
                  }
                  label="Heating HWC Use Capacity"
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingHWC_Cap"
                  label="Heating HWC Capacity (MBH)"
                  sx={getDisplay(customInputs.divHeatingHWC_UseCapVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingHWC_Cap');
                  }}
                />
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={
                    <Checkbox
                      name="ckbHeatingHWC_UseFlowRate"
                      checked={!!ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbCoolingCWC_UseFlowRate: !ckbFlowRateAndCap.ckbCoolingCWC_UseFlowRate,
                        });
                      }}
                    />
                  }
                  label="Heating HWC Use Flow Rate"
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingHWC_FlowRate"
                  label="Heating HWC Flow Rate (GPM)"
                  sx={getDisplay(customInputs.divHeatingHWC_UseFlowRateVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingHWC_FlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={getDisplay(ckbDehumidificationVal)}
          expanded={expanded.panel5}
          onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              REHEAT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtReheatComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReheatCompId"
                    label="Reheat"
                    placeholder=""
                    sx={getDisplay(ckbDehumidificationVal)}
                    onChange={ddlReheatCompChanged}
                  >
                    {dtReheatComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbSummerReheatSetpointDB"
                  label="Dehum. Reheat Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    values.ddlReheatCompId === IDs.intCompElecHeaterID ||
                      values.ddlReheatCompId === IDs.intCompHWC_ID ||
                      values.ddlReheatCompId === IDs.intCompHGRH_ID
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbSummerReheatSetpointDB');
                  }}
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHandingId"
                    label="Reheat Coil Handing"
                    sx={getDisplay(Number(values.ddlReheatCompId) > 1)}
                    onChange={(e: any) =>
                      setValue('ddlHeatingCoilHandingId', Number(e.target.value))
                    }
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompElecHeaterID) }}
              >
                {isAvailable(
                  heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl
                ) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatElecHeaterInstallationId"
                    label="Reheat Elec. Heater Installation"
                    onChange={(e: any) =>
                      setValue('ddlHeatElecHeaterInstallationId', Number(e.target.value))
                    }
                    placeholder=""
                  >
                    {heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompHWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Reheat Fluid Type"
                  >
                    {baseData?.fluidType?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidType && baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Reheat Fluid %"
                  >
                    {getItemsAddedOnIDDataTable(
                      baseData?.fluidConcentration,
                      'fluid_type_id',
                      Number(values.ddlHeatingFluidTypeId)
                    )?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Reheat Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidEntTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Reheat Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbHeatingFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  ...getDisplay(
                    values.ddlReheatCompId === IDs.intCompHWC_ID && ualInfo.divCustomVisible
                  ),
                }}
              >
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  control={
                    <Checkbox
                      name="ckbReheatHWC_UseCap"
                      checked={ckbFlowRateAndCap.ckbReheatHWC_UseCap}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbReheatHWC_UseCap: !ckbFlowRateAndCap.ckbReheatHWC_UseCap,
                        });
                      }}
                    />
                  }
                  label="Reheat HWC Use Capacity"
                />
                <RHFTextField
                  size="small"
                  name="txbReheatHWC_Cap"
                  label="Reheat HWC Capacity (MBH)"
                  sx={getDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbReheatHWC_Cap');
                  }}
                />
                <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  control={
                    <Checkbox
                      name="ckbReheatHWC_UseFlowRate"
                      checked={ckbFlowRateAndCap.ckbReheatHWC_UseFlowRate}
                      onChange={() => {
                        setCkbFlowRateAndCap({
                          ...ckbFlowRateAndCap,
                          ckbReheatHWC_UseFlowRate: !ckbFlowRateAndCap.ckbReheatHWC_UseFlowRate,
                        });
                      }}
                    />
                  }
                  label="Reheat HWC Use Flow Rate"
                />
                <RHFTextField
                  size="small"
                  name="txbReheatHWC_FlowRate"
                  label="Reheat HWC Flow Rate (GPM)"
                  sx={getDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbReheatHWC_FlowRate');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompHGRH_ID) }}
              >
                <RHFTextField
                  size="small"
                  name="txbRefrigCondensingTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigCondensingTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbRefrigVaporTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigVaporTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbRefrigSubcoolingTemp"
                  label="Subcooling Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbRefrigSubcoolingTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbPercentCondensingLoad"
                  label="% Condensing Load"
                  onChange={(e: any) => {
                    setValueWithCheck(e, 'txbPercentCondensingLoad');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel6}
          onChange={() => setExpanded({ ...expanded, panel6: !expanded.panel6 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              ACCESSORIES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(damperAndActuatorInfo.ddlDamperAndActuatorDataTbl) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlDamperAndActuatorId"
                    label="Dampers & Actuator"
                    sx={getDisplay(!!damperAndActuatorInfo.divDamperAndActuatorVisible)}
                    onChange={(e: any) => {
                      setValue('ddlDamperAndActuatorId', Number(e.target.value));
                    }}
                    placeholder=""
                  >
                    {damperAndActuatorInfo.ddlDamperAndActuatorDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
                {isAvailable(elecHeaterVoltageInfo.ddlElecHeaterVoltageDataTbl) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlElecHeaterVoltageId"
                    label="Elec. Heater Voltage"
                    placeholder=""
                    sx={getDisplay(elecHeaterVoltageInfo.divElecHeaterVoltageVisible)}
                    onChange={ddlElecHeaterVoltageChanged}
                  >
                    {elecHeaterVoltageInfo.ddlElecHeaterVoltageDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
                <FormControlLabel
                  sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  control={
                    <Checkbox
                      name="ckbValveAndActuatorVal"
                      defaultChecked={ckbValveAndActuatorVal}
                      onChange={() => setCkbValveAndActuatorVal(!ckbValveAndActuatorVal)}
                    />
                  }
                  label="Include Valves & Actuator"
                />
                <FormControlLabel
                  sx={getInlineDisplay(drainPanInfo.divDrainPanVisible)}
                  control={
                    <Checkbox
                      name="ckbDrainPanVal"
                      checked={ckbDrainPanVal}
                      onChange={() => setCkbDrainPanVal(!ckbDrainPanVal)}
                    />
                  }
                  label="Drain Pan Required"
                />
              </Stack>
              <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlValveTypeId"
                  sx={getDisplay(
                    values.ddlPreheatCompId === IDs.intCompHWC_ID ||
                      values.ddlCoolingCompId === IDs.intCompHWC_ID ||
                      values.ddlHeatingCompId === IDs.intCompHWC_ID ||
                      values.ddlReheatCompId === IDs.intCompHWC_ID
                  )}
                  label="Valve Type"
                >
                  {baseData?.valveType
                    ?.filter((item: any) => item.items !== '""')
                    ?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                </RHFSelect>
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel7}
          onChange={() => setExpanded({ ...expanded, panel7: !expanded.panel7 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              LAYOUT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={5}>
              <Grid item xs={4} md={4}>
                <Stack spacing={3}>
                  {isAvailable(handingInfo.ddlHandingDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHandingId"
                      label="Handing"
                      placeholder=""
                      value={getValues('ddlHandingId')}
                      onChange={ddlHandingChanged}
                    >
                      {handingInfo.ddlHandingDataTbl.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(supplyAirOpeningInfo.ddlSupplyAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlSupplyAirOpeningId"
                      label="Supply Air Opening"
                      placeholder=""
                      onChange={ddlSupplyAirOpeningChanged}
                    >
                      {supplyAirOpeningInfo.ddlSupplyAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlExhaustAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlExhaustAirOpeningId"
                      label="Exhaust Air Opening"
                      sx={getDisplay(!!remainingOpeningsInfo.ddlExhaustAirOpeningVisible)}
                      placeholder=""
                      onChange={ddlExhaustAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlExhaustAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlOutdoorAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOutdoorAirOpeningId"
                      label="Outdoor Air Opening"
                      placeholder=""
                      onChange={ddlOutdoorAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlOutdoorAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlReturnAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReturnAirOpeningId"
                      label="Return Air Opening"
                      sx={getDisplay(remainingOpeningsInfo.ddlReturnAirOpeningVisible)}
                      placeholder=""
                      onChange={ddlReturnAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlReturnAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                </Stack>{' '}
              </Grid>
              {/* <Grid item xs={8} md={8}>
                  <RHFUpload
                    name="layoutImage"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </Grid> */}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel8}
          onChange={() => setExpanded({ ...expanded, panel8: !expanded.panel8 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              CONFIGURATION NOTES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <TextField label="Take a note..." variant="standard" fullWidth />
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Stack direction="row" justifyContent="flex-end">
          <Box sx={{ width: '150px' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={() => console.log(getValues())}
              loading={isSubmitting}
              disabled={isSavedUnit && !edit}
            >
              {edit ? 'Update Unit' : 'Add New Unit'}
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

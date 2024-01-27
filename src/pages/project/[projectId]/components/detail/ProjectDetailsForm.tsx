import * as Yup from 'yup';
import React, { useState, useEffect, useMemo, useCallback, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';

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
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { EventType, useForm } from 'react-hook-form';
import { useGetOutdoorInfo } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import { useRouter } from 'next/router';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

//------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
  },
}));
//------------------------------------------------

type ProjectDetailsFormProps = {
  project: any;
  projectInitInfo: {
    baseOfDesign: any;
    UoM: any;
    applications: any;
    designCondition: any;
    companyInfo: any;
    weatherData: any;
    usersInfo: any;
    country: any;
  };
  onSuccess?: Function;
  onFail?: Function;
};

export default function ProjectDetailsForm({
  project,
  projectInitInfo,
  onSuccess,
  onFail,
}: ProjectDetailsFormProps) {
  const api = useApiContext();
  const { projectId } = useRouter().query;

  const [mounted, setMounted] = useState<boolean>(false);
  const [expanded, setExpanded] = useState({ panel1: true, panel2: true });

  const [openFail, setOpenFail] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleCloseSuccess = (
    event: Event | SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseFail = (
    event: Event | SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFail(false);
  };

  const {
    baseOfDesign,
    UoM,
    applications,
    designCondition,
    companyInfo,
    weatherData,
    usersInfo,
    country,
  } = projectInitInfo;

  const projectInfoSchema = Yup.object().shape({
    jobName: Yup.string().required('Please enter a Project Name'),
    basisOfDesign: Yup.string().required('Please enter a Basis Of Design'),
    referenceNo: Yup.string().required('Please select a Reference'),
    revision: Yup.string().required('Please enter a Revision'),
    createdDate: Yup.string().required('Please enter a Created Date'),
    revisedDate: Yup.string().required('Please enter a Revised Date'),
    companyName: Yup.string(),
    companyNameId: Yup.string().required('Please enter a Company Name'),
    contactName: Yup.string(),
    contactNameId: Yup.number(),
    application: Yup.string().required('Please enter a Application'),
    uom: Yup.string().required('Please select a UoM'),
    country: Yup.string().required('Please select a County'),
    state: Yup.string().required('Please select a Province / State'),
    city: Yup.string().required('Please select a City'),
    ashareDesignConditions: Yup.string().required('Please enter an ASHARE Design Conditions'),
    altitude: Yup.string(),
    summer_air_db: Yup.string(),
    summer_air_wb: Yup.string(),
    summer_air_rh: Yup.string(),
    winter_air_db: Yup.string(),
    winter_air_wb: Yup.string(),
    winter_air_rh: Yup.string(),
    summer_return_db: Yup.string(),
    summer_return_wb: Yup.string(),
    summer_return_rh: Yup.string(),
    winter_return_db: Yup.string(),
    winter_return_wb: Yup.string(),
    winter_return_rh: Yup.string(),
    testNewPrice: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      jobName: project?.jobName,
      basisOfDesign: project?.basisOfDesignId,
      referenceNo: project?.referenceNo,
      revision: project?.revisionNo,
      createdDate: project?.createdDate,
      revisedDate: project?.revisedDate,
      companyName: project?.companyName,
      companyNameId: Number(project?.companyNameId || 0),
      contactName: project?.contactName,
      contactNameId: Number(project?.contactNameId || 0),
      application: project?.applicationId,
      uom: project?.UOMId,
      country: project?.country,
      state: project?.provState,
      city: project?.cityId,
      ashareDesignConditions: project?.designConditionId,
      altitude: project?.altitude,
      summer_air_db: project?.summerOutdoorAirDB,
      summer_air_wb: project?.summerOutdoorAirRH,
      summer_air_rh: project?.summerOutdoorAirWB,
      winter_air_db: project?.winterOutdoorAirDB,
      winter_air_wb: project?.winterOutdoorAirRH,
      winter_air_rh: project?.winterOutdoorAirWB,
      summer_return_db: project?.summerReturnAirDB,
      summer_return_wb: project?.summerReturnAirRH,
      summer_return_rh: project?.summerReturnAirWB,
      winter_return_db: project?.winterReturnAirDB,
      winter_return_wb: project?.winterReturnAirRH,
      winter_return_rh: project?.winterReturnAirWB,
      testNewPrice: project?.isTestNewPrice,
    }),
    [project]
  );

  const methods = useForm({
    resolver: yupResolver(projectInfoSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const formState = watch();

  const { data: outdoorInfo } = useGetOutdoorInfo(
    {
      action: 'GET_ALL_DATA',
      country: formState?.country,
      cityId: formState?.city,
      designCondition: formState?.ashareDesignConditions,
    },
    {
      enabled: mounted,
    }
  );

  useEffect(() => {
    if (mounted) {
      setValue('altitude', outdoorInfo.altitude as never);
      setValue('summer_air_db', outdoorInfo.summerOutdoorAirDB as never);
      setValue('summer_air_wb', outdoorInfo.summerOutdoorAirWB as never);
      setValue('summer_air_rh', outdoorInfo.summerOutdoorAirRH as never);
      setValue('winter_air_db', outdoorInfo.winterOutdoorAirDB as never);
      setValue('winter_air_wb', outdoorInfo.winterOutdoorAirWB as never);
      setValue('winter_air_rh', outdoorInfo.winterOutdoorAirRH as never);
    } else {
      setMounted(true);
    }
  }, [outdoorInfo, setValue]);

  const get_RH_By_DBWB = (first: string, second: string, setValueId: any) => {
    if (first === '' || second === '') return;
    api.project
      .getOutdoorInfo({
        action: 'GET_RH_BY_DB_WB',
        first,
        second,
        altitude: formState.altitude,
      })
      .then((data: any) => {
        setValue(setValueId, data as never);
      });
  };

  // get WB value from server
  const get_WB_By_DBRH = useCallback(
    (first: string, second: string, setValueId: any) => {
      if (first === '' || second === '') return;
      api.project
        .getOutdoorInfo({
          action: 'GET_WB_BY_DB_HR',
          first,
          second,
          altitude: formState.altitude,
        })
        .then((data: any) => {
          setValue(setValueId, data as never);
        });
    },
    [setValue, formState.altitude]
  );

  const handleChangeSummerOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('summer_air_db', e.target.value as never);
      get_RH_By_DBWB(formState.summer_air_db, formState.summer_air_wb, 'summer_air_rh');
    },
    [get_RH_By_DBWB, setValue, formState.summer_air_db, formState.summer_air_wb]
  );

  // Summer Outdoor Air WB
  const handleChangeSummerOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('summer_air_wb', e.target.value as never);
      get_RH_By_DBWB(formState.summer_air_db, formState.summer_air_wb, 'summer_air_rh');
    },
    [get_RH_By_DBWB, formState.summer_air_db, formState.summer_air_wb, setValue]
  );

  // Summer Outdoor Air RH
  const handleChangeSummerOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('summer_air_rh', e.target.value as never);
      get_WB_By_DBRH(formState.summer_air_db, formState.summer_air_rh, 'summer_air_wb');
    },
    [get_WB_By_DBRH, setValue, formState.summer_air_db, formState.summer_air_rh]
  );

  // Winter Outdoor Air DB
  const handleChangeWinterOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('winter_air_db', e.target.value as never);
      get_RH_By_DBWB(formState.winter_air_db, formState.winter_air_wb, 'winter_air_rh');
    },
    [get_RH_By_DBWB, setValue, formState.winter_air_db, formState.winter_air_wb]
  );

  // Winter Outdoor Air WB
  const handleChangeWinterOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('winter_air_wb', e.target.value as never);
      get_RH_By_DBWB(formState.winter_air_db, formState.winter_air_wb, 'winter_air_rh');
    },
    [get_RH_By_DBWB, setValue, formState.winter_air_db, formState.winter_air_wb]
  );

  // Winter Outdoor Air RH
  const handleChangeWinterOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('winter_air_rh', e.target.value as never);
      get_WB_By_DBRH(formState.winter_air_db, formState.winter_air_rh, 'winter_air_wb');
    },
    [get_WB_By_DBRH, setValue, formState.winter_air_db, formState.winter_air_rh]
  );

  // Summer Return Air DB
  const handleChangeSummerReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('summer_return_db', e.target.value as never);
      get_RH_By_DBWB(formState.summer_return_db, formState.summer_return_wb, 'summer_return_rh');
    },
    [get_RH_By_DBWB, setValue, formState.summer_return_db, formState.summer_return_wb]
  );

  // Summer Return Air WB
  const handleChangeSummerReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('summer_return_wb', e.target.value as never);
      get_RH_By_DBWB(formState.summer_return_db, formState.summer_return_wb, 'summer_return_rh');
    },
    [get_RH_By_DBWB, setValue, formState.summer_return_db, formState.summer_return_wb]
  );

  // Summer Return Air RH
  const handleChangeSummerReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('summer_return_rh', e.target.value as never);
      get_WB_By_DBRH(formState.summer_return_db, formState.summer_return_rh, 'summer_return_wb');
    },
    [get_WB_By_DBRH, setValue, formState.summer_return_db, formState.summer_return_rh]
  );

  // Winter Return Air DB
  const handleChangeWinterReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('winter_return_db', e.target.value as never);
      get_RH_By_DBWB(formState.winter_return_db, formState.winter_return_wb, 'winter_return_rh');
    },
    [get_RH_By_DBWB, setValue, formState.winter_return_db, formState.winter_return_wb]
  );

  // Winter Return Air WB
  const handleChangeWinterReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('winter_return_wb', e.target.value as never);
      get_RH_By_DBWB(formState.winter_return_db, formState.winter_return_wb, 'winter_return_rh');
    },
    [get_RH_By_DBWB, setValue, formState.winter_return_db, formState.winter_return_wb]
  );

  // Winter Return Air RH
  const handleChangeWinterReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('winter_return_rh', e.target.value as never);
      get_WB_By_DBRH(formState.winter_return_db, formState.winter_return_rh, 'winter_return_wb');
    },
    [get_WB_By_DBRH, setValue, formState.winter_return_db, formState.winter_return_rh]
  );

  const provStateInfo = useMemo(() => {
    const data: string[] | undefined = weatherData
      ?.filter(
        (item: any) => item.country === (formState.country === 'CA' ? 'CAN' : formState.country)
      )
      .map((item: any) => item.prov_state);

    if (data) {
      const uniqueArray = [...new Set<string>(data)];
      setValue('state', (uniqueArray?.[0] || '') as never);
      return uniqueArray;
    }

    return [];
  }, [weatherData, formState.country, setValue]);

  const cityInfo = useMemo(() => {
    const data = weatherData?.filter(
      (item: any) =>
        item.country === (formState.country === 'CA' ? 'CAN' : formState.country) &&
        item.prov_state === formState.state
    );
    setValue('city', (data?.[0]?.id || '') as never);
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData, setValue, provStateInfo, formState.state]);

  // onChange handle for company Name
  const handleChangeCompanyName = useCallback(
    (e: any) => {
      setValue('companyNameId', e.target.value);
      setValue('companyName', e.nativeEvent.target[e.target.selectedIndex].text);
    },
    [setValue]
  );

  // onChange handle for contactName
  const handleChangeContactName = useCallback(
    (e: any) => {
      setValue('contactNameId', e.target.value);
      setValue('contactName', e.nativeEvent.target[e.target.selectedIndex].text);
    },
    [setValue]
  );

  // onChange handle for country
  const handleChangeCountry = useCallback(
    (e: any) => {
      setValue('country', e.target.value);
    },
    [setValue]
  );

  // onChange handle for State
  const handleChangeProvState = useCallback(
    (e: any) => {
      setValue('state', e.target.value);
    },
    [setValue]
  );

  // onChange handle for city
  const handleChangeCity = useCallback(
    (e: any) => {
      setValue('city', e.target.value);
    },
    [setValue]
  );

  //  onChange handle for design condition
  const handleChangeDesignCondition = useCallback(
    (e: any) => {
      setValue('ashareDesignConditions', e.target.value);
    },
    [setValue]
  );

  // handle submit
  const onProjectInfoSubmit = useCallback(
    async (data: any) => {
      try {
        const formData = {
          ...data,
          jobId: projectId,
          createdUserId: project?.created_user_id,
          revisedUserId: localStorage.getItem('userId'),
          applicationOther: '',
        };

        api.project.updateProject(formData);
        onSuccess && onSuccess();
      } catch (e) {
        console.log(e);
        onFail && onFail();
      }
    },
    [projectId, project?.created_user_id]
  );

  return (
    <>
      <RootStyle>
        <Container>
          <FormProvider methods={methods} onSubmit={handleSubmit(onProjectInfoSubmit)}>
            <Stack spacing={2}>
              <Accordion
                expanded={expanded.panel1}
                onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="il:arrow-down" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>PROJECT INFO & LOCATION</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={5}>
                    <Grid item xs={4} md={4}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                        <RHFTextField size="small" name="jobName" label="Project Name" />
                        <RHFSelect
                          native
                          size="small"
                          name="application"
                          label="Applicaton"
                          placeholder=""
                        >
                          {applications?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.items}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="basisOfDesign"
                          label="Basis of Design"
                          placeholder=""
                        >
                          {baseOfDesign?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.items}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="companyNameId"
                          label="Company Name"
                          placeholder=""
                          onChange={handleChangeCompanyName}
                        >
                          <option value="" />
                          {companyInfo?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.name}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="contactNameId"
                          label="Contact Name"
                          placeholder=""
                          onChange={handleChangeContactName}
                        >
                          <option value="" />
                          {usersInfo?.map(
                            (info: any, index: number) =>
                              info.id.toString() !== localStorage.getItem('userId') &&
                              info.customer_id.toString() ===
                                getValues('companyNameId').toString() && (
                                <option key={index} value={info.id}>
                                  {`${info.first_name} ${info.last_name}`}
                                </option>
                              )
                          )}
                        </RHFSelect>
                      </Box>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                        <RHFSelect native size="small" name="uom" label="UoM" placeholder="">
                          <option value="" />
                          {UoM?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.items}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFTextField size="small" name="referenceNo" label="Reference no" />
                        <RHFTextField size="small" name="revision" label="Revision no" />
                        <RHFTextField size="small" name="createdDate" label="Date Created" />
                        <RHFTextField size="small" name="revisedDate" label="Date Revised" />
                      </Box>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                        <RHFSelect
                          native
                          size="small"
                          name="country"
                          label="Country"
                          placeholder=""
                          onChange={handleChangeCountry}
                        >
                          <option value="" />
                          {country?.map((info: any, index: number) => (
                            <option key={index} value={info.value}>
                              {info.items}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="state"
                          label="Province / State"
                          placeholder=""
                          onChange={handleChangeProvState}
                        >
                          <option value="" />
                          {provStateInfo?.map((info: any, index: number) => (
                            <option key={index} value={info}>
                              {info}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="city"
                          label="City"
                          placeholder=""
                          onChange={handleChangeCity}
                        >
                          <option value="" />
                          {cityInfo?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.station}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          native
                          size="small"
                          name="ashareDesignConditions"
                          label="ASHRAE Design Conditions"
                          placeholder=""
                          onChange={handleChangeDesignCondition}
                        >
                          {designCondition?.map((info: any, index: number) => (
                            <option key={index} value={info.id}>
                              {info.items}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFTextField size="small" name="altitude" label="Altitude" />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded.panel2}
                onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="il:arrow-down" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>DESIGN CONDITIONS</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={5}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                        <RHFTextField
                          size="small"
                          name="summer_air_db"
                          label="Summer Outdoor Air DB (F)"
                          onBlur={handleChangeSummerOutdoorAirDBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="summer_air_wb"
                          label="Summer Outdoor Air WB (F)"
                          onBlur={handleChangeSummerOutdoorAirWBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="summer_air_rh"
                          label="Summer Outdoor Air RH (%)"
                          onBlur={handleChangeSummerOutdoorAirRHChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_air_db"
                          label="Winter Outdoor Air DB"
                          onBlur={handleChangeWinterOutdoorAirDBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_air_wb"
                          label="Winter Outdoor Air WB"
                          onBlur={handleChangeWinterOutdoorAirWBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_air_rh"
                          label="Winter Outdoor Air RH"
                          onBlur={handleChangeWinterOutdoorAirRHChanged}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                        <RHFTextField
                          size="small"
                          name="summer_return_db"
                          label="Summer Return Air DB (F)"
                          onBlur={handleChangeSummerReturnAirDBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="summer_return_wb"
                          label="Summer Return Air WB (F)"
                          onBlur={handleChangeSummerReturnAirWBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="summer_return_rh"
                          label="Summer Return Air RH (%)"
                          onBlur={handleChangeSummerReturnAirRHChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_return_db"
                          label="Winter Return Air DB"
                          onBlur={handleChangeWinterReturnAirDBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_return_wb"
                          label="Winter Return Air WB"
                          onBlur={handleChangeWinterReturnAirWBChanged}
                        />
                        <RHFTextField
                          size="small"
                          name="winter_return_rh"
                          label="Winter Return Air RH"
                          onBlur={handleChangeWinterReturnAirRHChanged}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Stack sx={{ mb: '20px!important' }} direction="row" justifyContent="flex-end">
                <Box sx={{ width: '150px' }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    onClick={() => console.log(getValues())}
                    loading={isSubmitting}
                    sx={{ width: '150px' }}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Stack>
            </Stack>
          </FormProvider>
        </Container>
        <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            New project update success!
          </Alert>
        </Snackbar>
        <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseFail}>
          <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
            Server Error!
          </Alert>
        </Snackbar>
      </RootStyle>
    </>
  );
}

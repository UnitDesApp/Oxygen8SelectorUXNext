import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Divider, Stack, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useApiContext } from 'src/contexts/ApiContext';
import { useAuthContext } from 'src/auth/useAuthContext';
import GroupBox from 'src/components/GroupBox';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import ChangePasswordForm from './ChangePasswordForm';
// ----------------------------------------------------------------------

interface AccountFormProps {
  accountInfo: any;
}

export default function AccountForm({ accountInfo }: AccountFormProps) {
  const { user, updateUser } = useAuthContext();
  const { dbtSelCustomerType, dbtSelFOBPoint, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {};
  const api = useApiContext();
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);

  const UpdateUserSchema = Yup.object().shape({
    firstname: Yup.string().required('This field is required!'),
    lastname: Yup.string().required('This field is required!'),
    email: Yup.string().required('This field is required!'),
    username: Yup.string().required('This field is required!'),
    customerType: Yup.string().required('This field is required!'),
    customerId: Yup.string().required('This field is required!'),
    ddlCountry: Yup.string(),
    ddlProvState: Yup.string(),
    access: Yup.string().required('This field is required!'),
    accessLevel: Yup.string().required('This field is required!'),
    accessPricing: Yup.string().required('This field is required!'),
    fobPoint: Yup.string().required('This field is required!'),
    createdDate: Yup.string().required('This field is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      username: user?.username,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      customerType: dbtSelCustomerType?.[0]?.id,
      customerId: dbtSavCustomer?.[0]?.id,
      access: user?.access,
      accessLevel: 10,
      accessPricing: user?.accessPricing,
      fobPoint: dbtSelFOBPoint?.[0]?.id,
      createdDate: user?.createdDate,
      ddlCountry: 'CAN',
      ddlProvState: 'AB',
    }),
    [
      dbtSavCustomer,
      dbtSelCustomerType,
      dbtSelFOBPoint,
      user?.access,
      user?.accessPricing,
      user?.createdDate,
      user?.email,
      user?.firstname,
      user?.lastname,
      user?.username,
    ]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await api.account.updateProfile({ ...data, userId: user?.userId });
        updateUser(data);
        setSuccess(true);
      } catch (e) {
        console.log(e);
        setFail(true);
      }
    },
    [user?.userId, api.account, updateUser]
  );


  const [countryInfo, setCountryInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtCountry: any; isVisible: boolean; defaultId: string } = {
      fdtCountry: [],
      isVisible: false,
      defaultId: '',
    };

    info.fdtCountry = accountInfo?.dbtSelCountry;

    setCountryInfo(info);
    info.defaultId = info.fdtCountry?.[0]?.value;

    setValue('ddlCountry', info.defaultId);

  }, [accountInfo, setValue]);


  const [provStateInfo, setProvStateInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtProvState: any; isVisible: boolean; defaultId: string } = {
      fdtProvState: [],
      isVisible: false,
      defaultId: '',
    };
    // let controlsPrefProdTypeLink: any = [];
    info.fdtProvState = accountInfo?.dbtSelProvState
    info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === getValues('ddlCountry'));


    setProvStateInfo(info);

    info.defaultId = info.fdtProvState?.[0]?.value;
    setValue('ddlProvState', info.defaultId);

  }, [accountInfo, setValue, getValues]);


  const ddlCountryChanged = useCallback((e: any) => 
    setValue('ddlCountry', e.target.value),
  [setValue]
  );






  // const ddlProvStateChanged = useCallback((e: any) => 
  //   setValue('ddlProvState', e.target.value),
  // [setValue]
  // );

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={7} md={7}>
        <GroupBox title="Profile">
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} p={2}>
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFTextField size="small" name="firstname" label="First Name" />
                <RHFTextField size="small" name="lastname" label="Last Name" />
              </Stack>
              <RHFTextField size="small" name="email" label="Email" />
              <RHFTextField size="small" name="company_name" label="Company Name" />
              <RHFTextField size="small" name="job_name" label="Job Title" />
              <RHFTextField size="small" name="phone_number" label="Phone Number" />
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="address1" label="Address1" />
                <RHFTextField size="small" name="address2" label="Address2" />
              </Stack>
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="city" label="City" />
                {/* <RHFTextField size="small" name="state/Province" label="Status" /> */}
                <RHFSelect
                      native
                      size="small"
                      name="ddlCountry"
                      label="Country"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      // onChange={ddlCountryChanged}
                      onChange={(e: any) => setValue('ddlCountry', e.target.value)}
                      >
                      {countryInfo?.fdtCountry?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                {/* <RHFTextField size="small" name="country" label="Country" /> */}
                <RHFSelect
                      native
                      size="small"
                      name="ddlProvState"
                      label="Cooling"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      // onChange={ddlProvStateChanged}
                    >
                      {provStateInfo?.fdtProvState?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                </RHFSelect>
              </Stack>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </GroupBox>
      </Grid>
      <Grid item xs={5} md={5}>
        <ChangePasswordForm />
      </Grid>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Account information have been updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={fail}
        autoHideDuration={6000}
        onClose={() => {
          setFail(false);
        }}
      >
        <Alert
          onClose={() => {
            setFail(false);
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          Server Error!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

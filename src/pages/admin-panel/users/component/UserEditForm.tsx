// yup
import * as Yup from 'yup';
// mui
import { Stack, Grid, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useApiContext } from 'src/contexts/ApiContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import GroupBox from 'src/components/GroupBox';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Ids from 'src/utils/ids';

// ------------------------------------------------------------------------

interface UserEditFormProps {
  dbtSavUser: any[];
  dbtSelCustomerType: any[];
  dbtSelFOB_Point: any[];
  dbtSavCustomer: any[];
  dbtSelCountry: any[];
  dbtSelProvState: any[];
  setSuccessText?: Function;
  setFailDlgOpen?: Function;
  setSuccessDlgOpen?: Function;
}

export default function UserEditForm({
  dbtSavUser,
  dbtSelCustomerType,
  dbtSelFOB_Point,
  dbtSavCustomer,
  dbtSelCountry,
  dbtSelProvState,
  setSuccessText,
  setFailDlgOpen,
  setSuccessDlgOpen,
}: UserEditFormProps) {
  const { userId } = useRouter().query;
  const api = useApiContext();


  const UserSchema = Yup.object().shape({
    firstname: Yup.string().required('This field is required!'),
    lastname: Yup.string().required('This field is required!'),
    email: Yup.string().required('This field is required!'),
    username: Yup.string().required('This field is required!'),
    ddlCustomerType: Yup.string().required('This field is required!'),
    ddlCustomer: Yup.string().required('This field is required!'),
    txbPhoneNumber: Yup.string(),
    txbAddress1: Yup.string(),
    txbAddress2: Yup.string(),
    txbCity: Yup.string(),
    ddlCountry: Yup.string(),
    ddlProvState: Yup.string(),
    ddlAccess: Yup.string().required('This field is required!'),
    ddlAccessLevel: Yup.string().required('This field is required!'),
    ddlAccessPricing: Yup.string().required('This field is required!'),
    // fobPoint: Yup.string().required('This field is required!'),
    createdDate: Yup.string().required('This field is required!'),
    password: Yup.string().required('This field is required!'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const  selectedUser = dbtSavUser?.filter((user: any) => user.id === Number(userId))?.[0] || {};

  const defaultValues = {
    txbFirstName: selectedUser?.first_name,
    txbLastName: selectedUser?.last_name,
    txbEmail: selectedUser?.email,
    txbUsername: selectedUser?.username,
    txbPassword: '',
    txbConfirmPassword: '',
    ddlCustomerType: selectedUser?.customer_type,
    ddlCustomer: selectedUser?.customer_id,
    txbPhoneNumber: '',
    txbAddress1: '',
    txbAddress2: '',
    ddlCountry: '',
    ddlProvState: '',
    ddlAccess: selectedUser?.access,
    ddlAccessLevel: selectedUser?.access_level,
    ddlAccessPricing: selectedUser?.access_pricing,
    // fobPoint: dbtSelFOB_Point?.[0]?.id,
    txbFOB_Point: '',
    txbCreatedDate: selectedUser?.created_date,
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {       
       data = {
        intUserId: selectedUser?.id,
        strFirstName: getValues("txbFirstName"),
        strLastName: getValues("txbLastName"),
        strEmail: getValues("txbEmail"),
        strUsername: getValues("txbUsername"),
        intCustomerTypeId: getValues("ddlCustomerType"),
        intCustomerId: getValues("ddlCustomer"),
        intAccessId: getValues("ddlAccess"),
        intAccessLevelId: getValues("ddlAccessLevel"),
        intAccessPricingId: getValues("ddlAccessPricing"),
        strCreateDate : getValues("txbCreatedDate"),
      }
      // await api.account.updateUser({ ...data, userId });
      
      if (setSuccessText) {
        setSuccessText('Successfully updated!');
      }
      if (setSuccessDlgOpen) {
        setSuccessDlgOpen(true);
      }
    } catch (error) {
      if (setFailDlgOpen) {
        setFailDlgOpen(true);
      }
      console.error(error);
    }
  };


  // useMemo(() => {
  //   const info: { isDisabled: boolean } = { isDisabled: true };

  //   const selFOB_Point = dbtSelFOB_Point?.filter((e: {id: Number}) => e.id === Number(selectedUser.fob_point_id))?.[0] || {};
  

  //   return info;
  // }, [dbtSavUser, dbtSelFOB_Point, userId]);



  // const [txbFOB_PointSelItem, setTxbFOB_PointSelItem] = useState([]);
  useMemo(() => {

    const fdtFOB_Point = dbtSelFOB_Point?.filter((e: {id: Number}) => e.id === Number(selectedUser.fob_point_id));
    // setTxbFOB_PointSelItem(fdtFOB_Point?.[0]?.items);
    setValue('txbFOB_Point', fdtFOB_Point?.[0]?.items);

  }, [dbtSelFOB_Point, selectedUser.fob_point_id, setValue]);



  const [ddlCustomerTypeTable, setDdlCustomerTypeTable] = useState([]);
  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useEffect(() => {

    // const fdtCustomerType = dbtSelCustomerType?.filter((e: {id: Number}) => e.id === Number(selectedUser.customer_type_id))?.[0] || {};
    const fdtCustomerType : any = dbtSelCustomerType?.filter((e: {id: Number}) => 
      Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));

    setDdlCustomerTypeTable(fdtCustomerType);
    // setDdlCustomerTypeSelId(fdtCustomerType?.[0]?.id);

    setValue('ddlCustomerType', selectedUser?.customer_type_id);

  }, [dbtSelCustomerType, selectedUser.customer_type_id, setValue]);


  const [ddlCustomerTable, setDdlCustomerTable] = useState([]);
  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useEffect(() => {

    // const fdtCustomerType = dbtSelCustomerType?.filter((e: {id: Number}) => e.id === Number(selectedUser.customer_type_id))?.[0] || {};
    const customerType = getValues('ddlCustomerType');
    const fdtCustomer : any = dbtSavCustomer?.filter((e: {customer_type_id: Number}) => Number(e.customer_type_id) === Number(customerType));
    setDdlCustomerTable(fdtCustomer);
    // setDdlCustomerTypeSelId(fdtCustomerType?.[0]?.id);

    setValue('ddlCustomer', selectedUser?.customer_id);

  }, [dbtSavCustomer, getValues, selectedUser?.customer_id, setValue]);


  const [countryInfo, setCountryInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtCountry: any; isVisible: boolean; defaultId: string } = {
      fdtCountry: [],
      isVisible: false,
      defaultId: '',
    };

    info.fdtCountry = dbtSelCountry;

    setCountryInfo(info);
    info.defaultId = info.fdtCountry?.[0]?.value;

    setValue('ddlCountry', info.defaultId);

  }, [dbtSelCountry, setValue]);


  const [provStateInfo, setProvStateInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtProvState: any; isVisible: boolean; defaultId: string } = {
      fdtProvState: [],
      isVisible: false,
      defaultId: '',
    };

    // let controlsPrefProdTypeLink: any = [];
    info.fdtProvState = dbtSelProvState
    info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === selectedUser?.conuntry_id);


    setProvStateInfo(info);

    info.defaultId = info?.fdtProvState?.[0]?.value;
    setValue('ddlProvState', info.defaultId);

  }, [setValue, getValues, dbtSelProvState, selectedUser?.conuntry_id]);
  

  const ddlCountryChanged = useCallback((e: any) => {
    setValue('ddlCountry', e.target.value);
    // setSelectedCountry(e.target.value);
  },

  [setValue]
);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <CustomBreadcrumbs
        heading="Project Submittal"
        links={[{ name: 'Customers', href: '/admin-panel/customers' },
                { name: 'Customer Edit' }, 
                { name: 'Users', href: '/admin-panel/users' }, 
                { name: 'User Edit' }]}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <GroupBox title="USER INFO" bordersx={{ borderColor: 'gray' }}>
            <Stack spacing={2} p={2}>
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFTextField size="small" name="firstname" label="First Name" />
                <RHFTextField size="small" name="lastname" label="Last Name" />
              </Stack>
              <RHFTextField size="small" name="email" label="Email" />
              <RHFTextField size="small" name="username" label="User Name" />
              <Divider />
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlCustomerType"
                  label="Customer type"
                  placeholder=""
                >
                  {ddlCustomerTypeTable?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                  {/* {!ddlCustomerTypeTable && <option value="" />} */}
                </RHFSelect>
                <RHFSelect
                  native
                  size="small"
                  name="ddlCustomer"
                  label="Customer name"
                  placeholder=""
                >
                  {ddlCustomerTable ?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  {/* {!dbtSavCustomer  && <option value="" />} */}
                </RHFSelect>
              </Stack>
              {/* <RHFTextField size="small" name="txbCompanyName" label="Company Name" disabled/> */}
              <RHFTextField size="small" name="txbJobTitle" label="Job Title" />
              <RHFTextField size="small" name="txbPhoneNumber" label="Phone Number" />
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbAddress1" label="Address1" />
                <RHFTextField size="small" name="txbAddress2" label="Address2" />
              </Stack>
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbCity" label="City" />
                {/* <RHFTextField size="small" name="state/Province" label="Status" /> */}
                <RHFSelect
                      native
                      size="small"
                      name="ddlCountry"
                      label="Country"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      onChange={ddlCountryChanged}
                      // onChange={(e: any) =>{
                      //   setValue('ddlCountry', e.target.value)
                      //   // setSelectedCountry(e.target.value)
                      // } }
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
                      label="Province/State"
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
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFSelect native size="small" name="ddlAccess" label="Access" placeholder="">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </RHFSelect>
                <RHFSelect
                  native
                  size="small"
                  name="ddlAccessLevel"
                  label="Access level"
                  placeholder=""
                >
                  <option value="10">Admin</option>
                  <option value="4">Internal Admin</option>
                  <option value="3">Internal 2</option>
                  <option value="2">Internal 1</option>
                  <option value="1">External</option>
                  <option value="5">External Special</option>
                </RHFSelect>
                <RHFSelect
                  native
                  size="small"
                  name="ddlAccessPricing"
                  label="Access pricing"
                  placeholder=""
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </RHFSelect>
              </Stack>
              {/* <RHFSelect native size="small" name="fobPoint" label="FOB point" placeholder="">
                {dbtSelFOBPoint?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.items}
                  </option>
                ))}
                {!dbtSelFOBPoint && <option value="" />} */}
              {/* </RHFSelect> */}
              <RHFTextField size="small" name="txbFOB_Point" label="FOB point" disabled />
              <RHFTextField size="small" name="txbCreatedDate" label="Created Date" />
            </Stack>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              color="primary"
              onClick={() => console.log(getValues())}
            >
              Update
            </LoadingButton>
          </GroupBox>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

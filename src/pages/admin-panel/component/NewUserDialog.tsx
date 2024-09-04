import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import * as Ids from 'src/utils/ids';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetAccountInfo } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

interface NewUserDialogProps {
  open: boolean;
  onClose: Function;
  onSuccess: Function;
  onFail: Function;
  refetch: Function;
  name?: String;
  row?: any;
}

export default function NewUserDialog({
  open,
  onClose,
  onSuccess,
  onFail,
  refetch,
  row,
  name,

}: NewUserDialogProps) {
  const api = useApiContext();
  const { data: accountInfo, isLoading } = useGetAccountInfo();

  const {   
    dbtSavUser,
    dbtSelCustomerType,
    dbtSelFOB_Point,
    dbtSavCustomer,
    dbtSelCountry,
    dbtSelProvState, } = accountInfo || {};

  const NewUserSchema = Yup.object().shape({
    txbFirstname: Yup.string().required('This field is required!'),
    txbLastname: Yup.string().required('This field is required!'),
    txbEmail: Yup.string().required('This field is required!'),
    txbUsername: Yup.string().required('This field is required!'),
    txbPassword: Yup.string().required('This field is required!'),
    txbConfirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
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
  });

  
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [selCustomerTypeId, setSelCustomerTypeId] = useState<number>(0);
  const [selCustomerId, setSelCustomerId] = useState<number>(0);
  const [selCountryId, setSelCountryId] = useState<string>("");

  // useMemo(() => {

  //   // const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(userId))?.[0] || {};
  //   const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(0))?.[0] || {};
  //   setSelectedUser(fdtSelectedUser);
    
  // }, [dbtSavUser]);


  useMemo(() => {

    // // const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(userId))?.[0] || {};
    // const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(0))?.[0] || {};
    setSelectedUser(row);
    
  }, [row]);


  const newDefaultValues = useMemo(
    () => ({
      txbFirstName: '',
      txbLastName: '',
      txbEmail: '',
      txbUsername: '',
      txbPassword: '',
      txbConfirmPassword: '',
      ddlCustomerType: 'All',
      ddlCustomer: '1',
      txbPhoneNumber: '',
      txbAddress1: '',
      txbAddress2: '',
      ddlCountry: '',
      ddlProvState: '',
      ddlAccess: '1',
      ddlAccessLevel: '10',
      ddlAccessPricing: '0',
      txbFOB_Point: '',
      txbCreatedDate: '',
    }),
    []
  );


  const editDefaultValues = useMemo(
    () => ({
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
      }),
    [selectedUser]
  );


  // const defaultValues = {
  //   txbFirstName: selectedUser?.first_name,
  //   txbLastName: selectedUser?.last_name,
  //   txbEmail: selectedUser?.email,
  //   txbUsername: selectedUser?.username,
  //   txbPassword: '',
  //   txbConfirmPassword: '',
  //   ddlCustomerType: selectedUser?.customer_type,
  //   ddlCustomer: selectedUser?.customer_id,
  //   txbPhoneNumber: '',
  //   txbAddress1: '',
  //   txbAddress2: '',
  //   ddlCountry: '',
  //   ddlProvState: '',
  //   ddlAccess: selectedUser?.access,
  //   ddlAccessLevel: selectedUser?.access_level,
  //   ddlAccessPricing: selectedUser?.access_pricing,
  //   // fobPoint: dbtSelFOB_Point?.[0]?.id,
  //   txbFOB_Point: '',
  //   txbCreatedDate: selectedUser?.created_date,
  // };


  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: name === 'edit' ? editDefaultValues : newDefaultValues,
  });

  const {
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const userId = row?.id;
  const onSubmit = useCallback(
    async (data: any) => {
      try {
        if (name){
          await api.account.updateUser({ ...data, userId });
        }
        else{
          await api.account.addNewUser({ ...data, createdDate: '' });
        }
        onSuccess();
        reset(newDefaultValues);
        if (refetch) {
          refetch();
        }
        onClose();
      } catch (error) {
        console.error(error);
        onFail();
      }
    },
    // [api.account, onSuccess, reset, newDefaultValues,editDefaultValues, refetch, onClose, onFail]
    [name, onSuccess, reset, newDefaultValues, refetch, onClose, api.account, userId, onFail]

  );






  const [ddlCustomerTypeTable, setDdlCustomerTypeTable] = useState([]);
  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useMemo(() => {
    let defaultId = 0;

    let  fdtCustomerType : any = dbtSelCustomerType?.filter((e: {id: Number}) => 
      Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));

    if (selCustomerTypeId > 0) {
      fdtCustomerType = dbtSelCustomerType?.filter((e: {id: Number}) => e.id === Number(selCustomerTypeId))?.[0] || {};
    }


    defaultId = fdtCustomerType?.[0]?.id;

    if (Number(selectedUser?.customer_type_id) > 0) {
      defaultId = selectedUser?.customer_type_id;
    }

    setDdlCustomerTypeTable(fdtCustomerType);

    setValue('ddlCustomerType', defaultId);

  }, [dbtSelCustomerType, selCustomerTypeId, setValue, selectedUser?.customer_type_id]);



  const [ddlCustomerTable, setDdlCustomerTable] = useState([]);
  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useMemo(() => {
    let defaultId = 0;

    // const fdtCustomerType = dbtSelCustomerType?.filter((e: {id: Number}) => e.id === Number(selectedUser.customer_type_id))?.[0] || {};
    // const customerType = getValues('ddlCustomerType');
    
    let fdtCustomer : any = dbtSavCustomer?.filter((e: {customer_type_id: Number}) => Number(e.customer_type_id) === Number(getValues('ddlCustomerType')));

    // setDdlCustomerTypeSelId(fdtCustomerType?.[0]?.id);

    if (selCustomerId > 0) {
      fdtCustomer = fdtCustomer?.filter((item: { id: Number }) => Number(item.id) === selCustomerId);
      // info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === selectedUser?.conuntry_id);
    }


    defaultId = fdtCustomer?.[0]?.id;

    if (Number(selectedUser?.customer_id) > 0) {
      defaultId = selectedUser?.customer_id;
    }

    setDdlCustomerTable(fdtCustomer);
    setSelCustomerId(defaultId);
    setValue('ddlCustomer', defaultId);

  }, [dbtSavCustomer, getValues, selectedUser?.customer_id, setValue, selCustomerId]);


  useMemo(() => {

    const fdtFOB_Point = dbtSelFOB_Point?.filter((e: {id: Number}) => e.id === Number(selectedUser?.fob_point_id));
    // setTxbFOB_PointSelItem(fdtFOB_Point?.[0]?.items);
    setValue('txbFOB_Point', fdtFOB_Point?.[0]?.items);

  }, [dbtSelFOB_Point, selectedUser?.fob_point_id, setValue]);

  
  const [countryInfo, setCountryInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtCountry: any; isVisible: boolean; defaultId: string } = {
      fdtCountry: [],
      isVisible: false,
      defaultId: '',
    };

    info.fdtCountry = dbtSelCountry;

    if (String(selectedUser?.conuntry_id_code) !== 'undefined' && selectedUser?.conuntry_id_code !== "") {
      info.fdtCountry = info.fdtCountry?.filter((item: { value: string }) => item.value === selectedUser?.conuntry_id_code);
    }

    setCountryInfo(info);
    info.defaultId = info.fdtCountry?.[0]?.value;

    setValue('ddlCountry', info.defaultId);

  }, [open, dbtSelCountry, selectedUser?.conuntry_id_code, setValue]);


  const [provStateInfo, setProvStateInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtProvState: any; isVisible: boolean; defaultId: string } = {
      fdtProvState: [],
      isVisible: false,
      defaultId: '',
    };

    // let controlsPrefProdTypeLink: any = [];
    info.fdtProvState = dbtSelProvState

  if (selCountryId !== "") {
      info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === selCountryId);
      // info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === selectedUser?.conuntry_id);
  }

  info.defaultId = info?.fdtProvState?.[0]?.value;


  if (selectedUser?.prov_state_id_code !== "") {
    // info.fdtProvState = info.fdtProvState?.filter((item: { prov_state_id_code: string }) => item.prov_state_id_code === selectedUser?.prov_state_id_code);
    info.defaultId = selectedUser?.prov_state_id_code;
  }


    setProvStateInfo(info);

    info.defaultId = info?.fdtProvState?.[0]?.value;
    setValue('ddlProvState', info.defaultId);

  }, [open, dbtSelProvState, selCountryId, selectedUser?.prov_state_id_code, setValue]);
  

  const ddlCustomerTypeChanged = useCallback((e: any) => {
    setValue('ddlCustomerType', e.target.value);
    setSelCustomerTypeId(e.target.value);
  }, [setValue]);


  const ddlCountryChanged = useCallback((e: any) => {
    setValue('ddlCountry', e.target.value);
    setSelCountryId(e.target.value);
  }, [setValue]);




  return (
    <Dialog open={open} onClose={() => onClose && onClose()} sx={{ mt: 10 }}>{
      name? 
      <DialogTitle>Edit user</DialogTitle>
      :
      <DialogTitle>Add new user</DialogTitle>
}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}>
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFTextField size="small" name="txbFirstName" label="First Name" />
              <RHFTextField size="small" name="txbLastName" label="Last Name" />
            </Stack>
            <RHFTextField size="small" name="txbEmail" label="Email" />
            <RHFTextField size="small" name="txbUsername" label="User Name" />
            <RHFTextField size="small" name="txbPassword" label="Password" type="password"/>
            <RHFTextField
              size="small"
              type="password"
              name="txbConfirmPassword"
              label="Confirm Password"
            />
            <Stack direction="row" justifyContent="space-around" spacing={1}>
            <RHFSelect
              native
              size="small"
                  name="ddlCustomerType"
                  label="Customer type"
                  placeholder=""
                  onChange={ddlCustomerTypeChanged}
                  >
                  {ddlCustomerTypeTable?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.items}
                    </option>
                  ))}
            </RHFSelect>
            <RHFSelect
              native
              size="small"
              name="ddlCustomer"
              label="Customer name"
              placeholder=""
              >
                {ddlCustomerTable?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
                {/* {!dbtSavCustomer  && <option value="" />} */}
            </RHFSelect>            </Stack>
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
              <RHFSelect 
                native 
                size="small" 
                name="ddlAccess" 
                label="Access" 
                placeholder=""
              >
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
              {!dbtSelFOBPoint && <option value="" />}
            </RHFSelect> */}
              <RHFTextField size="small" name="txbFOB_Point" label="FOB point" disabled />
              <RHFTextField size="small" name="txbCreatedDate" label="Created Date" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button onClick={() => onClose && onClose()} sx={{ width: '50%' }}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={() => console.log(getValues())}
              loading={isSubmitting}
              sx={{ width: '50%' }}
            >
              Save
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

import { useMemo, useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import * as Ids from 'src/utils/ids';

// materials
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

interface customerDialogProps {
  open: boolean;
  onClose: Function;
  onSuccess: Function;
  onFail: Function;
  refetch: Function;
  name?: String;
  row?: any;
}

export default function CustomerDialog({
  open,
  onClose,
  onSuccess,
  onFail,
  name,
  row,
  refetch,
}: customerDialogProps) {
  const api = useApiContext();
  const { data: accountInfo } = useGetAccountInfo();
  const { dbtSelCustomerType, dbtSelFOB_Point, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {};


  const NewCustomerSchema = Yup.object().shape({
    txbCustomerName: Yup.string().required('This field is required!'),
    ddlCustomerType: Yup.number().required('This field is required!'),
    txbAddress: Yup.string(),
    ddlCountry: Yup.number().required('This field is required!'),
    ddlProvState: Yup.string(),
    txbRegion: Yup.string(),
    txbContactName: Yup.string(),
    ddlFOB_Point: Yup.number(),
    txbShippingFactor: Yup.number().required('This field is required!'),
  });

  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);
  const [selCustomerId, setSelCustomerId] = useState<number>(0);

  const [customerTypeOptions, setCustomerTypeOptions] = useState<any>([]);
  const [customerTypeId, setCustomerTypeId] = useState<number>(0);
  const [countryOptions, setCountryOptions] = useState<any>([]);
  const [countryId, setCountryId] = useState<number>(0);  
  const [countryValue, setCountryValue] = useState<string>("");  
  const [provStateOptions, setProvStateOptions] = useState<any>([]);
  const [provStateId, setProvStateId] = useState<any>("");
  const [fOB_PointOptions, setFOB_PointOptions] = useState<any>([]);
  const [fOB_PointId, setFOB_PointId] = useState<any>([]);



  useMemo(() => {
    setSelectedCustomer(row);
  }, [row]);


  // const editdefaultValues = {
  //   txbCustomerName: row?.name,
  //   ddlCustomerType: row?.customer_type_id,
  //   txbAddress: row?.address,
  //   txbCity: row?.city,
  //   ddlCountry: row?.country_id,
  //   ddlProvState: row?.state,
  //   txbRegion: row?.region,
  //   txbContactName: row?.contact_name,
  //   ddlFOB_Point: row?.fob_point_id,
  //   txbShippingFactor: row?.shipping_factor_percent,
  //   txbCreatedDate: row?.created_date,
  // };

  const newdefaultValues = useMemo(
    () => ({
      txbCustomerName: '',
      ddlCustomerType: 1,
      txbAddress: '',
      txbCity: '',
      ddlCountry: 1,
      ddlProvState: '',
      txbRegion: '',
      txbContactName: '',
      ddlFOB_Point: 1,
      txbShippingFactor: '',
      txbCreatedDate: '',
    }),
    []
  );


  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    // defaultValues: name === 'edit' ? editdefaultValues : newdefaultValues,
  });


  const {
    setValue,
    getValues,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  // ------------------------- Form State Values --------------------------
  // const values = watch();
  const formValues = watch(); // watch()
  const formCurrValues = getValues();



  const customerId = row?.id
  const onSubmit = useCallback(
    async (data: any) => {
      try {
        const inpData: any = {
          intCustomerId: Number(selectedCustomer?.id) > 0 ? Number(selectedCustomer?.id) : 0,
          strCustomerName: getValues('txbCustomerName'),
          intCustomerTypeId: Number(getValues('ddlCustomerType')),
          intCountryId: Number(getValues('ddlCountry')),
          strAddress: getValues('txbAddress'),
          strContactName: getValues('txbContactName'),
          intFOB_PointId: Number(getValues('ddlFOB_Point')),
          dblShippingFactor: Number(getValues('txbShippingFactor')),
          // strCreatedDate: getValues('txbcreatedDate'),
          strRegion: getValues('txbRegion'),
          strProvState: getValues('ddlProvState'),
        };
        // if (name){
        //   await api.account.updateCustomer({ ...data, customerId });
        // }
        // else{
        //   await api.account.addNewCustomer({ ...data, createdDate: '' });
        // }
        await api.account.saveCustomer(inpData);

        onSuccess();
        if (!name){
          reset(newdefaultValues);
        }
        if (refetch) {
          refetch();
        }
        onClose();
      } catch (error) {
        console.error(error);
        onFail();
      }
    },
    // [api.account, onSuccess, reset,editdefaultValues, newdefaultValues, refetch, onClose, onFail]
    [selectedCustomer?.id, getValues, api.account, onSuccess, name, refetch, onClose, reset, newdefaultValues, onFail]
  );


  const ddlCustomerTypeChanged = useCallback((e: any) => {
    setValue('ddlCustomerType', e.target.value);
    setCustomerTypeId(e.target.value);
  }, [setValue]);


  const ddlCountryChanged = useCallback((e: any) => {
    setValue('ddlCountry', e.target.value);
    setCountryId(e.target.value);
    const countryIndex = dbtSelCountry.findIndex((ele: { id: number }) => ele.id === Number(e.target.value))
    const counVal = dbtSelCountry[countryIndex]?.value;
    setCountryValue(counVal);
 }, [dbtSelCountry, setValue]);


  const ddlProvStateChanged = useCallback((e: any) => {
    setValue('ddlProvState', e.target.value);
    setProvStateId(e.target.value);
  }, [setValue]);


  const ddlFOB_PointChanged = useCallback((e: any) => {
    setValue('ddlFOB_Point', e.target.value);
    setFOB_PointId(e.target.value);
  }, [setValue]);


  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useEffect(() => {
    let options = dbtSelCustomerType;
    let defaultId = 0;

    options = options?.filter((e: {id: Number}) => Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));


    // if (String(selectedCustomer?.customer_type_id) !== 'undefined' && selectedCustomer?.customer_type_id !== "") {
    //   options = options?.filter((item: { id: number }) => Number(item.id) === selectedCustomer?.customer_type_id);
    // }

    // if (customerTypeId > 0) {
    //   options = options?.filter((e: {id: Number}) => e.id === Number(selCustomerTypeId))?.[0] || {};
    // }
    
    defaultId = options?.[0]?.id;

    setCustomerTypeOptions(options);

    setValue('ddlCustomerType', defaultId);
    setCustomerTypeId(defaultId);

  }, [open, dbtSelCustomerType, setValue]);


  useEffect(() => {
    const options = dbtSelCountry;
    let defaultId = 0;
    let counValue = "";

    // if (String(selectedCustomer?.conuntry_id_code) !== 'undefined' && selectedCustomer?.conuntry_id_code !== "") {
    //   options = options?.filter((item: { value: string }) => item.value === selectedCustomer?.conuntry_id_code);
    // }

    defaultId = options?.[0]?.id;
    counValue = options?.[0]?.value;

    setCountryOptions(options);
    setValue('ddlCountry', defaultId);
    setCountryId(defaultId);
    setCountryValue(counValue);

  }, [open, dbtSelCountry, setValue]);


  useEffect(() => {
    let options = dbtSelProvState;
    let defaultId = '';

  // if (countryId > 0) {
  //   options = options?.filter((item: { country_value: number }) => item.country_value === countryId);
  // }

  if (countryValue !== '') {
    options = options?.filter((item: { country_value: string }) => item.country_value === countryValue);
  }

  defaultId = options?.[0]?.value;


  // if (String(selectedCustomer?.prov_state_id_code) !== 'undefined' && selectedCustomer?.prov_state_id_code !== "") {
  //   options = options?.filter((item: { prov_state_id_code: string }) => item.prov_state_id_code === selectedCustomer?.prov_state_id_code);
  //   defaultId = selectedCustomer?.prov_state_id_code;
  // }

    setProvStateOptions(options);

    // defaultId = options?.[0]?.value;
    setValue('ddlProvState', defaultId);
    setProvStateId(defaultId);

  }, [open, dbtSelProvState, setValue, countryValue]);

  

  useEffect(() => {
    if (selectedCustomer !== null) {
      if (String(selectedCustomer?.customer_type_id) !== 'undefined' && Number(selectedCustomer?.customer_type_id) > 0) {
        setValue('ddlCustomerType', selectedCustomer?.customer_type_id);
        setCustomerTypeId(selectedCustomer?.customer_type_id);
      }

      if (String(selectedCustomer?.country_id) !== 'undefined' && Number(selectedCustomer?.country_id) > 0) {
        setValue('ddlCountry', selectedCustomer?.country_id);
        setCountryId(selectedCustomer?.country_id);
        const countryIndex = dbtSelCountry.findIndex((e: { id: number }) => e.id === selectedCustomer?.country_id)
        const counVal = dbtSelCountry[countryIndex]?.value;
        setCountryValue(counVal);
      }

      if (String(selectedCustomer?.state) !== 'undefined' && selectedCustomer?.state !== '') {
        setValue('ddlProvState', selectedCustomer?.state);
        setProvStateId(selectedCustomer?.state);
      }

      if (String(selectedCustomer?.fob_point_id) !== 'undefined' && Number(selectedCustomer?.fob_point_id) > 0) {
        setValue('ddlFOB_Point', selectedCustomer?.fob_point_id);
        setFOB_PointId(selectedCustomer?.fob_point_id);
      }

      setValue('txbCustomerName', String(selectedCustomer?.name) !== 'undefined' && selectedCustomer?.name !== "" ? selectedCustomer?.name : "");
      setValue('txbContactName', String(selectedCustomer?.contact_name) !== 'undefined' && selectedCustomer?.contact_name !== "" ? selectedCustomer?.contact_name : "");
      setValue('txbAddress', String(selectedCustomer?.address) !== 'undefined' && selectedCustomer?.address !== "" ? selectedCustomer?.address : "");
      setValue('txbCity', String(selectedCustomer?.city) !== 'undefined' && selectedCustomer?.city !== "" ? String(selectedCustomer?.city) : "");
      setValue('txbRegion', String(selectedCustomer?.region) !== 'undefined' && selectedCustomer?.region !== null ? selectedCustomer?.region : "");
      setValue('txbCreatedDate', String(selectedCustomer?.created_date) !== 'undefined' && selectedCustomer?.created_date !== "" ? selectedCustomer?.created_date : "");
      setValue('txbShippingFactor', String(selectedCustomer?.fob_point_id) !== 'undefined' && Number(selectedCustomer?.shipping_factor_percent) > 0 ? selectedCustomer?.shipping_factor_percent?.toFixed(2) : 9.8);
    } else {
      setValue('txbCustomerName', "");
      setValue('txbContactName', "");
      setValue('txbAddress', "");
      setValue('txbCity', "");
      setValue('txbRegion', "");
      setValue('txbCreatedDate', "");
      setValue('txbShippingFactor', 9.8);
    }
  }, [dbtSelCountry, open, selectedCustomer, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render





  return (
    <Dialog open={open} onClose={() => onClose()} sx={{ mt: 10 }}>
      {name === 'edit'?
        <DialogTitle>Edit customer</DialogTitle>
        :
        <DialogTitle>Add new customer</DialogTitle>
      }
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2, mt: 1 }}>
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFTextField size="small" name="txbCustomerName" label="Customer Name" />
              <RHFSelect
                native
                size="small"
                name="ddlCustomerType"
                label="Customer type"
                placeholder=""
                onChange={ddlCustomerTypeChanged}
                >
                {customerTypeOptions?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                ))}
                {/* {!dbtSelCustomerType && <option value="" />} */}
              </RHFSelect>
            </Stack>
            <RHFTextField size="small" name="txbAddress" label="Address" />
            <Stack direction="row" justifyContent="space-around" spacing={1}>
            <RHFSelect native size="small" name="ddlCountry" label="Country" placeholder=""
              onChange={ddlCountryChanged}>
              {countryOptions?.map((item: any, index: number) => (
                <option key={index} value={item.id}>
                  {item.items}
                </option>
              ))}
              {/* {!dbtSelCountry && <option value="" />} */}
            </RHFSelect>
            <RHFSelect
              native
              size="small"
              name="ddlProvState"
              label="Province/State"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
              onChange={ddlProvStateChanged}
            >
              {provStateOptions?.map((item: any, index: number) => (
                <option key={index} value={item.value}>
                  {item.items}
                </option>
              ))}
            </RHFSelect>            
          </Stack>
            <RHFTextField size="small" name="txbContactName" label="Contact name" />
            <RHFTextField size="small" name="txbRegion" label="Region" />
            <RHFSelect native size="small" name="ddlFOB_Point" label="FOB point" placeholder=""
              onChange={ddlFOB_PointChanged}
            >
              {dbtSelFOB_Point?.map((item: any, index: number) => (
                <option key={index} value={item.id}>
                  {item.items}
                </option>
              ))}
              {/* {!dbtSelFOB_Point && <option value="" />} */}
            </RHFSelect>
            <RHFTextField size="small" name="txbShippingFactor" label="Shipping factor(%)" />
            <RHFTextField size="small" name="txbCreatedDate" label="Created Date" disabled />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button onClick={() => onClose()} sx={{ width: '50%' }}>
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

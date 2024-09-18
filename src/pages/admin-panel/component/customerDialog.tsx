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

export default function customerDialog({
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
    txbContactName: Yup.string(),
    txbAddress: Yup.string(),
    ddlCountry: Yup.number(),
    ddlProvState: Yup.string(),
    ddlFOBPoint: Yup.number(),
    txbShippingFactor: Yup.number().required('This field is required!'),
  });

  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState<any>([]);
  // const [customerTypeId, setCustomerTypeId] = useState<number>(0);
  // const [selCustomerId, setSelCustomerId] = useState<number>(0);
  const [countryOptions, setCountryOptions] = useState<any>([]);
  const [countryId, setCountryId] = useState<string>("");  
  const [provStateOptions, setProvStateOptions] = useState<any>([]);
  const [fobOptions, setFOBOptions] = useState<any>([]);



  useMemo(() => {
    setSelectedCustomer(row);
  }, [row]);


  const editdefaultValues = {
    txbCustomerName: row?.name,
    ddlCustomerType: row?.customer_type_id,
    txbAddress: row?.address,
    txbCity: row?.city,
    ddlCountry: row?.country_id,
    ddlProvState: row?.state,
    txbRegion: row?.region,
    txbContactName: row?.contact_name,
    ddlFOBPoint: row?.fob_point_id,
    txbShippingFactor: row?.shipping_factor_percent,
    txbCreatedDate: row?.created_date,
  };

  const newdefaultValues = useMemo(
    () => ({
      txbCustomerName: '',
      ddlCustomerType: 1,
      txbAddress: '',
      txbCity: '',
      ddlCountry: 1,
      ddlProvState: 1,
      txbRegion: '',
      txbContactName: '',
      ddlFOBPoint: 1,
      txbShippingFactor: '',
      txbCreatedDate: '',
    }),
    []
  );



  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues: name === 'edit' ? editdefaultValues : newdefaultValues,
  });

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const customerId = row?.id
  const onSubmit = useCallback(
    async (data: any) => {
      try {
        if (name){
          await api.account.updateCustomer({ ...data, customerId });
        }
        else{
          await api.account.addNewCustomer({ ...data, createdDate: '' });
        }
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
    [name, onSuccess, refetch, onClose, api.account, customerId, reset, newdefaultValues, onFail]
  );


  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useMemo(() => {
    let options = dbtSelCustomerType;
    let defaultId = 0;

    options = options?.filter((e: {id: Number}) => 
      Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));


    if (String(selectedCustomer?.customer_type_id) !== 'undefined' && selectedCustomer?.customer_type_id !== "") {
      options = options?.filter((item: { value: string }) => item.value === selectedCustomer?.customer_type_id);
    }

    // if (customerTypeId > 0) {
    //   options = options?.filter((e: {id: Number}) => e.id === Number(selCustomerTypeId))?.[0] || {};
    // }
    
    defaultId = options?.[0]?.id;

    setCustomerTypeOptions(options);

    setValue('ddlCustomerType', defaultId);

  }, [dbtSelCustomerType, selectedCustomer?.customer_type_id, setValue]);


  useEffect(() => {
    let options = dbtSelCountry;
    let defaultId = '';

    if (String(selectedCustomer?.conuntry_id_code) !== 'undefined' && selectedCustomer?.conuntry_id_code !== "") {
      options = options?.filter((item: { value: string }) => item.value === selectedCustomer?.conuntry_id_code);
    }

    defaultId = options?.[0]?.value;

    setCountryOptions(options);
    setValue('ddlCountry', defaultId);

  }, [dbtSelCountry, selectedCustomer?.conuntry_id_code, setValue]);


  useEffect(() => {
    let options = dbtSelProvState;
    let defaultId = '';

  if (countryId !== "") {
    options = options?.filter((item: { country_value: string }) => item.country_value === countryId);
  }

  defaultId = options?.[0]?.value;


  if (String(selectedCustomer?.prov_state_id_code) !== 'undefined' && selectedCustomer?.prov_state_id_code !== "") {
    options = options?.filter((item: { prov_state_id_code: string }) => item.prov_state_id_code === selectedCustomer?.prov_state_id_code);
    defaultId = selectedCustomer?.prov_state_id_code;
  }

    setProvStateOptions(options);

    defaultId = options?.[0]?.value;
    setValue('ddlProvState', defaultId);

  }, [countryId, dbtSelProvState, selectedCustomer?.prov_state_id_code, setValue]);

  


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
              >
                {customerTypeOptions?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.items}
                  </option>
                ))}
                {/* {!dbtSelCustomerType && <option value="" />} */}
              </RHFSelect>
            </Stack>
            <RHFTextField size="small" name="txbAddress" label="Address" />
            <Stack direction="row" justifyContent="space-around" spacing={1}>
            <RHFSelect native size="small" name="ddlCountryId" label="Country" placeholder="">
              {countryOptions?.map((item: any) => (
                <option key={item.id} value={item.id}>
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
                      // onChange={ddlProvStateChanged}
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
            <RHFSelect native size="small" name="ddlFOBPoint" label="FOB point" placeholder="">
              {dbtSelFOB_Point?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.items}
                </option>
              ))}
              {/* {!dbtSelFOB_Point && <option value="" />} */}
            </RHFSelect>
            <RHFTextField size="small" name="txbShippingFactor" label="Shipping factor(%)" />
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

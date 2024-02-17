import { useMemo, useCallback } from 'react';
import * as Yup from 'yup';
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

interface NewCustomerDialogProps {
  open: boolean;
  onClose: Function;
  onSuccess: Function;
  onFail: Function;
}

export default function NewCustomerDialog({
  open,
  onClose,
  onSuccess,
  onFail,
}: NewCustomerDialogProps) {
  const api = useApiContext();
  const { data: accountInfo } = useGetAccountInfo();
  const { customerType, fobPoint, country } = accountInfo || {};

  const NewCustomerSchema = Yup.object().shape({
    username: Yup.string().required('This field is required!'),
    customerType: Yup.number().required('This field is required!'),
    countryId: Yup.number().required('This field is required!'),
    address: Yup.string().required('This field is required!'),
    contactName: Yup.string().required('This field is required!'),
    fobPoint: Yup.number().required('This field is required!'),
    shippingFactor: Yup.number().required('This field is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      username: '',
      customerType: 1,
      countryId: 1,
      region: '',
      address: '',
      contactName: '',
      fobPoint: 1,
      shippingFactor: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    getValues,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await api.account.addNewCustomer({ ...data, createdDate: '' });
        onSuccess();
        reset(defaultValues);
        onClose();
      } catch (error) {
        console.error(error);
        onFail();
      }
    },
    [defaultValues, onClose, onFail, onSuccess, reset, api.account]
  );

  return (
    <Dialog open={open} onClose={() => onClose()} sx={{ mt: 10 }}>
      <DialogTitle>Add new customer</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2, mt: 1 }}>
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFTextField size="small" name="username" label="Customer Name" />
              <RHFSelect
                native
                size="small"
                name="customerType"
                label="Customer type"
                placeholder=""
              >
                {customerType?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.items}
                  </option>
                ))}
                {!customerType && <option value="" />}
              </RHFSelect>
            </Stack>
            <RHFTextField size="small" name="address" label="Address" />
            <RHFSelect native size="small" name="countryId" label="Country" placeholder="">
              {country?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.items}
                </option>
              ))}
              {!country && <option value="" />}
            </RHFSelect>
            <RHFTextField size="small" name="contactName" label="Contact name" />
            <RHFSelect native size="small" name="fobPoint" label="FOB point" placeholder="">
              {fobPoint?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.items}
                </option>
              ))}
              {!fobPoint && <option value="" />}
            </RHFSelect>
            <RHFTextField size="small" name="shippingFactor" label="Shipping factor(%)" />
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

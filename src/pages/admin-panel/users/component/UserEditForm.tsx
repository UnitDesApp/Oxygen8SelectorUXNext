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

// ------------------------------------------------------------------------

interface UserEditFormProps {
  users: any[];
  customerType: any[];
  fobPoint: any[];
  customers: any[];
  setSuccessText?: Function;
  setFailDlgOpen?: Function;
  setSuccessDlgOpen?: Function;
}

export default function UserEditForm({
  users,
  customerType,
  fobPoint,
  customers,
  setSuccessText,
  setFailDlgOpen,
  setSuccessDlgOpen,
}: UserEditFormProps) {
  const { userId } = useRouter().query;
  const api = useApiContext();

  const selectedUser = users?.filter((user: any) => user.id === Number(userId))?.[0] || {};

  const UserSchema = Yup.object().shape({
    firstname: Yup.string().required('This field is required!'),
    lastname: Yup.string().required('This field is required!'),
    email: Yup.string().required('This field is required!'),
    username: Yup.string().required('This field is required!'),
    customerType: Yup.string().required('This field is required!'),
    customerId: Yup.string().required('This field is required!'),
    access: Yup.string().required('This field is required!'),
    accessLevel: Yup.string().required('This field is required!'),
    accessPricing: Yup.string().required('This field is required!'),
    fobPoint: Yup.string().required('This field is required!'),
    createdDate: Yup.string().required('This field is required!'),
    password: Yup.string().required('This field is required!'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    firstname: selectedUser?.first_name,
    lastname: selectedUser?.last_name,
    email: selectedUser?.email,
    username: selectedUser?.username,
    password: '',
    confirmPassword: '',
    customerType: selectedUser?.customer_type,
    customerId: selectedUser?.customer_id,
    access: selectedUser?.access,
    accessLevel: selectedUser?.access_level,
    accessPricing: selectedUser?.access_pricing,
    fobPoint: fobPoint?.[0]?.id,
    createdDate: selectedUser?.created_date,
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await api.account.updateUser({ ...data, userId });
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <CustomBreadcrumbs
        heading="Project Submittal"
        links={[{ name: 'Users', href: '/admin-panel/users' }, { name: 'User Edit' }]}
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
                <RHFSelect size="small" name="customerType" label="Customer type" placeholder="">
                  {customerType?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                  {!customerType && <option value="" />}
                </RHFSelect>
                <RHFSelect size="small" name="customerId" label="Customer name" placeholder="">
                  {customers?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  {!customers && <option value="" />}
                </RHFSelect>
              </Stack>
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFSelect size="small" name="access" label="Access" placeholder="">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </RHFSelect>
                <RHFSelect size="small" name="accessLevel" label="Access level" placeholder="">
                  <option value="10">Admin</option>
                  <option value="4">Internal Admin</option>
                  <option value="3">Internal 2</option>
                  <option value="2">Internal 1</option>
                  <option value="1">External</option>
                  <option value="5">External Special</option>
                </RHFSelect>
                <RHFSelect size="small" name="accessPricing" label="Access pricing" placeholder="">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </RHFSelect>
              </Stack>
              <RHFSelect size="small" name="fobPoint" label="FOB point" placeholder="">
                {fobPoint?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.items}
                  </option>
                ))}
                {!fobPoint && <option value="" />}
              </RHFSelect>
              <RHFTextField size="small" name="createdDate" label="Created Date" />
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

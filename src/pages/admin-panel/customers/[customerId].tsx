import { useState } from 'react';
// yup
import * as Yup from 'yup';
// mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Container,
  Button,
  Snackbar,
  Alert,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useGetAccountInfo } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import Users from '../users';
import NewUserDialog from '../component/NewUserDialog';
import NewCustomerDialog from '../component/NewCustomerDialog';

// ------------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ------------------------------------------------------------------------
UserEdit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function UserEdit() {
  const { customerId } = useRouter().query;
  const api = useApiContext();
  const { data: accountInfo, isLoading, refetch } = useGetAccountInfo();
  const { dbtSelCustomerType, dbtSelFOBPoint, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {
    customers: [],
    fobPoint: [],
  };

  const selectedCustomer = dbtSavCustomer.filter(
    (cusstomer: any) => cusstomer.id === Number(customerId?.toString() || '0')
  )[0];

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('This field is required!'),
    customerType: Yup.number().required('This field is required!'),
    countryId: Yup.number().required('This field is required!'),
    address: Yup.string().required('This field is required!'),
    contactName: Yup.string().required('This field is required!'),
    fobPoint: Yup.number().required('This field is required!'),
    shippingFactor: Yup.number().required('This field is required!'),
    createdDate: Yup.string().required('This field is required!'),
  });

  const defaultValues = {
    username: selectedCustomer?.name,
    customerType: selectedCustomer?.customer_type_id,
    countryId: selectedCustomer?.country_id,
    address: selectedCustomer?.address,
    contactName: selectedCustomer?.contact_name,
    fobPoint: selectedCustomer?.fob_point_id,
    shippingFactor: selectedCustomer?.shipping_factor_percent,
    createdDate: selectedCustomer?.created_date,
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [addUserDlgOpen, setAddUserDlgOpen] = useState(false);
  const [addCustomerDlgOpen, setAddCustomerDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [expanded, setExpanded] = useState({ panel1: true, panel2: true });

  const onCloseUserDlg = () => {
    setAddUserDlgOpen(false);
  };

  const onCloseCustomerDlg = () => {
    setAddCustomerDlgOpen(false);
  };

  const onCloseSuccessDlgOpen = () => {
    setSuccessDlgOpen(false);
  };

  const onCloseFailDlgOpen = () => {
    setFailDlgOpen(false);
  };

  const onSuccessAddUser = () => {
    setSuccessText('New user has been added');
    setSuccessDlgOpen(true);
  };

  const onSuccessAddCustomer = () => {
    setSuccessText('New customer has been added');
    setSuccessDlgOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      await api.account.updateCustomer({ ...data, customerId });
      setSuccessText('Successfully Updated');
      setSuccessDlgOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <RootStyle>
      <Container sx={{ mt: '20px' }}>
        <CustomBreadcrumbs
          heading="Project Submittal"
          links={[{ name: 'Customers', href: '/admin-panel/customers' }, { name: 'Customer Edit' }]}
        />
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
              <Typography color="primary.main" variant="h6">
                CUSTOMER INFO
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <RHFTextField size="small" name="username" label="Customer Name" />
                  <RHFSelect
                    native
                    size="small"
                    name="customerType"
                    label="Customer type"
                    placeholder=""
                  >
                    {dbtSelCustomerType?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSelCustomerType && <option value="" />}
                  </RHFSelect>
                  <RHFTextField size="small" name="address" label="Address" />
                  <RHFSelect native size="small" name="countryId" label="Country" placeholder="">
                    {dbtSelCountry?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSavCustomer && <option value="" />}
                  </RHFSelect>
                  <RHFTextField size="small" name="contactName" label="Contact name" />
                  <RHFSelect native size="small" name="fobPoint" label="FOB point" placeholder="">
                    {dbtSelFOBPoint?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSelFOBPoint && <option value="" />}
                  </RHFSelect>
                  <RHFTextField size="small" name="createdDate" label="Create date" />
                  <RHFTextField size="small" name="shippingFactor" label="Shipping factor(%)" />
                </Box>
                <Stack spacing={2} p={2}>
                  <Stack direction="row" justifyContent="flex-end">
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      variant="contained"
                      color="primary"
                      onClick={() => console.log(getValues())}
                    >
                      Update
                    </LoadingButton>
                  </Stack>
                </Stack>
              </FormProvider>
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
              <Typography color="primary.main" variant="h6">
                USER LIST
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Users toolbar={false} checkbox={false} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Container>
      <Snackbar open={successDlgOpen} autoHideDuration={3000} onClose={onCloseSuccessDlgOpen}>
        <Alert onClose={onCloseSuccessDlgOpen} severity="success" sx={{ width: '100%' }}>
          {successText}
        </Alert>
      </Snackbar>
      <Snackbar open={failDlgOpen} autoHideDuration={3000} onClose={onCloseFailDlgOpen}>
        <Alert onClose={onCloseFailDlgOpen} severity="success" sx={{ width: '100%' }}>
          Server error!
        </Alert>
      </Snackbar>
      <NewUserDialog
        open={addUserDlgOpen}
        onClose={onCloseUserDlg}
        onSuccess={onSuccessAddUser}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
      <NewCustomerDialog
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
    </RootStyle>
  );
}

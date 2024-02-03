import { useEffect, useState } from 'react';
// yup
import * as Yup from 'yup';
// mui
import { styled } from '@mui/material/styles';
import { Stack, Grid, Container, Button, Snackbar, Alert, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useGetAccountInfo } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import NewUserDialog from '../component/NewUserDialog';
import NewCustomerDialog from '../component/NewCustomerDialog';
import FormProvider from 'src/components/hook-form/FormProvider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import GroupBox from 'src/components/GroupBox';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import UserEditForm from './component/UserEditForm';
import Loading from 'src/components/loading';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';

// ------------------------------------------------------------------------
UserEdit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function UserEdit() {
  const { userId } = useRouter().query;
  const api = useApiContext();
  const { data: accountInfo, isLoading } = useGetAccountInfo();
  const { users, customerType, fobPoint, customers } = accountInfo || {
    users: [],
    customers: [],
    fobPoint: [],
  };

  const [addUserDlgOpen, setAddUserDlgOpen] = useState(false);
  const [addCustomerDlgOpen, setAddCustomerDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');

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

  if (isLoading) return <Loading />;

  return (
    <>
      <Container>
        <UserEditForm
          customerType={customerType}
          customers={customers}
          fobPoint={fobPoint}
          users={users}
          setSuccessText={setSuccessText}
          setFailDlgOpen={setFailDlgOpen}
          setSuccessDlgOpen={setSuccessDlgOpen}
        />
      </Container>
      <Snackbar open={successDlgOpen} autoHideDuration={3000} onClose={onCloseSuccessDlgOpen}>
        <Alert onClose={onCloseSuccessDlgOpen} severity="success" sx={{ width: '100%' }}>
          {successText}
        </Alert>
      </Snackbar>
      <Snackbar open={failDlgOpen} autoHideDuration={3000} onClose={onCloseFailDlgOpen}>
        <Alert onClose={onCloseFailDlgOpen} severity="warning" sx={{ width: '100%' }}>
          Server error!
        </Alert>
      </Snackbar>
      <NewUserDialog
        open={addUserDlgOpen}
        onClose={onCloseUserDlg}
        onSuccess={onSuccessAddUser}
        onFail={() => setFailDlgOpen(true)}
      />
      <NewCustomerDialog
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
      />
    </>
  );
}

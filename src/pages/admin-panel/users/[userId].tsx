import { useState } from 'react';
// mui
import { Container, Snackbar, Alert } from '@mui/material';
// form
import { useGetAccountInfo } from 'src/hooks/useApi';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import Loading from 'src/components/loading';
import NewUserDialog from '../component/NewUserDialog';
import NewCustomerDialog from '../component/NewCustomerDialog';
import UserEditForm from './component/UserEditForm';

// ------------------------------------------------------------------------
UserEdit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function UserEdit() {
  const { data: accountInfo, isLoading, refetch } = useGetAccountInfo();
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
        refetch={refetch}
      />
      <NewCustomerDialog
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
    </>
  );
}

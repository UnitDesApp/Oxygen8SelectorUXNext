import { useState } from 'react';
// mui
import { Container, Snackbar, Alert, Stack } from '@mui/material';
// form
import { useGetAccountInfo } from 'src/hooks/useApi';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import Loading from 'src/components/loading';
// import UserAccountForm from 'src/pages/account/component/AccountForm';
// import ChangePasswordForm from 'src/pages/account/component/ChangePasswordForm';
import UserDialog from '../component/userDialog';
import CustomerDialog from '../component/customerDialog';
import UserEditForm from './component/UserEditForm';



// ------------------------------------------------------------------------
UserEdit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function UserEdit() {
  const { data: accountInfo, isLoading, refetch } = useGetAccountInfo();
  const { dbtSavUser, dbtSelCustomerType, dbtSelFOB_Point, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {
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
          dbtSelCustomerType ={dbtSelCustomerType}
          dbtSavCustomer={dbtSavCustomer}
          dbtSelFOB_Point={dbtSelFOB_Point}
          dbtSavUser={dbtSavUser}
          dbtSelCountry={dbtSelCountry}
          dbtSelProvState={dbtSelProvState}
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
      <UserDialog
        open={addUserDlgOpen}
        onClose={onCloseUserDlg}
        onSuccess={onSuccessAddUser}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
      <CustomerDialog
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
    </>
  );
}

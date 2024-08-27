import { useState, useCallback } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Container, Button, Stack, Snackbar, Alert } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import NewUserDialog from './NewUserDialog';
import NewCustomerDialog from './NewCustomerDialog';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({}));

// ----------------------------------------------------------------------
interface AdminPanelWrapperProps {
  currentTab: string;
  refetch: () => void;
  children: any;
}

// ----------------------------------------------------------------------
export default function AdminPanelWrapper({
  currentTab,
  children,
  refetch,
}: AdminPanelWrapperProps) {
  const [addUserDlgOpen, setAddUserDlgOpen] = useState(false);
  const [addCustomerDlgOpen, setAddCustomerDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');

  const { themeStretch } = useSettingsContext();

  const onCloseUserDlg = useCallback(() => {
    setAddUserDlgOpen(false);
  }, []);

  const onCloseCustomerDlg = useCallback(() => {
    setAddCustomerDlgOpen(false);
  }, []);

  const onCloseSuccessDlgOpen = useCallback(() => {
    setSuccessDlgOpen(false);
  }, []);

  const onCloseFailDlgOpen = useCallback(() => {
    setFailDlgOpen(false);
  }, []);

  const onSuccessAddUser = useCallback(() => {
    setSuccessText('New user has been added');
    setSuccessDlgOpen(true);
  }, []);

  const onSuccessAddCustomer = useCallback(() => {
    setSuccessText('New customer has been added');
    setSuccessDlgOpen(true);
  }, []);

  return (
    <RootStyle>
      <Container maxWidth={false} sx={{ mt: '20px' }}>
        <CustomBreadcrumbs
          heading="Admin Panel"
          links={[{ name: currentTab === 'users' ? 'Users' : 'Customers' }]}
          action={
            <Stack direction="row" justifyContent="center" spacing={1}>
              {currentTab === 'customers' && (
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Iconify icon="mdi:plus" />}
                  onClick={() => {
                    setAddCustomerDlgOpen(true);
                  }}
                >
                  Add new customer
                </Button>
              )}
              {currentTab === 'users' && (
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<Iconify icon="mdi:user" />}
                  onClick={() => {
                    setAddUserDlgOpen(true);
                  }}
                >
                  Add new user
                </Button>
              )}
            </Stack>
          }
        />
        {children}
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
    </RootStyle>
  );
}

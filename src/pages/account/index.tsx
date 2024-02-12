// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useGetAccountInfo } from 'src/hooks/useApi';
import Loading from 'src/components/loading';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Head from 'next/head';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AccountForm from './component/AccountForm';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------
Account.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ----------------------------------------------------------------------
export default function Account() {
  const { data: accountInfo, isLoading } = useGetAccountInfo();

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title> My Account | Oxygen8 </title>
      </Head>

      <RootStyle>
        <Container sx={{ mt: '20px' }}>
          <CustomBreadcrumbs heading="My Account" links={[{ name: 'Edit Account' }]} />
          <AccountForm accountInfo={accountInfo} />
        </Container>
      </RootStyle>
    </>
  );
}

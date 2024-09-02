// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useGetAccountInfo } from 'src/hooks/useApi';
import Loading from 'src/components/loading';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Head from 'next/head';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { useSettingsContext } from 'src/components/settings';
import AccountForm from './component/AccountForm';

// ----------------------------------------------------------------------
Account.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ----------------------------------------------------------------------
export default function Account() {
  const { data: accountInfo, isLoading } = useGetAccountInfo();
  const { themeStretch } = useSettingsContext();

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title> My Account | Oxygen8 </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs heading="My Account" links={[{ name: '' }]} />
        <AccountForm accountInfo={accountInfo} />
      </Container>
    </>
  );
}

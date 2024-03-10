// next
import Head from 'next/head';
// auth
import ResetPassword from 'src/sections/auth/ResetPassword/index';
import GuestGuard from '../../auth/GuestGuard';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title> Reset password | Oxygen8</title>
      </Head>

      <GuestGuard>
        <ResetPassword />
      </GuestGuard>
    </>
  );
}

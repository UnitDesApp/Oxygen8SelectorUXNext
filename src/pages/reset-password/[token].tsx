// next
import Head from 'next/head';
// auth
import ResetPassword from 'src/sections/auth/ResetPassword/index';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from 'src/components/loading';
import axios from 'src/utils/axios';
import { jwtDecode } from 'jwt-decode';
import { BACKEND_ENDPOINT } from 'src/config-global';
import NewPassword from 'src/sections/auth/NewPassword';
import GuestGuard from '../../auth/GuestGuard';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const { token } = useRouter().query;
  const [isConfirming, setIsConfirming] = useState<boolean>(true);

  const [error, setError] = useState('');
  const [tokenEmail, setTokenEmail] = useState('');

  useEffect(() => {
    if (token) {
      const tokenData: {
        email: string;
        expireTime: number;
      } = jwtDecode(token.toString());

      axios
        .post(`${BACKEND_ENDPOINT}/api/user/completeresetpassword`, { email: tokenData.email })
        .then((response: { data: any }) => {
          if (response.data) {
            const now = new Date();
            if (tokenData.expireTime > now.getTime()) {
              setError('');
            } else {
              setError('Token has expired!');
            }
          } else {
            setError('You have already changed your password!');
          }
          setTokenEmail(tokenData.email);
          setIsConfirming(false);
        });
    }
  }, [token]);

  if (isConfirming) return <Loading />;

  return (
    <>
      <Head>
        <title> Reset password | Oxygen8</title>
      </Head>

      <GuestGuard>
        <NewPassword email={tokenEmail} tokenError={error} />
      </GuestGuard>
    </>
  );
}

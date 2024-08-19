// i18n
import '../locales/i18n';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import { CacheProvider, EmotionCache } from '@emotion/react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import { AppProps } from 'next/app';
// utils
import { ApiProvider } from 'src/contexts/ApiContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import createEmotionCache from '../utils/createEmotionCache';
// theme
import ThemeProvider from '../theme';
// locales
import ThemeLocalization from '../locales';
// components
import ProgressBar from '../components/progress-bar';
import SnackbarProvider from '../components/snackbar';
import { MotionLazyContainer } from '../components/animate';
import { SettingsProvider } from '../components/settings';
import { AuthProvider } from '../auth/JwtContext';
import  UnitTypeProvider  from './project/[projectId]/unit/components/UnitInfo/unitTypeDataContext';

// ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      // refetchOnMount: false,
    },
  },
});

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <AuthProvider>
            <SettingsProvider>
              <MotionLazyContainer>
                <ThemeProvider>
                  <ThemeLocalization>
                    <SnackbarProvider>
                      <ProgressBar />
                      <UnitTypeProvider>
                      {getLayout(<Component {...pageProps} />)}
                      </UnitTypeProvider>
                    </SnackbarProvider>
                  </ThemeLocalization>
                </ThemeProvider>
              </MotionLazyContainer>
            </SettingsProvider>
          </AuthProvider>
        </ApiProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

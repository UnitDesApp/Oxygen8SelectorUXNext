import React, { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Divider, LinearProgress, Alert } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useGetFileList } from 'src/hooks/useApi';
import Head from 'next/head';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import ResourceHeader from './components/ResourceHeader';
import ResourceTable from './components/ResourceTable';
import { ResourceNames } from 'src/utils/constants';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';

Resources.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function Resources() {
  const [currentTab, onChangeTab] = useState('all');
  //   const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();

  const { data: fileList, isLoading } = useGetFileList();

  return (
    <>
      <Head>
        <title> Resources | Oxygen8 </title>
      </Head>
      <Box>
        <Container>
          <CustomBreadcrumbs
            heading="Resources"
            links={[{ name: '', href: '' }]}
            // action={
            //   <Button
            //     variant="contained"
            //     startIcon={<Iconify icon="ic:outline-plus" />}
            //     onClick={() => {
            //       setIsOpen(true);
            //     }}
            //     disabled={!Number(user?.verified)}
            //   >
            //     Upload Files
            //   </Button>
            // }
          />
          {user?.verified && !Number(user?.verified) ? (
            <Alert sx={{ width: '100%', mt: 3 }} severity="warning">
              <b>You are not verified!</b> - Please check your email inbox, if you didn't receive
              the message, <a href="">please resend verification link!</a>.
            </Alert>
          ) : (
            <>
              <ResourceHeader curValue={currentTab} updateCurValue={onChangeTab} />
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
                }}
              >
                {!isLoading &&
                  Object.entries(fileList)?.map(
                    (item: any, i) =>
                      (item[0] === currentTab || currentTab === 'all') &&
                      item[1].length > 0 && (
                        <ResourceTable
                          key={i}
                          resourceType={item[0]}
                          objResources={item[1]}
                          title={ResourceNames[item[0]]}
                          sx={{ width: '100%' }}
                        />
                      )
                  )}
              </Box>
              {isLoading && <LinearProgress color="info" />}
            </>
          )}
        </Container>
        {/* <FileUploadDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        /> */}
      </Box>
    </>
  );
}

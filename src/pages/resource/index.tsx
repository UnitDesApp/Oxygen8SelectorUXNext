import React, { useState } from 'react';
// @mui
import { Box, Container, Divider, LinearProgress, Alert, Stack } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useGetFileList } from 'src/hooks/useApi';
import Head from 'next/head';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ResourceNames } from 'src/utils/constants';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import ResourceHeader from './components/ResourceHeader';
import ResourceTable from './components/ResourceTable';

Resources.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function Resources() {
  const [currentTab, onChangeTab] = useState('all');
  //   const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();

  const { data: fileList, isLoading } = useGetFileList();

  // const isVerified = user?.verified && !Number(user?.verified);S
  const isVerified = true;

  // const fdtUnitModel = fileList.dbtSelNovaUnitModel;
  const literatureCommer = fileList?.filter((item: {folder: string}) => item.folder === 'LiteratureCommercial');

const literatureCommerAll = {
  ...literatureCommer?.[0]?.files?.LiteratureCommercial,
  ...literatureCommer?.[0]?.files?.Nova,
  ...[
    ...(literatureCommer?.[0]?.files?.Ventum || []),
    ...(literatureCommer?.[0]?.files?.VentumLite || []),
    ...(literatureCommer?.[0]?.files?.VentumPlus || []),
    ...(literatureCommer?.[0]?.files?.Terra || [])
  ]
};

  const literatureResid = fileList?.filter((item: {folder: string}) => item.folder === 'LiteratureResidential');
  const manualCommer = fileList?.filter((item: {folder: string}) => item.folder === 'ManualCommercial');
  const manualResid = fileList?.filter((item: {folder: string}) => item.folder === 'ManualResidential');
  const specificationCommer = fileList?.filter((item: {folder: string}) => item.folder === 'SpecificationCommercial');
  const specificationResid = fileList?.filter((item: {folder: string}) => item.folder === 'SpecificationResidential');
  const techResourceCommer = fileList?.filter((item: {folder: string}) => item.folder === 'TechResourceCommercial');
  const techResourceResid = fileList?.filter((item: {folder: string}) => item.folder === 'TechResourceResidential');
  const presentationContractor = fileList?.filter((item: {folder: string}) => item.folder === 'PresentationContractor');
  const presentationEngineer = fileList?.filter((item: {folder: string}) => item.folder === 'PresentationEngineer');
  const presentationSales = fileList?.filter((item: {folder: string}) => item.folder === 'PresentationSales');
  const videos = fileList?.filter((item: {folder: string}) => item.folder === 'Videos');
  // fdtUnitModel = db.dbtSelNovaUnitModel;


  let arrliteratureCommerAll :any= []; 
  if (typeof literatureCommerAll === 'object' && literatureCommerAll !== null) {
    arrliteratureCommerAll.push(...Object.values(literatureCommerAll));
  }

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
          {!isVerified ? (
            <Alert sx={{ width: '100%', mt: 3 }} severity="warning">
              <b>You are not verified!</b> -{' '}
              {`Please check your email inbox, if you didn't receive
              the message`}
              , <a href="">please resend verification link!</a>.
            </Alert>
          ) : (
            <>
              <ResourceHeader curValue={currentTab} updateCurValue={onChangeTab} />
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: 'grid',
                  // gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
                {/* {!isLoading && fileList && Object.entries(fileList?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title={ResourceNames[item[0]]}
                      sx={{ width: '100%' }}
                    />
                  ))
                } */}

                {/* {!isLoading && literatureCommer && literatureCommer?.[0] && Object.entries(literatureCommer?.[0]?.files)?.map((item: any, i) => */}
                {!isLoading && arrliteratureCommerAll && Object.entries([arrliteratureCommerAll])?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && arrliteratureCommerAll.length > 0 && (
              
                <ResourceTable
                  key={i}
                  resourceType={item[0]}
                  objResources={arrliteratureCommerAll}
                  title="Literature & Brochures Commercial"
                  sx={{ width: '100%' }}
                />
              )
            )
            }
                <Stack sx={{display: literatureCommer?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>


                {!isLoading && literatureResid && literatureResid?.[0] && Object.entries(literatureResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Literature & Brochures Residential"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: literatureResid?.[0].length === 0 ? 'grid' : 'none' }}>
                <></>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
                {!isLoading && manualCommer && manualCommer?.[0] && Object.entries(manualCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Manuals Commercial"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: manualCommer?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>


                {!isLoading && manualResid && manualResid?.[0] && Object.entries(manualResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Manuals Residential"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: manualResid?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
                {!isLoading && specificationCommer && specificationCommer?.[0] && Object?.entries(specificationCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Specifications Commerical"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: specificationCommer?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>

                {!isLoading && specificationResid && specificationResid?.[0] && Object.entries(specificationResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Specifications Residential"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: specificationResid?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>

              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
                {!isLoading && techResourceCommer && techResourceCommer?.[0] && Object?.entries(techResourceCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Technical Resources Commercial"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: techResourceCommer?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>


                {!isLoading && techResourceResid && techResourceResid?.[0] && Object.entries(techResourceResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Technical Resources Residential"
                      sx={{ width: '100%' }}
                    />
                  ))
                }

                <Stack sx={{display: techResourceResid?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: currentTab === 'all' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                }}
              >
                {!isLoading && videos && videos?.[0] && Object?.entries(videos?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={item[1]}
                      title="Videos"
                      sx={{ width: '100%' }}
                    />
                  ))
                }
                <Stack sx={{display: 'grid'}}>
                  <></>
                </Stack>
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

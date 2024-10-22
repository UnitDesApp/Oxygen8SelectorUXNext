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


  let literatureCommerAll = [];
  let literatureResidAll = [];
  let manualCommerAll = [];
  let manualResidAll = [];
  let specificationCommerAll = [];
  let specificationResidAll = [];
  let techResourceCommerAll = [];
  let techResourceResidAll = [];
  let presentationContractorAll = [];
  let presentationEngineerAll = [];
  let presentationSalesAll = [];
  let videosAll = [];

  switch (currentTab) {
    case 'all':
      literatureCommerAll = {
        ...literatureCommer?.[0]?.files?.LiteratureCommercial,
        ...[...(literatureCommer?.[0]?.files?.Nova || []), ...(literatureCommer?.[0]?.files?.Ventum || []),
        ...(literatureCommer?.[0]?.files?.VentumLite || []), ...(literatureCommer?.[0]?.files?.VentumPlus || []),
        ...(literatureCommer?.[0]?.files?.Terra || [])
        ]
      };


      literatureResidAll = {
        ...literatureResid?.[0]?.files?.LiteratureResidential,
        ...[...(literatureResid?.[0]?.files?.Nova || []), ...(literatureResid?.[0]?.files?.Ventum || []),
        ...(literatureResid?.[0]?.files?.VentumLite || []), ...(literatureResid?.[0]?.files?.VentumPlus || []),
        ...(literatureResid?.[0]?.files?.Terra || [])
        ]
      };


      manualCommerAll = {
        ...manualCommer?.[0]?.files?.ManualCommercial,
        ...[...(manualCommer?.[0]?.files?.Nova || []), ...(manualCommer?.[0]?.files?.Ventum || []),
        ...(manualCommer?.[0]?.files?.VentumLite || []), ...(manualCommer?.[0]?.files?.VentumPlus || []),
        ...(manualCommer?.[0]?.files?.Terra || [])
        ]
      };


      manualResidAll = {
        ...manualResid?.[0]?.files?.ManualResidential,
        ...[...(manualResid?.[0]?.files?.Nova || []), ...(manualResid?.[0]?.files?.Ventum || []),
        ...(manualResid?.[0]?.files?.VentumLite || []), ...(manualResid?.[0]?.files?.VentumPlus || []),
        ...(manualResid?.[0]?.files?.Terra || [])
        ]
      };


      specificationCommerAll = {
        ...specificationCommer?.[0]?.files?.SpecificationCommercial,
        ...[...(specificationCommer?.[0]?.files?.Nova || []), ...(specificationCommer?.[0]?.files?.Ventum || []),
        ...(specificationCommer?.[0]?.files?.VentumLite || []), ...(specificationCommer?.[0]?.files?.VentumPlus || []),
        ...(specificationCommer?.[0]?.files?.Terra || [])
        ]
      };


      specificationResidAll = {
        ...specificationResid?.[0]?.files?.SpecificationResidential,
        ...[...(specificationResid?.[0]?.files?.Nova || []), ...(specificationResid?.[0]?.files?.Ventum || []),
        ...(specificationResid?.[0]?.files?.VentumLite || []), ...(specificationResid?.[0]?.files?.VentumPlus || []),
        ...(specificationResid?.[0]?.files?.Terra || [])
        ]
      };


      techResourceCommerAll = {
        ...techResourceCommer?.[0]?.files?.TechResourceCommercial,
        ...[...(techResourceCommer?.[0]?.files?.Nova || []), ...(techResourceCommer?.[0]?.files?.Ventum || []),
        ...(techResourceCommer?.[0]?.files?.VentumLite || []), ...(techResourceCommer?.[0]?.files?.VentumPlus || []),
        ...(techResourceCommer?.[0]?.files?.Terra || [])
        ]
      };


      techResourceResidAll = {
        ...techResourceResid?.[0]?.files?.TechResourceResidential,
        ...[...(techResourceResid?.[0]?.files?.Nova || []), ...(techResourceResid?.[0]?.files?.Ventum || []),
        ...(techResourceResid?.[0]?.files?.VentumLite || []), ...(techResourceResid?.[0]?.files?.VentumPlus || []),
        ...(techResourceResid?.[0]?.files?.Terra || [])
        ]
      };


      videosAll = {
        ...videos?.[0]?.files?.Videos,
        ...[...(videos?.[0]?.files?.Nova || []), ...(videos?.[0]?.files?.Ventum || []),
        ...(videos?.[0]?.files?.VentumLite || []), ...(videos?.[0]?.files?.VentumPlus || []),
        ...(videos?.[0]?.files?.Terra || [])
        ]
      };

      break;
    case 'nova':
      literatureCommerAll = {...literatureCommer?.[0]?.files?.Nova || [],};
      literatureResidAll = {...literatureResid?.[0]?.files?.Nova || [],};
      manualCommerAll = {...manualCommer?.[0]?.files?.Nova || [],};
      manualResidAll = {...manualResid?.[0]?.files?.Nova || [],};
      specificationCommerAll = {...specificationCommer?.[0]?.files?.Nova || [],};
      specificationResidAll = {...specificationResid?.[0]?.files?.Nova || [],};
      techResourceCommerAll = {...techResourceCommer?.[0]?.files?.Nova || [],};
      techResourceResidAll = {...techResourceResid?.[0]?.files?.Nova || [],};
      presentationContractorAll = {...presentationContractor?.[0]?.files?.Nova || [],};
      presentationEngineerAll = {...presentationEngineer?.[0]?.files?.Nova || [],};
      presentationSalesAll = {...presentationSales?.[0]?.files?.Nova || [],};
      videosAll = {...videos?.[0]?.files?.Nova || [],};
      break;
    case 'ventum':
      literatureCommerAll = {...literatureCommer?.[0]?.files?.Ventum || [],};
      literatureResidAll = {...literatureResid?.[0]?.files?.Ventum || [],};
      manualCommerAll = {...manualCommer?.[0]?.files?.Ventum || [],};
      manualResidAll = {...manualResid?.[0]?.files?.Ventum || [],};
      specificationCommerAll = {...specificationCommer?.[0]?.files?.Ventum || [],};
      specificationResidAll = {...specificationResid?.[0]?.files?.Ventum || [],};
      techResourceCommerAll = {...techResourceCommer?.[0]?.files?.Ventum || [],};
      techResourceResidAll = {...techResourceResid?.[0]?.files?.Ventum || [],};
      presentationContractorAll = {...presentationContractor?.[0]?.files?.Ventum || [],};
      presentationEngineerAll = {...presentationEngineer?.[0]?.files?.Ventum || [],};
      presentationSalesAll = {...presentationSales?.[0]?.files?.Ventum || [],};
      videosAll = {...videos?.[0]?.files?.Ventum || [],};
      break;
    case 'ventum_lite':
      literatureCommerAll = {...literatureCommer?.[0]?.files?.VentumLite || [],};
      literatureResidAll = {...literatureResid?.[0]?.files?.VentumLite || [],};
      manualCommerAll = {...manualCommer?.[0]?.files?.VentumLite || [],};
      manualResidAll = {...manualResid?.[0]?.files?.VentumLite || [],};
      specificationCommerAll = {...specificationCommer?.[0]?.files?.VentumLite || [],};
      specificationResidAll = {...specificationResid?.[0]?.files?.VentumLite || [],};
      techResourceCommerAll = {...techResourceCommer?.[0]?.files?.VentumLite || [],};
      techResourceResidAll = {...techResourceResid?.[0]?.files?.VentumLite || [],};
      presentationContractorAll = {...presentationContractor?.[0]?.files?.VentumLite || [],};
      presentationEngineerAll = {...presentationEngineer?.[0]?.files?.VentumLite || [],};
      presentationSalesAll = {...presentationSales?.[0]?.files?.VentumLite || [],};
      videosAll = {...videos?.[0]?.files?.VentumLite || [],};
      break;
    case 'ventum_plus':
      literatureCommerAll = {...literatureCommer?.[0]?.files?.VentumPlus || [],};
      literatureResidAll = {...literatureResid?.[0]?.files?.VentumPlus || [],};
      manualCommerAll = {...manualCommer?.[0]?.files?.VentumPlus || [],};
      manualResidAll = {...manualResid?.[0]?.files?.VentumPlus || [],};
      specificationCommerAll = {...specificationCommer?.[0]?.files?.VentumPlus || [],};
      specificationResidAll = {...specificationResid?.[0]?.files?.VentumPlus || [],};
      techResourceCommerAll = {...techResourceCommer?.[0]?.files?.VentumPlus || [],};
      techResourceResidAll = {...techResourceResid?.[0]?.files?.VentumPlus || [],};
      presentationContractorAll = {...presentationContractor?.[0]?.files?.VentumPlus || [],};
      presentationEngineerAll = {...presentationEngineer?.[0]?.files?.VentumPlus || [],};
      presentationSalesAll = {...presentationSales?.[0]?.files?.VentumPlus || [],};
      videosAll = {...videos?.[0]?.files?.VentumPlus || [],};
      break;
    case 'terra':
      literatureCommerAll = {...literatureCommer?.[0]?.files?.Terra || []};
      literatureResidAll = {...literatureResid?.[0]?.files?.Terra || [],};
      manualCommerAll = {...manualCommer?.[0]?.files?.Terra || [],};
      manualResidAll = {...manualResid?.[0]?.files?.Terra || [],};
      specificationCommerAll = {...specificationCommer?.[0]?.files?.Terra || [],};
      specificationResidAll = {...specificationResid?.[0]?.files?.Terra || [],};
      techResourceCommerAll = {...techResourceCommer?.[0]?.files?.Terra || [],};
      techResourceResidAll = {...techResourceResid?.[0]?.files?.Terra || [],};
      presentationContractorAll = {...presentationContractor?.[0]?.files?.Terra || [],};
      presentationEngineerAll = {...presentationEngineer?.[0]?.files?.Terra || [],};
      presentationSalesAll = {...presentationSales?.[0]?.files?.Terra || [],};
      videosAll = {...videos?.[0]?.files?.Terra || [],};
      break;  
    default:
      break
  }

// const literatureCommerAll = {
//   ...literatureCommer?.[0]?.files?.LiteratureCommercial,
//   ...[
//     ...(literatureCommer?.[0]?.files?.Nova || []),
//     ...(literatureCommer?.[0]?.files?.Ventum || []),
//     ...(literatureCommer?.[0]?.files?.VentumLite || []),
//     ...(literatureCommer?.[0]?.files?.VentumPlus || []),
//     ...(literatureCommer?.[0]?.files?.Terra || [])
//   ]
// };



  const arrLiteratureCommerAll : any = []; 
  if (typeof literatureCommerAll === 'object' && literatureCommerAll !== null) {
    arrLiteratureCommerAll.push(...Object.values(literatureCommerAll));
  }

  const arrLiteratureResidAll : any = []; 
  if (typeof literatureResidAll  === 'object' && literatureResidAll  !== null) {
    arrLiteratureResidAll.push(...Object.values(literatureResidAll ));
  }

  const arrManualCommerAll : any = []; 
  if (typeof manualCommerAll  === 'object' && manualCommerAll  !== null) {
    arrManualCommerAll.push(...Object.values(manualCommerAll ));
  }

  const arrManualResidAll : any = []; 
  if (typeof manualResidAll  === 'object' && manualResidAll  !== null) {
    arrManualResidAll.push(...Object.values(manualResidAll ));
  }

  const arrSpecificationCommerAll : any = []; 
  if (typeof specificationCommerAll  === 'object' && specificationCommerAll  !== null) {
    arrSpecificationCommerAll.push(...Object.values(specificationCommerAll ));
  }

  const arrSpecificationResidAll : any = []; 
  if (typeof specificationResidAll   === 'object' && specificationResidAll   !== null) {
    arrSpecificationResidAll.push(...Object.values(specificationResidAll  ));
  }

  const arrTechResourceCommerAll : any = []; 
  if (typeof techResourceCommerAll  === 'object' && techResourceCommerAll  !== null) {
    arrTechResourceCommerAll.push(...Object.values(techResourceCommerAll ));
  }

  const arrTechResourceResidAll : any = []; 
  if (typeof techResourceResidAll  === 'object' && techResourceResidAll  !== null) {
    arrTechResourceResidAll.push(...Object.values(techResourceResidAll ));
  }


  const arrPresentationContractorAll : any = []; 
  if (typeof presentationContractorAll  === 'object' && presentationContractorAll  !== null) {
    arrPresentationContractorAll.push(...Object.values(presentationContractorAll ));
  }

  const arrPresentationEngineerAll : any = []; 
  if (typeof presentationEngineerAll   === 'object' && presentationEngineerAll   !== null) {
    arrPresentationEngineerAll.push(...Object.values(presentationEngineerAll  ));
  }


  const arrPresentationSalesAll : any = []; 
  if (typeof presentationSalesAll   === 'object' && presentationSalesAll   !== null) {
    arrPresentationSalesAll.push(...Object.values(presentationSalesAll  ));
  }


  const arrVideosAll : any = []; 
  if (typeof videosAll   === 'object' && videosAll   !== null) {
    arrVideosAll.push(...Object.values(videosAll  ));
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
                {!isLoading && arrLiteratureCommerAll && Object.entries([arrLiteratureCommerAll])?.map((item: any, i) =>
                  // (item[0] === currentTab || currentTab === 'all') && arrliteratureCommerAll.length > 0 && (
                  arrLiteratureCommerAll.length > 0 && (
                    <ResourceTable
                      key={i}
                      resourceType={item[0]}
                      objResources={arrLiteratureCommerAll}
                      title="Literature & Brochures Commercial"
                      sx={{ width: '100%' }}
                    />
                  )
            )
            }
                <Stack sx={{display: literatureCommer?.[0]?.length === 0 ? 'grid' : 'none' }}>
                  <></>
                </Stack>


                {/* {!isLoading && literatureResid && literatureResid?.[0] && Object.entries(literatureResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                {!isLoading && arrLiteratureResidAll  && Object.entries([arrLiteratureResidAll ])?.map((item: any, i) =>
                  arrLiteratureResidAll .length > 0 && (
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
                {/* {!isLoading && manualCommer && manualCommer?.[0] && Object.entries(manualCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrManualCommerAll  && Object.entries([arrManualCommerAll ])?.map((item: any, i) =>
                      arrManualCommerAll .length > 0 && (
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


                {/* {!isLoading && manualResid && manualResid?.[0] && Object.entries(manualResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                {!isLoading && arrManualResidAll  && Object.entries([arrManualResidAll ])?.map((item: any, i) =>
                      arrManualResidAll .length > 0 && (
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
                {/* {!isLoading && specificationCommer && specificationCommer?.[0] && Object?.entries(specificationCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrSpecificationCommerAll  && Object.entries([arrSpecificationCommerAll ])?.map((item: any, i) =>
                      arrSpecificationCommerAll .length > 0 && (
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

                {/* {!isLoading && specificationResid && specificationResid?.[0] && Object.entries(specificationResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrSpecificationResidAll  && Object.entries([arrSpecificationResidAll ])?.map((item: any, i) =>
                      arrSpecificationResidAll .length > 0 && (
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
                {/* {!isLoading && techResourceCommer && techResourceCommer?.[0] && Object?.entries(techResourceCommer?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrTechResourceCommerAll  && Object.entries([arrTechResourceCommerAll ])?.map((item: any, i) =>
                      arrTechResourceCommerAll .length > 0 && (
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


                {/* {!isLoading && techResourceResid && techResourceResid?.[0] && Object.entries(techResourceResid?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrTechResourceResidAll  && Object.entries([arrTechResourceResidAll ])?.map((item: any, i) =>
                      arrTechResourceResidAll .length > 0 && (
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
                {/* {!isLoading && videos && videos?.[0] && Object?.entries(videos?.[0]?.files)?.map((item: any, i) =>
                  (item[0] === currentTab || currentTab === 'all') && item[1].length > 0 && ( */}
                    {!isLoading && arrVideosAll   && Object.entries([arrVideosAll  ])?.map((item: any, i) =>
                      arrVideosAll .length > 0 && (
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

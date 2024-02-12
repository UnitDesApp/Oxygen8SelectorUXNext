import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { useGetQuoteInfo } from 'src/hooks/useApi';
import ProjectQuoteForm from './ProjectQuoteForm';

// --------------------------------------------------------------
const CustomGroupBoxBorder = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '0',
  padding: '10px',
  margin: '0',
  verticalAlign: 'top',
  width: '100%',
  border: `1px solid ${theme.palette.grey[500]}`,
  borderRadius: '8px',
}));

const CustomGroupBoxTitle = styled(Typography)(() => ({
  lineHeight: '1.4375em',
  fontSize: '25px',
  fontFamily: '"Public Sans", sans-serif',
  fontWeight: 400,
  display: 'block',
  transformOrigin: 'left top',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(133% - 24px)',
  position: 'absolute',
  left: '0px',
  top: '0px',
  transform: 'translate(40px, -12px) scale(0.75)',
  transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms',
  zIndex: 100,
  background: 'white',
  paddingLeft: '10px',
  paddingRight: '10px',
}));

// -------------------------------------------------------------------------------

type CustomGroupBoxProps = {
  title?: string;
  children?: any;
  bordersx?: object;
  titlesx?: object;
};

function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
      <Box sx={{ padding: '20px' }}>{children}</Box>
    </CustomGroupBoxBorder>
  );
}

export default function ProjectQuote() {
  const { projectId } = useRouter().query;
  const [isGenerate, setIsGenerate] = useState<boolean>(false);
  const [isNoUnit, setIsNoUnit] = useState<boolean>(false);

  const theme = useTheme();

  const {
    data: quoteInfo,
    isLoading: isLoadingQuoteInfo,
    refetch,
  } = useGetQuoteInfo({
    intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobID: Number(projectId),
    intUnitNo: 1,
  });

  const {
    controlInfo,
    initControlInfo,
    pricingTotal,
    pricingGeneral: gvPricingGeneral,
    pricingUnits: gvPricingUnits,
    pricingMisc: gvPricingMisc,
    pricingShipping: gvPricingShipping,
    gvMisc,
    gvNotes,
  } = quoteInfo || {
    controlInfo: {},
    initControlInfo: {},
    pricingTotal: {},
    pricingUnits: {},
    pricingShipping: {},
    pricingMisc: {},
    gvMisc: {},
    gvNotes: {},
    pricingGeneral: {},
  };

  const handleGenerate = () => {
    setIsGenerate(true);
  };

  if (isLoadingQuoteInfo) return <LinearProgress color="info" />;

  if (!isGenerate)
    return (
      <Container>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
          <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
            Select a stage to generate a quote
          </Typography>
          <Button
            onClick={handleGenerate}
            color="primary"
            variant="contained"
            endIcon={<Iconify icon="ooui:arrow-next-ltr" />}
          >
            Generate Group
          </Button>
        </Stack>
        <Snackbar
          open={isNoUnit}
          autoHideDuration={6000}
          onClose={() => {
            setIsNoUnit(false);
          }}
        >
          <Alert
            onClose={() => {
              setIsNoUnit(false);
            }}
            severity="error"
            sx={{ width: '100%' }}
          >
            No Unit! Please add new unit to generate Quote!
          </Alert>
        </Snackbar>
      </Container>
    );

  return (
    <ProjectQuoteForm
      projectId={Number(projectId)}
      quoteControlInfo={{
        ddlCountry: initControlInfo.ddlCountry,
        ddlFOB_Point: initControlInfo.ddlFOB_Point,
        ddlQuoteStage: initControlInfo.ddlQuoteStage,
        ddlCountryEnabled: quoteInfo.ddlCountryEnabled,
        ddlFOB_PointEnabled: quoteInfo.ddlFOB_PointEnabled,
        divFinalPricingVisible: quoteInfo.divFinalPricingVisible,
        divMiscVisible: quoteInfo.divMiscVisible,
        divNotesVisible: quoteInfo.divNotesVisible,
        divPricingGeneralVisible: quoteInfo.divPricingGeneralVisible,
        divPricingSettingsVisible: quoteInfo.divPricingSettingsVisible,
        divPricingVisible: quoteInfo.divPricingVisible,
        gvNotesVisible: quoteInfo.gvNotesVisible,
        gvPricingMiscVisible: quoteInfo.gvPricingMiscVisible,
      }}
      quoteFormInfo={{
        txbRevisionNo: controlInfo?.txbRevisionNo || '0',
        txbProjectName: controlInfo.txbProjectName,
        txbQuoteNo: controlInfo?.txbQuoteNo || '0',
        txbTerms: 'Net 30',
        txbCreatedDate: controlInfo?.txbCreatedDate || initControlInfo?.txbCreatedDate,
        txbRevisedDate: controlInfo?.txbRevisedDate || initControlInfo?.txbRevisedDate,
        txbValidDate: controlInfo?.txbValidDate || initControlInfo?.txbValidDate,
        txbCurrencyRate: controlInfo?.txbCurrencyRate || '0',
        txbShippingFactor: controlInfo?.txbShippingFactor || '0',
        txbDiscountFactor: controlInfo?.txbDiscountFactor || '0',
        txbPriceAllUnits: controlInfo.txbPriceAllUnits || pricingTotal?.txbPriceAllUnits || '0',
        txbPriceMisc: controlInfo.txbPriceMisc || pricingTotal?.txbPriceMisc || '0',
        txbPriceShipping: controlInfo.txbPriceShipping || pricingTotal?.txbPriceShipping || '0',
        txbPriceSubtotal: controlInfo.txbPriceSubtotal || pricingTotal?.txbPriceSubtotal || '0',
        txbPriceDiscount: controlInfo.txbPriceDiscount || pricingTotal?.txbPriceDiscount || '0',
        txbPriceFinalTotal:
          controlInfo.txbPriceFinalTotal || pricingTotal?.txbPriceFinalTotal || '0',
        ddlQuoteStageVal: controlInfo.ddlQuoteStageVal || '1',
        ddlFOB_PointVal: controlInfo.ddlFOB_PointVal || '1',
        ddlCountryVal: controlInfo.ddlCountryVal || '2',
        ddlShippingTypeVal: controlInfo.ddlShippingTypeVal || '1',
        ddlDiscountTypeVal: controlInfo.ddlDiscountTypeVal || '2',
      }}
      gvPricingGeneral={gvPricingGeneral}
      gvPricingUnits={gvPricingUnits}
      gvPricingTotal={quoteInfo.pricingTotal}
      gvMisc={gvMisc}
      gvNotes={gvNotes}
      refetch={refetch}
    />
  );
}

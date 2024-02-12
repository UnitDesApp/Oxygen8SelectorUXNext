import * as Yup from 'yup';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useApiContext } from 'src/contexts/ApiContext';
import { LoadingButton } from '@mui/lab';
import QuoteMiscDataTable from './QuoteMiscDataTable';
import QuoteNoteDataTable from './QuoteNoteDataTable';

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
// -------------------------------------------------
type ProjectQuoteFormProps = {
  projectId?: number;
  quoteControlInfo?: any;
  quoteFormInfo?: any;
  gvPricingGeneral?: any;
  gvPricingUnits?: any;
  gvPricingTotal?: any;
  gvMisc?: any;
  gvNotes?: any;
  refetch?: Function;
};

export default function ProjectQuoteForm({
  projectId,
  quoteControlInfo,
  quoteFormInfo,
  gvPricingGeneral,
  gvPricingUnits,
  gvPricingTotal,
  gvMisc,
  gvNotes,
  refetch,
}: ProjectQuoteFormProps) {
  const api = useApiContext();

  // status
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);

  // Form Schema
  const UpdateJobInfoSchema = Yup.object().shape({
    txbRevisionNo: Yup.string().required('This field is required!'),
    txbProjectName: Yup.string().required('This field is required!'),
    txbQuoteNo: Yup.string().required('This field is required!'),
    txbTerms: Yup.string(),
    txbCreatedDate: Yup.string(),
    txbRevisedDate: Yup.string(),
    txbValidDate: Yup.string(),
    txbCurrencyRate: Yup.string().required('This field is required!'),
    txbShippingFactor: Yup.string().required('This field is required!'),
    txbPriceShipping: Yup.string().required('This field is required!'),
    txbDiscountFactor: Yup.string().required('This field is required!'),
    txbPriceDiscount: Yup.string().required('This field is required!'),
    txbPriceAllUnits: Yup.string().required('This field is required!'),
    txbPriceMisc: Yup.string().required('This field is required!'),
    txbPriceSubtotal: Yup.string().required('This field is required!'),
    txbPriceFinalTotal: Yup.string().required('This field is required!'),
    ddlQuoteStageVal: Yup.string().required('This field is required!'),
    ddlFOB_PointVal: Yup.string().required('This field is required!'),
    ddlCountryVal: Yup.string().required('This field is required!'),
    ddlShippingTypeVal: Yup.string().required('This field is required!'),
    ddlDiscountTypeVal: Yup.string().required('This field is required!'),
  });

  // default values for form depend on redux
  const defaultValues = useMemo(
    () => ({
      txbRevisionNo: quoteFormInfo?.txbRevisionNo || '',
      txbProjectName: quoteFormInfo?.txbProjectName || '',
      txbQuoteNo: quoteFormInfo?.txbQuoteNo || '',
      txbTerms: quoteFormInfo?.txbTerms || '',
      txbCreatedDate: quoteFormInfo?.txbCreatedDate || '',
      txbRevisedDate: quoteFormInfo?.txbRevisedDate || '',
      txbValidDate: quoteFormInfo?.txbValidDate || '',
      txbCurrencyRate: quoteFormInfo?.txbCurrencyRate || '',
      txbShippingFactor: quoteFormInfo?.txbShippingFactor || '',
      txbPriceShipping: quoteFormInfo?.txbPriceShipping || '',
      txbDiscountFactor: quoteFormInfo?.txbDiscountFactor || '',
      txbPriceDiscount: quoteFormInfo?.txbPriceDiscount || '',
      txbPriceAllUnits: quoteFormInfo?.txbPriceAllUnits || '',
      txbPriceMisc: quoteFormInfo?.txbPriceMisc || '',
      txbPriceSubtotal: quoteFormInfo?.txbPriceSubtotal || '',
      txbPriceFinalTotal: quoteFormInfo?.txbPriceFinalTotal || '',
      ddlQuoteStageVal: quoteFormInfo?.ddlQuoteStageVal || '',
      ddlFOB_PointVal: quoteFormInfo?.ddlFOB_PointVal || '',
      ddlCountryVal: quoteFormInfo?.ddlCountryVal || '',
      ddlShippingTypeVal: quoteFormInfo?.ddlShippingTypeVal || '',
      ddlDiscountTypeVal: quoteFormInfo?.ddlDiscountTypeVal || '',
    }),
    [quoteFormInfo]
  );

  // form setting using useForm
  const methods = useForm({
    resolver: yupResolver(UpdateJobInfoSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // submmit function
  const onQuoteSubmit = useCallback(
    async (data: any) => {
      try {
        const quoteData = {
          ...data,
          intUserID: localStorage.getItem('userId'),
          intUAL: localStorage.getItem('UAL'),
          intJobID: projectId,
        };
        const result = await api.project.saveQuoteInfo(quoteData);
        if (result.status === 'success') {
          setSuccess(true);
          if (refetch) refetch();
        } else {
          setFail(true);
        }
      } catch (error) {
        setFail(true);
      }
    },
    [api.project, projectId, refetch]
  );

  // Event handler for addding misc
  const addMisc = useCallback(
    async (objMisc: any) => {
      const data = {
        ...objMisc,
        intJobID: projectId,
      };
      await api.project.addNewMisc(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  const updateMisc = useCallback(
    async (objMisc: any, miscNo: number) => {
      const data = {
        ...objMisc,
        intJobID: projectId,
        miscNo,
      };
      await api.project.updateMisc(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  const deleteMisc = useCallback(
    async (miscNo: number) => {
      const data = {
        intJobID: projectId,
        miscNo,
      };
      await api.project.deleteMisc(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  // Event handler for adding notes
  const addNotes = useCallback(
    async (txbNotes: any) => {
      const data = {
        intJobID: projectId,
        txbNotes,
      };
      await api.project.addNewNotes(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  const updateNotes = useCallback(
    async (txbNotes: any, notesNo: number) => {
      const data = {
        intJobID: projectId,
        txbNotes,
        notesNo,
      };
      await api.project.updateNotes(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  const deleteNotes = useCallback(
    async (notesNo: number) => {
      const data = {
        intJobID: projectId,
        notesNo,
      };
      await api.project.deleteNotes(data);
      if (refetch) refetch();
    },
    [api.project, projectId, refetch]
  );

  return (
    <Container sx={{ mb: '50px' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onQuoteSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Project Info">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFTextField size="small" name="txbRevisionNo" label="Revision No" />
                    <RHFSelect
                      native
                      size="small"
                      name="ddlQuoteStageVal"
                      label="Stage"
                      placeholder=""
                    >
                      <option value="" />
                      {quoteControlInfo?.ddlQuoteStage?.map((ele: any, index: number) => (
                        <option key={index + ele.id} value={ele.id}>
                          {ele.items}
                        </option>
                      ))}
                      <option value="2">USA</option>
                    </RHFSelect>
                    <RHFTextField size="small" name="txbProjectName" label="Project Name" />
                    <RHFTextField size="small" name="txbQuoteNo" label="Quote No" disabled />
                    <RHFSelect
                      native
                      size="small"
                      name="ddlFOB_PointVal"
                      label="F.O.B. Point"
                      placeholder=""
                    >
                      <option value="" />
                      {quoteControlInfo?.ddlFOB_Point?.map((ele: any, index: number) => (
                        <option key={index + ele.id} value={ele.id}>
                          {ele.items}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFTextField size="small" name="txbTerms" label="Terms" disabled />
                    <RHFTextField
                      size="small"
                      name="txbCreatedDate"
                      label="Created Date"
                      disabled
                    />
                    <RHFTextField
                      size="small"
                      name="txbRevisedDate"
                      label="Revised Date"
                      disabled
                    />
                    <RHFTextField size="small" name="txbValidDate" label="Valid Date" disabled />
                  </Box>
                </CustomGroupBox>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Price Setting">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlCountryVal"
                      label="Country"
                      placeholder=""
                    >
                      <option value="" />
                      {quoteControlInfo?.ddlCountry?.map((ele: any, index: number) => (
                        <option key={index + ele.id} value={ele.id}>
                          {ele.items}
                        </option>
                      ))}{' '}
                    </RHFSelect>
                    <RHFTextField size="small" name="txbCurrencyRate" label="Currency Rate" />
                    <Stack direction="row">
                      <RHFTextField size="small" name="txbShippingFactor" label="Shipping" />
                      <RHFSelect
                        native
                        size="small"
                        name="ddlShippingTypeVal"
                        label="Unit"
                        placeholder=""
                      >
                        <option value="" />
                        <option value="1">%</option>
                        <option value="2">$</option>
                      </RHFSelect>
                    </Stack>
                    <Stack direction="row">
                      <RHFTextField size="small" name="txbDiscountFactor" label="Discount" />
                      <RHFSelect
                        native
                        size="small"
                        name="ddlDiscountTypeVal"
                        label="Unit"
                        placeholder=""
                      >
                        <option value="" />
                        <option value="1">%</option>
                        <option value="2">$</option>
                      </RHFSelect>
                    </Stack>
                  </Box>
                </CustomGroupBox>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Final Pricing">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFTextField
                      size="small"
                      name="txbPriceAllUnits"
                      label="Price All Units ($)"
                    />
                    <RHFTextField size="small" name="txbPriceMisc" label="Price Misc ($)" />
                    <RHFTextField size="small" name="txbPriceShipping" label="Shipping ($)" />
                    <RHFTextField size="small" name="txbPriceSubtotal" label="Sub Total ($)" />
                    <RHFTextField size="small" name="txbPriceDiscount" label="Discount ($)" />
                    <RHFTextField size="small" name="txbPriceFinalTotal" label="Final Total ($)" />
                  </Box>
                </CustomGroupBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CustomGroupBox title="">
              <TableContainer component={Paper}>
                <Scrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row" align="left">
                          NOTES
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          F.O.B. POINT
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          TERMS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gvPricingGeneral?.gvPricingGeneralDataSource?.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell
                            dangerouslySetInnerHTML={{ __html: item.notes }}
                            component="th"
                            scope="row"
                            align="left"
                          />
                          <TableCell
                            dangerouslySetInnerHTML={{ __html: item.fob_point }}
                            component="th"
                            scope="row"
                            align="left"
                          />
                          <TableCell
                            dangerouslySetInnerHTML={{ __html: item.terms }}
                            component="th"
                            scope="row"
                            align="left"
                          />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </CustomGroupBox>
          </Grid>
          <Grid item xs={12}>
            {gvPricingUnits?.gvPricingErrMsgDataSource?.map((msg: any) => (
              <Typography sx={{ color: 'red' }} key={msg.price_error_msg_no}>
                {msg.price_error_msg}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <CustomGroupBox>
              <TableContainer component={Paper}>
                <Scrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row" align="left">
                          No.
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          TAG
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          QTY
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          PRODUCT CODE
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          MODEL NUMBER
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          DESCRIPTION
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          UNIT PRICE
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          AMOUNT
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gvPricingUnits?.gvPricingDataSource?.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': {
                              border: 0,
                              color: parseInt(item.price_error_msg, 10) === 2 ? 'red' : 'black',
                            },
                          }}
                        >
                          <TableCell component="th" scope="row" align="left">
                            {i + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.tag}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.qty}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_type}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_model}
                          </TableCell>
                          <TableCell
                            dangerouslySetInnerHTML={{ __html: item.description }}
                            component="th"
                            scope="row"
                            align="left"
                          />
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_price}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </CustomGroupBox>
          </Grid>
          <Grid item xs={12}>
            <CustomGroupBox>
              {gvPricingTotal?.gvAddInfoDataSource?.map((item: any, i: number) => (
                <Typography key={i} sx={{ fontWeight: item.is_add_info_bold ? 600 : 300 }}>
                  {item.add_info}
                </Typography>
              ))}
            </CustomGroupBox>
          </Grid>
          <Grid item xs={12}>
            <CustomGroupBox title="Added Miscellaneous">
              <QuoteMiscDataTable
                tableData={gvMisc?.gvMiscDataSource}
                addRow={addMisc}
                updateRow={updateMisc}
                deleteRow={deleteMisc}
              />
            </CustomGroupBox>
          </Grid>
          <Grid item xs={12}>
            <CustomGroupBox title="Added Note">
              <QuoteNoteDataTable
                tableData={gvNotes?.gvNotesDataSource}
                addRow={addNotes}
                updateRow={updateNotes}
                deleteRow={deleteNotes}
              />
            </CustomGroupBox>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                type="submit"
                startIcon={<Iconify icon="fluent:save-24-regular" />}
                loading={isSubmitting}
                sx={{ width: '150px' }}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Submittal Information Saved!
        </Alert>
      </Snackbar>
      <Snackbar
        open={fail}
        autoHideDuration={6000}
        onClose={() => {
          setFail(false);
        }}
      >
        <Alert
          onClose={() => {
            setFail(false);
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          Server Error!
        </Alert>
      </Snackbar>
    </Container>
  );
}

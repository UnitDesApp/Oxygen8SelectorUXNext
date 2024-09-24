import { useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useGetAllUnits, useGetSubmittalInfo } from 'src/hooks/useApi';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProjectStatus() {
  const { projectId } = useRouter().query;
  const theme = useTheme();

  const { data: units, isLoading: isLoadingUnits } = useGetAllUnits({
    jobId: Number(projectId),
  });

  const { data: submitallInfo, isLoading: isLoadingSubmittalInfo } = useGetSubmittalInfo({
    intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobID: projectId,
  });

  const isCompletedJobInfo = true;
  const isAddedUnits = units?.length > 0;
  const isMadeASelection = isAddedUnits;

  const isSubmitDrawing = useMemo(
    () => !!submitallInfo?.ckbBACNetPointList,
    [submitallInfo?.ckbBACNetPointList]
  );

  const isNoteAdded = useMemo(
    () => submitallInfo?.gvNotes?.gvNotesDataSource?.length > 0,
    [submitallInfo?.gvNotes?.gvNotesDataSource?.length]
  );

  const isShippingNoteAdded = useMemo(
    () => submitallInfo?.gvShippingNotes?.gvShippingNotesDataSource?.length > 0,
    [submitallInfo?.gvShippingNotes?.gvShippingNotesDataSource?.length]
  );

  const isLoading = useMemo(
    () => isLoadingUnits || isLoadingSubmittalInfo,
    [isLoadingUnits, isLoadingSubmittalInfo]
  );

  if (isLoading) return <LinearProgress color="info" />;
  if (!submitallInfo)
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: '30px' }}>
        <Box sx={{ fontSize: '30px' }}>Unable to lead submittal data due to NO UNIT!</Box>{' '}
      </Stack>
    );

  return (
    <Box sx={{ paddingTop: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ color: theme.palette.primary.main }} variant="outlined">
            <CardHeader title="Project Status" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isCompletedJobInfo ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isCompletedJobInfo
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 1" secondary="Complete job info" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${isAddedUnits ? 'check-circle' : 'cancel'}-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isAddedUnits ? theme.palette.info.light : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 2" secondary="Add units" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isMadeASelection ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',

                        color: isMadeASelection
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 3" secondary="Get a selection" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isSubmitDrawing ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isSubmitDrawing
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 4" secondary="Submit drawings" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ color: theme.palette.primary.main }} variant="outlined">
            <CardHeader
              title="Submittal Status"
              subheader="To request a submittal, you must complete the following 4 steps"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isSubmitDrawing ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isSubmitDrawing
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 1" secondary="Completed Summary" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isSubmitDrawing ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isSubmitDrawing
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 2" secondary="Completed Ship To Address" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${
                        isShippingNoteAdded ? 'check-circle' : 'cancel'
                      }-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isShippingNoteAdded
                          ? theme.palette.info.light
                          : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 3" secondary="Added Shipping Instruction" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Iconify
                      color="success"
                      icon={`material-symbols:${isNoteAdded ? 'check-circle' : 'cancel'}-outline`}
                      sx={{
                        width: '30px',
                        height: '30px',
                        color: isNoteAdded ? theme.palette.info.light : theme.palette.error.main,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Step 4" secondary="Added Notes" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

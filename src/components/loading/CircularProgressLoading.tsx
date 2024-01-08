import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularProgressLoading() {
  return (
    <Stack
      sx={{ color: 'grey.500', width: '100%', height: '100%', pt: '120px' }}
      justifyContent="center"
      alignItems="center"
      spacing={1}
      direction="column"
    >
      <CircularProgress />
      <p>
        <i>Please wait for a moment...</i>
      </p>
    </Stack>
  );
}

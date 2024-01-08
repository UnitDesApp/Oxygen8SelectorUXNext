// @mui
import { TableRow, TableCell, Box, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

type TableLoadingData = {
  isLoading: boolean;
};

export default function TableLoadingData({ isLoading }: TableLoadingData) {
  return (
    <TableRow>
      {isLoading ? (
        <TableCell colSpan={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <CircularProgress size="lg" />
          </Box>
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}

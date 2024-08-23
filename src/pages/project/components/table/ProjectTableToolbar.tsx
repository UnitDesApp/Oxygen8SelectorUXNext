import React, { useCallback } from 'react';
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify/Iconify';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type ProjectTableToolbarProps = {
  filterName: string;
  onFilterName: (value: string) => void;
  onFilterRole: (value: string) => void;
  optionsRole: string[];
  onOpneDialog: () => void;
};

export default function ProjectTableToolbar({
  filterName,
  onFilterName,
  onFilterRole,
  optionsRole,
  onOpneDialog,
}: ProjectTableToolbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { user } = useAuthContext();
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(
    (event: any) => {
      onFilterRole(event);
      setAnchorEl(null);
    },
    [onFilterRole]
  );

  return (
    <Stack
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <Item sx={{ width: { md: '20%', xs: '100%' } }}>
        <Button
          id="role"
          sx={{ fontSize: '16px' }}
          onClick={handleClick}
          startIcon={<Iconify icon="codicon:filter-filled" />}
        >
          Filter
        </Button>
        <Menu
          id="role"
          MenuListProps={{
            'aria-labelledby': 'role',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose('All')}
          PaperProps={{
            style: {
              maxHeight: '300px',
              width: '20ch',
            },
          }}
        >
          {optionsRole?.map((option, key) => (
            <MenuItem
              key={key}
              value={option}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
              onClick={(event: any) => handleClose(event.target.attributes.value.value)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Item>
      <Item sx={{ width: { md: '60%', xs: '100%' } }}>
        <TextField
          fullWidth
          size="small"
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Search Project"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Item>
      <Item sx={{ width: { md: '20%', xs: '100%' } }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={onOpneDialog}
        >
          Create New Project
        </Button>
      </Item>
    </Stack>
  );
}

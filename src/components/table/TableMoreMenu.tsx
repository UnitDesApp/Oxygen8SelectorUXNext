import PropTypes from 'prop-types';
// @mui
import { IconButton } from '@mui/material';
import Iconify from '../iconify';
import { MouseEventHandler } from 'react';
import MenuPopover from '../menu-popover/MenuPopover';
//

// ----------------------------------------------------------------------

type TableMoreMenu = {
  actions: any;
  open: any;
  onClose: MouseEventHandler<HTMLAnchorElement>;
  onOpen: (value: any) => void;
};

export default function TableMoreMenu({ actions, open, onClose, onOpen }: TableMoreMenu) {
  return (
    <>
      <IconButton onClick={onOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={open}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}

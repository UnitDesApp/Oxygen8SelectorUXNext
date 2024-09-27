// @mui
import { BreadcrumbsProps } from '@mui/material';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

export type BreadcrumbsLinkProps = {
  name?: string;
  href?: string;
  icon?: React.ReactElement;
};

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading: string | ReactNode;
  moreLink?: string[];
  activeLast?: boolean;
  action?: React.ReactNode;
  links: BreadcrumbsLinkProps[];
}

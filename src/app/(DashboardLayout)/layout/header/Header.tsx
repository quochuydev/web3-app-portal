import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import Logo from '../shared/logo/Logo';
import { DepositButton } from '@/components/header/DepositButton';
import { PortfolioInfo } from '@/components/header/PortfolioInfo';
import { CashInfo } from '@/components/header/CashInfo';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
            mr: 2
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* Logo */}
        <Box sx={{ 
          display: { xs: 'none', lg: 'block' },
          mr: 4 
        }}>
          <Logo />
        </Box>

        <Box flexGrow={1} />

        {/* Desktop Header Items */}
        <Stack 
          spacing={3} 
          direction="row" 
          alignItems="center"
          sx={{ 
            display: { xs: 'none', md: 'flex' } 
          }}
        >
          <DepositButton />
          <PortfolioInfo />
          <Divider orientation="vertical" flexItem sx={{ height: 40 }} />
          <CashInfo />
          <IconButton
            size="large"
            aria-label="notifications"
            color="inherit"
          >
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
          <Profile />
        </Stack>

        {/* Mobile Header Items */}
        <Stack 
          spacing={1} 
          direction="row" 
          alignItems="center"
          sx={{ 
            display: { xs: 'flex', md: 'none' } 
          }}
        >
          <DepositButton />
          <IconButton
            size="large"
            aria-label="notifications"
            color="inherit"
          >
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;

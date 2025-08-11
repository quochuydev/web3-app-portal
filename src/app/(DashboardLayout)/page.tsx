'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { MetaMaskLogin } from '@/components/MetaMaskLogin';

const Dashboard = () => {
  return (
    <PageContainer title="Web3 Portal" description="Connect your MetaMask wallet">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Web3 Portal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your gateway to decentralized applications
        </Typography>
      </Box>
      
      <MetaMaskLogin />
    </PageContainer>
  );
}

export default Dashboard;

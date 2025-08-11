'use client'

import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import {
  AccountBalanceWallet,
  CreditCard,
  SwapHoriz,
  Close
} from '@mui/icons-material'

export function DepositButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const depositOptions = [
    {
      title: 'Deposit via MetaMask',
      description: 'Use your connected wallet to deposit crypto',
      icon: <AccountBalanceWallet />,
      action: () => {
        console.log('Deposit via MetaMask')
        handleClose()
      }
    },
    {
      title: 'Deposit with Card',
      description: 'Buy crypto with credit/debit card (Stripe, MoonPay)',
      icon: <CreditCard />,
      action: () => {
        console.log('Deposit with card')
        handleClose()
      }
    },
    {
      title: 'Crypto Transfer',
      description: 'Transfer from another wallet or exchange',
      icon: <SwapHoriz />,
      action: () => {
        console.log('Crypto transfer')
        handleClose()
      }
    }
  ]

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2
        }}
      >
        Deposit
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Add Funds
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Choose how you&apos;d like to add funds to your account
          </Typography>
          
          <List sx={{ p: 0 }}>
            {depositOptions.map((option, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={option.action}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.light'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {option.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  )
}
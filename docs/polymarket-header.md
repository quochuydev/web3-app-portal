# 🖥 Header UI Implementation

## 🎯 Overview

The header is the top navigation bar that:

- Displays brand logo
- Shows user wallet & profile status
- Use component/styles in code base

---

## 🧩 Component Structure

### 1. `<Header />`

- Clone current Header component, based in that implementation do this task

- **Children:**
  - `<Logo />`
  - `<DepositButton />`
    - Displaying Deposit modal (via MetaMask, Transfer crypto, Deposit with cash)
  - `<PortfolioInfo />` (Display USD balance are in betting)
  - `<CashInfo />` (Display cash balance are available to bet)
  - `<UserPopover />`

---

### 2. `<DepositButton />`

- Opens modal for:
  - Deposit via connected wallet
  - Deposit via on-ramp (Stripe, MoonPay, Transak)
  - Deposit via crypto transfer
- Shows:
  - "Deposit" button text, color primary

---

### 3. `<PortfolioInfo />`

- Dropdown with:
  - Profile
  - Settings
  - Logout

---

### 4. `<PortfolioInfo />`

- USD color green

---

### 5. `<CashInfo />`

- USD color green

---

## 🎨 Styling Guidelines

- Use MUI components, based on code base
- Responsive:
  - Desktop: full nav
  - Mobile: hamburger menu

---

## ⚙️ Tech Stack & Libraries

| Feature          | Library / Tool |
| ---------------- | -------------- |
| UI               | MUI            |
| State Management | Zustand        |

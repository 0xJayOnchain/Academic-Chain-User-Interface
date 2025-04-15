# Student Management dApp

A decentralized application (dApp) for managing student information and course data on the Base Sepolia test network.

## Overview

This application allows educational institutions to store student information and course data on-chain, providing transparency and immutability. The dApp offers features for adding students, managing courses, calculating GPAs, and viewing student details.

## Features

- **Wallet Connection**: Secure connection with MetaMask or other compatible wallets
- **Network Detection**: Automatic detection and switching to Base Sepolia test network
- **Student Management**: Add, update, and remove student records
- **Course Management**: Add and remove courses for each student
- **GPA Calculation**: Automatic calculation of student GPA based on course grades
- **Responsive UI**: Mobile-first design that scales to larger screens

## Pages

1. **Student Management** (`/`): Administrative page to add, edit, and remove students
2. **Student Dashboard** (`/student-dashboard`): Student view showing personal information and courses
3. **Course Management** (`/courses/:studentId`): Add and remove courses for a specific student
4. **Student Details** (`/student/:studentId`): Detailed view of student information and course list

## Technical Stack

- **Frontend**:
  - React (with React Router for navigation)
  - Styled Components for styling
  - Responsive grid layout
  
- **Blockchain Integration**:
  - ethers.js for Web3 connectivity
  - Base Sepolia test network
  - Smart contract interaction

## Smart Contract (Sepolia Network)

- **Contract Address**: `0x9ADe272f23BE03f01CA9b79740094368beec372C`
- **Key Functions**:
  - `addStudent` - Register a new student
  - `updateStudent` - Modify student information
  - `removeStudent` - Delete a student record
  - `addCourse` - Add a course to a student's record
  - `removeCourse` - Remove a course from a student's record
  - `getStudentData` - Retrieve complete student information
  - `getGPA` - Calculate a student's GPA

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/0xJayOnchain/Academic-Chain-User-Interface.git
cd student-management-dapp
```
2. Install dependencies
```bash
yarn install
```
3. Run the development server
```bash
yarn dev 
```
4. Connect your wallet
- Make sure you have MetaMask or a compatible wallet installed
- Connect to the Base Sepolia test network (Chain ID: 84532)
- Ensure you have ETH on Base Sepolia for transaction fees

## UI Components

The application features several reusable styled components:

- **Cards**: Display information in clean, boxed layouts
- **Forms**: Consistent input styling for data entry
- **Buttons**: Action components with semantic colors
- **Grid Layouts**: Responsive designs that adapt to screen sizes
- **Loading States**: Spinners for asynchronous operations
- **Error Handling**: User-friendly error messages

## Development Notes

- The application uses a theme provider for consistent styling
- Wallet connection status and network validation are checked on application load
- Transactions are signed using the connected wallet
- Real-time data updates after blockchain transactions
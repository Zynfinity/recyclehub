// src/layouts/DashboardLayout.jsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Box } from '@chakra-ui/react';

const AppLayout = ({ children }) => {
    return (
        <Box display="flex">
            {/* <Sidebar isDashboard={false} /> */}
            <Box display="flex" flexDir={"column"} flexGrow={1} p={4} gap={6}>
                <Navbar />
                <Box bgColor="white" p={4} rounded="xl">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;

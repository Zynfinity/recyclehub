// src/layouts/DashboardLayout.jsx
"use client";
import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box display="flex" flexDir={"column"} p={4} flexGrow={1} gap={6} overflowX={"hidden"}>
                <Navbar />
                <Box bgColor="white" py={4} px={{ base: 4, md: 4 }} rounded="xl">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;

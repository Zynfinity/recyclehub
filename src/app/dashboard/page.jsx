"use client";
import React, { useEffect, useState } from 'react';
import {
    Text,
    Box,
    Grid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Card,
    CardBody,
    CardHeader,
    Flex,
    useBreakpointValue
} from '@chakra-ui/react';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Dashboard() {
    const [userStats, setUserStats] = useState({
        userCount: 0,
        productCount: 0,
        salesCount: 0,
        topProduct: { name: '', sales: 0 },
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            const data = {
                userCount: 120,
                productCount: 50,
                salesCount: 350,
                topProduct: {
                    name: 'Product A',
                    sales: 150,
                },
            };
            setUserStats(data);
        };
        fetchStatistics();
    }, []);

    return (
        <DashboardLayout>
            <Text as={'h1'} fontSize={'3xl'} fontWeight={'bold'} color={'green.500'} mb={6}>
                Welcome to Your Dashboard
            </Text>

            <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6} mb={6}>
                <Stat
                    borderWidth={1}
                    borderRadius="md"
                    p={4}
                    boxShadow="sm"
                    bg="white"
                    _hover={{ boxShadow: "xl" }}
                    transition="all 0.3s ease"
                >
                    <StatLabel fontWeight="medium" color="gray.500">Total Users</StatLabel>
                    <StatNumber fontSize="3xl" color="green.600">{userStats.userCount}</StatNumber>
                    <StatHelpText>Users registered</StatHelpText>
                </Stat>

                <Stat
                    borderWidth={1}
                    borderRadius="md"
                    p={4}
                    boxShadow="sm"
                    bg="white"
                    _hover={{ boxShadow: "xl" }}
                    transition="all 0.3s ease"
                >
                    <StatLabel fontWeight="medium" color="gray.500">Total Products</StatLabel>
                    <StatNumber fontSize="3xl" color="blue.600">{userStats.productCount}</StatNumber>
                    <StatHelpText>Products available</StatHelpText>
                </Stat>

                <Stat
                    borderWidth={1}
                    borderRadius="md"
                    p={4}
                    boxShadow="sm"
                    bg="white"
                    _hover={{ boxShadow: "xl" }}
                    transition="all 0.3s ease"
                >
                    <StatLabel fontWeight="medium" color="gray.500">Total Sales</StatLabel>
                    <StatNumber fontSize="3xl" color="teal.600">{userStats.salesCount}</StatNumber>
                    <StatHelpText>Total sales made</StatHelpText>
                </Stat>

                <Card
                    bg="white"
                    boxShadow="sm"
                    _hover={{ boxShadow: "xl" }}
                    transition="all 0.3s ease"
                    borderRadius="md"
                >
                    <CardHeader>
                        <Text fontSize="xl" fontWeight="semibold" color="blue.600">Top Selling Product</Text>
                    </CardHeader>
                    <CardBody>
                        <Text fontSize="lg" fontWeight="medium">{userStats.topProduct.name}</Text>
                        <Text mt={1} color="gray.500">Total Sales: {userStats.topProduct.sales}</Text>
                    </CardBody>
                </Card>
            </Grid>
        </DashboardLayout>
    );
}


'use client';
import React, { useEffect, useState } from 'react';
import { MdProductionQuantityLimits } from "react-icons/md";
import { Box, Skeleton, Text } from '@chakra-ui/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from './components/dataTable';
import { columns } from './components/columns';
import useMetadata from '@/hooks/useMetadata';
import { getCategories } from '@/services/category';
import { getUsers } from '@/services/user';


export default function Materials() {
    const [listings, setListings] = useState();
    useMetadata('Produk Saya - RecycleHub');
    useEffect(() => {
        const fetchListings = async () => {
            const data = await getUsers();
            setListings(data);
        };
        fetchListings();
    }, []);
    console.log(listings)
    return (
        <DashboardLayout>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <MdProductionQuantityLimits size={24} />
                <Text as={'h1'} fontSize={{ base: "xl", md: '2xl' }} className='text-red-400' fontWeight={'semibold'} color={'primary'}>Kategori Produk</Text>
            </Box>
            <Box mt={10} w="full" bg={'whitebg'} p={4} rounded={'xl'}>
                <Skeleton isLoaded={!!listings}>
                    {listings && <DataTable columns={columns} data={listings.data} />}
                </Skeleton>
            </Box>
        </DashboardLayout>
    );
};


'use client';
import React, { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Input,
    Textarea,
    Button,
    useToast
} from '@chakra-ui/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MdProductionQuantityLimits } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { createCategory } from '@/services/category'; // Assuming you have a service to create categories
import { useRouter } from 'next/navigation';
import useMetadata from '@/hooks/useMetadata';
import cAlert from '@/theme/swal';

export default function CreateCategory() {
    const toast = useToast();
    const router = useRouter();
    useMetadata('Kategori Baru - RecycleHub');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                created_at: new Date().toISOString(), // Set current timestamp as created_at
            };

            const response = await createCategory(payload); // Send the request to create the category
            if (response.error) {
                cAlert.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Terjadi kesalahan yang tidak terduga'
                })
            } else {
                cAlert.fire({
                    icon: 'success',
                    title: 'Berhasil Membuat Kategori',
                    text: 'Kategori berhasil dibuat'
                }).then(() => {
                    router.push('/dashboard/category'); // Redirect to the categories list
                })
            }
        } catch (error) {
            cAlert.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan yang tidak terduga'
            })
        }
    };

    return (
        <DashboardLayout>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <MdProductionQuantityLimits size={24} />
                <Text as={'h1'} fontSize={{ base: "xl", md: '2xl' }} className='text-red-400' fontWeight={'semibold'} color={'primary'}>Kategori Baru</Text>
            </Box>
            <Flex mt={10} w="full" gap={6} flexDir={{ base: "column" }} as="form" onSubmit={handleSubmit(onSubmit)}>
                <Flex bg={'whitebg'} p={4} rounded={'xl'} w={{ base: "full", lg: "60%" }} h="fit-content" flexDirection={'column'} gap={4} >
                    <Text as={'h2'} fontSize={{ base: "md", md: 'lg' }} className='text-red-400' fontWeight={'medium'} color={'primary'}>Informasi Kategori</Text>
                    <Flex flexDir="column" gap={6}>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Nama Kategori</Text>
                            <Input
                                placeholder="Masukkan Nama Kategori"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("name", { required: "Nama kategori harus diisi" })}
                            />
                            {errors.name && <Text color="red.500" fontSize="sm">{errors.name.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Deskripsi Kategori</Text>
                            <Textarea
                                placeholder="Masukkan Deskripsi Kategori"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("description", { required: "Deskripsi kategori harus diisi" })}
                            />
                            {errors.description && <Text color="red.500" fontSize="sm">{errors.description.message}</Text>}
                        </Box>
                    </Flex>
                </Flex>

                <Flex flexDir={"column"} w={{ base: "full", lg: "40%" }} gap={6}>
                    <Button type='submit' w={'fit-content'} justifySelf={'flex-end'}>Simpan Kategori</Button>
                </Flex>
            </Flex>
        </DashboardLayout>
    );
}

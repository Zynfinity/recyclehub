'use client';
import React, { useEffect, useState } from 'react';
import {
    Box, Flex, Text, Input, Select, Button,
    useToast
} from '@chakra-ui/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MdPerson } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import useMetadata from '@/hooks/useMetadata';
import { getUserById, updateUser } from '@/services/user';  // Assuming these functions are in the user service
import cAlert from '@/theme/swal';

export default function EditUser() {
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const router = useRouter();
    const params = useParams(); // The user ID to edit
    useMetadata('Edit Pengguna - RecycleHub');

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    // Fetch user data when the component is mounted
    useEffect(() => {
        const fetchData = async () => {
            const userRes = await getUserById(params.id);  // Fetch user data using the ID
            if (userRes.data) {
                reset({
                    full_name: userRes.data.full_name,
                    address: userRes.data.address,
                    phone_number: userRes.data.phone_number,
                    role: userRes.data.role,
                    // Other fields remain display-only
                });
            }
            setLoading(false);
        };

        fetchData();
    }, [params.id, reset]);

    // Submit the form data to update the user
    const onSubmit = async (data) => {
        try {
            const response = await updateUser(params.id, data);  // Update user using the ID
            if (response.error) {
                cAlert.fire({
                    icon: 'error',
                    title: 'Gagal mengubah pengguna',
                    text: 'Terjadi kesalahan yang tidak terduga',
                });
            } else {
                cAlert.fire({
                    icon: 'success',
                    title: 'Pengguna berhasil diubah',
                    text: 'Data pengguna berhasil diperbarui.',
                }).then(() => {
                    router.push('/dashboard/users');  // Redirect to users list page after update
                });
            }
        } catch (error) {
            cAlert.fire({
                icon: 'error',
                title: 'Gagal mengubah pengguna',
                text: 'Terjadi kesalahan yang tidak terduga',
            });
        }
    };

    if (loading) return <Text>Loading...</Text>;  // Show loading text until user data is fetched

    return (
        <DashboardLayout>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <MdPerson size={24} />
                <Text as={'h1'} fontSize={{ base: "xl", md: '2xl' }} fontWeight={'semibold'} color={'primary'}>Edit Pengguna</Text>
            </Box>
            <Flex mt={10} w="full" gap={6} flexDir={{ base: "column", lg: "row" }} as="form" onSubmit={handleSubmit(onSubmit)}>
                <Flex bg={'whitebg'} p={4} rounded={'xl'} w={{ base: "full", lg: "60%" }} h="fit-content" flexDirection={'column'} gap={4}>
                    <Text as={'h2'} fontSize={{ base: "md", md: 'lg' }} fontWeight={'medium'} color={'primary'}>Informasi Pengguna</Text>
                    <Flex flexDir="column" gap={6}>
                        {/* Display-only fields */}
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Nama Pengguna</Text>
                            <Input
                                isReadOnly
                                fontSize="sm"
                                type="text"
                                size="lg"
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                value={watch("full_name")}
                            />
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Alamat Pengguna</Text>
                            <Input
                                isReadOnly
                                fontSize="sm"
                                type="text"
                                size="lg"
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                value={watch("address")}
                            />
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Nomor Telepon</Text>
                            <Input
                                isReadOnly
                                fontSize="sm"
                                type="text"
                                size="lg"
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                value={watch("phone_number")}
                            />
                        </Box>
                        {/* Editable Role field */}
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Role Pengguna</Text>
                            <Select
                                fontSize="sm"
                                size="lg"
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("role", { required: "Role pengguna harus diisi" })}
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </Select>
                            {errors.role && <Text color="red.500" fontSize="sm">{errors.role.message}</Text>}
                        </Box>
                    </Flex>
                </Flex>

                <Flex flexDir={"column"} w={{ base: "full", lg: "40%" }} gap={6}>
                    <Button type='submit' w={'fit-content'} justifySelf={'flex-end'}>Simpan</Button>
                </Flex>
            </Flex>
        </DashboardLayout>
    );
}

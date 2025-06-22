"use client";
import { Box, Flex, Text, Input, Button, Link, Select, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import AuthLayout from "@/layouts/AuthLayout";
import useLocationData from "@/hooks/useLocationData";
import { use, useEffect, useState } from "react";
import useMetadata from "@/hooks/useMetadata";
import submitCompleteProfile from "@/services/profile";

const CompleteProfile = () => {
    const router = useRouter();
    const toast = useToast();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    useMetadata('Lengkapi Profil - RecycleHub');
    const selectedProvinceId = watch("province_id");
    const selectedRegencyId = watch("regency_id");
    const selectedDistrictId = watch("district_id");
    useEffect(() => {

    })
    const { provinces, regencies, districts, villages } = useLocationData(
        selectedProvinceId,
        selectedRegencyId,
        selectedDistrictId,
        setValue
    );

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                full_name: data.full_name,
                address: data.address,
                phone_number: data.phone_number,
                province_id: data.province_id,
                regency_id: data.regency_id,
                district_id: data.district_id,
                village_id: data.village_id,
                postal_code: data.postal_code,
            };

            const response = await submitCompleteProfile(payload);

            if (response.error) {
                toast({
                    title: "Gagal Menyimpan Profil",
                    description: response.error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Profil Berhasil Disimpan",
                    description: "Data profil Anda telah diperbarui.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                router.push('/');
            }
        } catch (error) {
            console.error("Error in onSubmit:", error);
            toast({
                title: "Terjadi Kesalahan",
                description: "Terjadi kesalahan yang tidak terduga.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Box bg="white" maxW="md" w="full" p={8} rounded="xl">
                <Text fontSize="2xl" fontWeight="bold" mb={2}>Lengkapi Profil</Text>
                <Text mb={6}>Sebelum melanjutkan, silahkan lengkapi informasi profil Anda.</Text>
                <Flex flexDir="column" gap={6} as="form" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        placeholder="Masukkan Nama Lengkap"
                        fontSize="md"
                        type="text"
                        size="lg"
                        isRequired
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("full_name", { required: "Nama lengkap harus diisi" })}
                    />
                    {errors.full_name && <Text color="red.500" fontSize="sm">{errors.full_name.message}</Text>}
                    <Input
                        placeholder="Masukkan Alamat (Detail Jalan, No. Rumah, RT/RW)"
                        fontSize="md"
                        type="text"
                        size="lg"
                        isRequired
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("address", { required: "Alamat harus diisi" })}
                    />
                    {errors.address && <Text color="red.500" fontSize="sm">{errors.address.message}</Text>}
                    <Input
                        placeholder="Masukkan No. Telepon"
                        fontSize="md"
                        type="tel"
                        size="lg"
                        isRequired
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("phone_number", { required: "No. telepon harus diisi" })}
                    />
                    {errors.phone_number && <Text color="red.500" fontSize="sm">{errors.phone_number.message}</Text>}

                    <Select
                        placeholder="Pilih provinsi"
                        size="lg"
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("province_id", { required: "Provinsi harus diisi" })}
                    >
                        {provinces.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    {errors.province_id && <Text color="red.500" fontSize="sm">{errors.province_id.message}</Text>}

                    <Select
                        placeholder="Pilih kabupaten/kota"
                        size="lg"
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("regency_id", { required: "Kabupaten/kota harus diisi" })}
                        disabled={!selectedProvinceId || regencies.length === 0}
                    >
                        {regencies.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    {errors.regency && <Text color="red.500" fontSize="sm">{errors.regency.message}</Text>}

                    <Select
                        placeholder="Pilih kecamatan"
                        size="lg"
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("district_id", { required: "Kecamatan harus diisi" })}
                        disabled={!selectedRegencyId || districts.length === 0}
                    >
                        {districts.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    {errors.district_id && <Text color="red.500" fontSize="sm">{errors.district_id.message}</Text>}

                    <Select
                        placeholder="Pilih desa/kelurahan"
                        size="lg"
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("village_id", { required: "Desa/kelurahan harus diisi" })}
                        disabled={!selectedDistrictId || villages.length === 0}
                    >
                        {villages.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    {errors.village_id && <Text color="red.500" fontSize="sm">{errors.village_id.message}</Text>}

                    <Input
                        placeholder="Masukkan Kode Pos"
                        fontSize="md"
                        type="text"
                        size="lg"
                        isRequired
                        variant="outline"
                        borderWidth="2px"
                        _focus={{ borderColor: "accent" }}
                        {...register("postal_code", { required: "Kode pos harus diisi" })}
                    />
                    {errors.postal_code && <Text color="red.500" fontSize="sm">{errors.postal_code.message}</Text>}

                    <Button
                        type="submit"
                        w="full"
                        rounded="3xl"
                        bg="accent"
                        color="primary"
                        isLoading={isLoading}
                        loadingText="Menyimpan..."
                    >
                        Simpan
                    </Button>
                </Flex>
            </Box>
        </AuthLayout>
    );
};

export default CompleteProfile;

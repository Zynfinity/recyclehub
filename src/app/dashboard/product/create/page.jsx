'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Input,
    Textarea,
    Select,
    Button,
    Grid,
    GridItem,
    Image,
    IconButton,
    VStack,
    HStack,
    useToast
} from '@chakra-ui/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MdProductionQuantityLimits } from "react-icons/md";
import { X, Upload, ImageIcon, Router } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { createProduct, getProductCategories } from '@/services/product';
import { useRouter } from 'next/navigation';
import useMetadata from '@/hooks/useMetadata';

export default function CreateMaterials() {
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    useMetadata('Produk Baru - RecycleHub');
    const toast = useToast();
    const router = useRouter();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getProductCategories()
            if (response.data) setCategories(response.data);
        };
        fetchCategories();
    }, []);
    const handleFileSelect = (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => file.type.startsWith('image/') && file.size <= 1024 * 1024);
        console.log(validFiles)
        if (validFiles.length !== fileArray.length) {
            toast({
                title: "File Tidak Valid",
                position: "top-center",
                description: "Hanya file gambar yang diperbolehkan! File harus tidak lebih dari 1 MB.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }

        const newImages = validFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const removeImage = (id) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== id);
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const onSubmit = async (data) => {
        try {
            const payload = {
                title: data.title,
                description: data.description,
                material_category_id: data.material_category_id,
                condition: data.condition,
                quantity: 1.00,
                unit: data.unit,
                action_type: data.action_type,
                price: data.price,
                exchange_preference: data.exchange_preference,
                status: data.status,
                images: selectedImages[0]
            };

            const response = await createProduct(payload);
            if (response.error) {
                toast({
                    position: "top-center",
                    title: "Gagal menambah produk",
                    description: response.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    position: "top-center",
                    title: "Produk berhasil ditambahkan",
                    description: "Data profil Anda telah diperbarui.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                router.push('/dashboard/product');
            }
        } catch (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: "Terjadi kesalahan yang tidak terduga" + error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
        }
    };
    return (
        <DashboardLayout>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <MdProductionQuantityLimits size={24} />
                <Text as={'h1'} fontSize={{ base: "xl", md: '2xl' }} className='text-red-400' fontWeight={'semibold'} color={'primary'}>Produk Baru</Text>
            </Box>
            <Flex mt={10} w="full" gap={6} flexDir={{ base: "column", lg: "row" }} as="form" onSubmit={handleSubmit(onSubmit)}>
                <Flex bg={'whitebg'} p={4} rounded={'xl'} w={{ base: "full", lg: "60%" }} h="fit-content" flexDirection={'column'} gap={4} >
                    <Text as={'h2'} fontSize={{ base: "md", md: 'lg' }} className='text-red-400' fontWeight={'medium'} color={'primary'}>Informasi Umum</Text>
                    <Flex flexDir="column" gap={6}>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Nama Produk</Text>
                            <Input
                                placeholder="Masukkan Nama Produk"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("title", { required: "Nama Produk harus diisi" })}
                            />
                            {errors.title && <Text color="red.500" fontSize="sm">{errors.title.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Deskripsi Produk</Text>
                            <Textarea
                                placeholder="Masukkan Deskripsi Produk"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("description", { required: "Deskripsi produk harus diisi" })}
                            />
                            {errors.description && <Text color="red.500" fontSize="sm">{errors.description.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Kategori Produk</Text>
                            <Select
                                placeholder="Pilih kategori Produk"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("material_category_id", { required: "Kategori produk harus diisi" })}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.material_category_id && <Text color="red.500" fontSize="sm">{errors.material_category_id.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Kondisi Produk</Text>
                            <Select
                                placeholder="Pilih kondisi Produk"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("condition", { required: "Deskripsi produk harus diisi" })}
                            >
                                <option value="baru_sisa_produksi">Baru Sisa Produksi</option>
                                <option value="bekas_layak_pakai">Bekas Layak Pakai</option>
                                <option value="rusak_ringan">Rusak Ringan</option>
                                <option value="untuk_daur_ulang">Untuk Daur Ulang</option>
                            </Select>
                            {errors.condition && <Text color="red.500" fontSize="sm">{errors.condition.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Stok Produk</Text>
                            <Input
                                placeholder="Masukkan Stok Produk"
                                fontSize="sm"
                                type="number"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("quantity", { required: "Stok produk harus diisi" })}
                            />
                            {errors.quantity && <Text color="red.500" fontSize="sm">{errors.quantity.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Unit Produk</Text>
                            <Input
                                placeholder="kg, pcs, liter, dll"
                                fontSize="sm"
                                type="text"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("unit", { required: "Unit produk harus diisi" })}
                            />
                            {errors.unit && <Text color="red.500" fontSize="sm">{errors.unit.message}</Text>}
                        </Box>
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Tujuan</Text>
                            <Select
                                placeholder="Pilih tujuan produk"
                                fontSize="sm"
                                type="number"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("action_type", { required: "Untuk harus diisi" })}
                            >
                                <option value="dijual">Dijual</option>
                                <option value="didonasikan">Didonasikan</option>
                                <option value="ditukar">Ditukar</option>
                            </Select>
                            {errors.action_type && <Text color="red.500" fontSize="sm">{errors.action_type.message}</Text>}
                        </Box>
                        {watch("action_type") === "dijual" && (
                            <Box>
                                <Text fontSize="sm" mb={2} color="gray.600">Harga</Text>
                                <Input
                                    placeholder="Masukkan harga produk"
                                    fontSize="sm"
                                    type="number"
                                    size="lg"
                                    isRequired
                                    variant="solid"
                                    borderWidth="2px"
                                    _focus={{ borderColor: "primary" }}
                                    {...register("price", { required: "Harga produk harus diisi" })}
                                />
                                {errors.price && <Text color="red.500" fontSize="sm">{errors.price.message}</Text>}
                            </Box>
                        )}
                        {watch("action_type") === "ditukar" && (
                            <Box>
                                <Text fontSize="sm" mb={2} color="gray.600">Preferensi Penukaran</Text>
                                <Input
                                    placeholder="Masukkan preferensi penukaran"
                                    fontSize="sm"
                                    type="text"
                                    size="lg"
                                    isRequired
                                    variant="solid"
                                    borderWidth="2px"
                                    _focus={{ borderColor: "primary" }}
                                    {...register("exchange_preference", { required: "Preferensi penukaran harus diisi" })}
                                />
                                {errors.exchange_preference && <Text color="red.500" fontSize="sm">{errors.exchange_preference.message}</Text>}
                            </Box>
                        )}
                        <Box>
                            <Text fontSize="sm" mb={2} color="gray.600">Status</Text>
                            <Select
                                placeholder="Pilih status produk"
                                fontSize="sm"
                                type="number"
                                size="lg"
                                isRequired
                                variant="solid"
                                borderWidth="2px"
                                _focus={{ borderColor: "primary" }}
                                {...register("status", { required: "Status produk harus diisi" })}
                            >
                                <option value="available">Tersedia</option>
                                <option value="sold">Terjual Habis</option>
                                <option value="unavailable">Tidak Tersedia</option>
                            </Select>
                            {errors.status && <Text color="red.500" fontSize="sm">{errors.status.message}</Text>}
                        </Box>
                    </Flex>
                </Flex>
                <Flex flexDir={"column"} w={{ base: "full", lg: "40%" }} gap={6}>
                    <Flex bg={'whitebg'} flexDir={"column"} gap={6} p={4} rounded={'xl'} h={"fit-content"}>
                        <Text as={'h2'} fontSize={{ base: "md", md: 'lg' }} className='text-red-400' fontWeight={'medium'} color={'primary'}>Upload Foto</Text>
                        <Box
                            border="2px"
                            borderStyle="dashed"
                            borderColor={dragActive ? "red.400" : "gray.300"}
                            bg={dragActive ? "red.50" : "gray.50"}
                            rounded="lg"
                            p={8}
                            textAlign="center"
                            position="relative"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ borderColor: "gray.400" }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleInputChange}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />

                            <VStack spacing={3}>
                                <Upload size={32} color="#9CA3AF" />
                                <VStack spacing={1}>
                                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                        Klik atau drag & drop gambar di sini
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        PNG, JPG, GIF hingga 10MB
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>
                        {selectedImages.length > 0 && (
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    Preview Gambar ({selectedImages.length})
                                </Text>

                                {/* Main Preview */}
                                <Box position="relative">
                                    <Image
                                        src={selectedImages[0].preview}
                                        alt="Main preview"
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                        rounded="lg"
                                        border="2px solid"
                                        borderColor="gray.200"
                                    />
                                    <IconButton
                                        icon={<X size={16} />}
                                        size="sm"
                                        colorScheme="red"
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        onClick={() => removeImage(selectedImages[0].id)}
                                        aria-label="Remove image"
                                    />
                                </Box>
                            </VStack>
                        )}
                    </Flex>
                    <Button type='submit' w={'fit-content'} justifySelf={'flex-end'}>Simpan</Button>
                </Flex>
            </Flex>
        </DashboardLayout>
    );
};


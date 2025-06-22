"use client"; // This file runs client-side

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Text, Button, Image, Flex, Heading, Tag } from "@chakra-ui/react";
import AppLayout from "@/layouts/AppLayout";
import { getProductById } from "@/services/product";
import { useCartStore } from "@/store/checkoutStore"; // Correct path for Zustand store
import { addToCart } from "@/services/cart";
import cAlert from "@/theme/swal";

const ProductDetail = () => {
    const params = useParams();
    const { id } = params;
    const router = useRouter(); // For navigation

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // State to track quantity

    const { addItemToCart } = useCartStore(); // Accessing Zustand store function for adding items to cart

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                if (response.error) {
                    throw new Error(response.error.message || "Error fetching product details");
                } else {
                    setProduct(response.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Add product to the cart
    const handleAddToCart = () => {
        const payload = {
            id: product.id,
            quantity: quantity
        }
        if (quantity < 1) return; // Prevent adding zero or negative quantities
        addToCart(payload).then((response) => {
            if (response.error) {
                return cAlert.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: response.message,
                });
            }
            cAlert.fire({
                icon: 'success',
                title: 'Berhasil',
                text: `Produk berhasil ditambahkan ke keranjang. Jumlah: ${quantity}`,
            });
        });
    };

    // Proceed to checkout with the current product
    const handleBuyNow = () => {
        if (quantity < 1) return; // Prevent adding zero or negative quantities
        const payload = {
            id: product.id,
            quantity: quantity
        }
        addItemToCart(payload).then((response) => {
            if (response.error) {
                return cAlert.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: response.message,
                });
            }
            cAlert.fire({
                icon: 'success',
                title: 'Berhasil',
                text: `Produk berhasil ditambahkan ke keranjang. Jumlah: ${quantity}`,
            });
        })
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1)); // Prevent going below 1
    };

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity((prevQuantity) => Math.min(prevQuantity + 1, product.quantity)); // Prevent going above available stock
    };

    if (loading) {
        return (
            <AppLayout>
                <Box p={8} display="flex" justifyContent="center" alignItems="center">
                    <Text>Loading...</Text>
                </Box>
            </AppLayout>
        );
    }

    if (error || !product) {
        return (
            <AppLayout>
                <Box p={8}>
                    <Text color="red.500">Product not found or there was an error fetching details. {error && error}</Text>
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Box p={{ base: 0, md: 8 }} mx={{ base: 0, md: "60" }}>
                <Flex
                    flexDirection={{ base: "column", md: "row" }}
                    justify="center"
                    borderBottom="1px solid"
                    borderColor="gray.300"
                    pb={4}
                >
                    <Image
                        src={product.image_urls[0]}
                        alt={product.title}
                        boxSize={{ base: "300px", md: "500px" }}
                        objectFit="cover"
                        borderRadius="lg"
                    />
                    <Flex direction="column" ml={{ md: 8 }} mt={{ base: 4, md: 0 }}>
                        <Box>
                            <Heading as="h2" size="lg" mb={4}>
                                {product.title}
                            </Heading>

                            <Text fontSize="xl" mb={4}>
                                {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.price)}
                            </Text>
                            <Text fontSize="md" mb={2}>
                                Stok : {product.quantity}
                            </Text>
                            <Flex gap={4}>
                                <Tag colorScheme="green" mb={2}>
                                    Kondisi: {product.condition}
                                </Tag>
                                <Tag mb={2} colorScheme={product.status === "available" ? "blue" : "red"}>
                                    Status: {product.status}
                                </Tag>
                            </Flex>
                        </Box>

                        {/* Quantity Control Buttons */}
                        <Flex align="center" mt={4}>
                            <Text mr={4}>Jumlah:</Text>
                            <Button onClick={decreaseQuantity} isDisabled={quantity <= 1} size="sm" colorScheme="blue" mr={2}>-</Button>
                            <Text>{quantity}</Text>
                            <Button onClick={increaseQuantity} isDisabled={quantity >= product.quantity} size="sm" colorScheme="blue" ml={2}>+</Button>
                        </Flex>

                        <Flex gap={4} mt={10}>
                            {/* <Button colorScheme="blue" size="md" onClick={handleBuyNow}>
                                Beli Sekarang
                            </Button> */}
                            <Button colorScheme="blue" size="md" onClick={handleAddToCart}>
                                Add to Cart
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>

                <Box mt={8}>
                    <Heading as="h3" size="md" mb={4}>
                        Description
                    </Heading>
                    <Text>{product.description}</Text>
                </Box>
            </Box>
        </AppLayout>
    );
};

export default ProductDetail;

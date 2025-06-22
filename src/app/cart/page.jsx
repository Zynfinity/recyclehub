"use client"; // This file runs client-side

import { useEffect, useState } from "react"; // Add local state for fetching cart items
import { useRouter } from "next/navigation"; // For navigation
import { Box, Button, Grid, Text, Flex, Heading, Checkbox, Image } from "@chakra-ui/react";
import AppLayout from "@/layouts/AppLayout";
import { getCartItems, removeCartItem } from "@/services/cart";
import { useCartStore } from "@/store/checkoutStore"; // Correct path for Zustand store

// CartItem Component
const CartItem = ({ product, removeFromCart, isSelected, toggleSelection, isSelectable, updateQuantity }) => {
    const productDetail = product.material_listings;

    const handleClick = (e) => {
        if (isSelectable) {
            toggleSelection(product.id);
        }
        e.stopPropagation();
    };

    const increaseQuantity = (e) => {
        e.stopPropagation();
        updateQuantity(product.id, product.quantity + 1);
    };

    const decreaseQuantity = (e) => {
        e.stopPropagation();
        if (product.quantity > 1) {
            updateQuantity(product.id, product.quantity - 1);
        }
    };

    return (
        <Flex
            align="center"
            justify="space-between"
            borderBottom="1px solid #e2e8f0"
            p={4}
            rounded={'xl'}
            onClick={handleClick}
            cursor={isSelectable ? 'pointer' : 'default'}
            bg={isSelected ? "#e2e8f0" : "transparent"}
        >
            <Flex align="center">
                <Checkbox
                    isChecked={isSelected}
                    onChange={() => toggleSelection(product.id)}
                    size="sm"
                    mr={4}
                    isDisabled={!isSelectable}
                />
                <Image src={productDetail.image_urls[0]} rounded={'lg'} alt={productDetail.title} boxSize="100px" mr={4} />
                <Box>
                    <Text fontWeight={'semibold'} size="sm">{productDetail.title}</Text>
                    <Text fontSize="md">
                        {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(
                            productDetail.price
                        )}
                    </Text>
                </Box>
            </Flex>

            <Flex align="center">
                <Button size="sm" onClick={decreaseQuantity} colorScheme="blue" disabled={product.quantity <= 1}>-</Button>
                <Text mx={2}>{product.quantity}</Text>
                <Button size="sm" onClick={increaseQuantity} colorScheme="blue" disabled={product.quantity >= productDetail.quantity}>+</Button>

                <Button onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }} colorScheme="red" size="sm" ml={4}>
                    Hapus
                </Button>
            </Flex>
        </Flex>
    );
};

// Main Cart Component
export default function Cart() {
    const [cartItems, setCartItems] = useState([]); // Local state to store fetched cart items
    const { setSelectedItemsForCheckout } = useCartStore(); // Zustand store for selected items
    const [selectedItems, setSelectedItems] = useState(new Set()); // Track selected items
    const [isSelectable, setIsSelectable] = useState(false); // Track if select mode is active

    const router = useRouter(); // For navigation

    const updateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(id); // Remove from selected items if removed from cart
            return newSelected;
        });
    };

    useEffect(() => {
        const fetchCart = async () => {
            const cart = await getCartItems();
            if (cart.error) return;
            setCartItems(cart.data); // Store fetched items in local state
        };
        fetchCart();
    }, []);

    const toggleSelection = (id) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id); // Unselect if it's already selected
            } else {
                newSelected.add(id); // Add to selected items
            }
            return newSelected;
        });
    };

    const handleSelectAll = () => {
        if (isSelectable) {
            const allIds = cartItems.map(item => item.id);
            const allSelected = new Set(allIds);
            setSelectedItems(allSelected);
        }
    };

    const handleDeselectAll = () => {
        setSelectedItems(new Set()); // Deselect all when exiting select mode
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.has(item.id)) {
                return total + item.material_listings.price * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleProceedToCheckout = () => {
        const selectedItemsWithProductInfo = cartItems.filter(item => selectedItems.has(item.id));
        setSelectedItemsForCheckout(selectedItemsWithProductInfo);

        router.push("/checkout");
    };

    return (
        <AppLayout>
            <Box p={{ base: 0, md: 8 }}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Heading as="h1" size="lg" fontSize={'2xl'}>
                        Keranjang Saya
                    </Heading>
                    <Button onClick={() => {
                        setIsSelectable(!isSelectable);
                        if (isSelectable) {
                            handleDeselectAll();
                        } else {
                            handleSelectAll();
                        }
                    }} colorScheme="blue" size="sm">
                        {isSelectable ? 'Cancel Select' : 'Select Items'}
                    </Button>
                </Flex>

                {cartItems.length === 0 ? (
                    <Text>Keranjang kosong.</Text>
                ) : (
                    <Grid templateColumns="1fr" gap={6}>
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                product={item}
                                removeFromCart={removeFromCart}
                                isSelected={selectedItems.has(item.id)}
                                toggleSelection={toggleSelection}
                                isSelectable={isSelectable}
                                updateQuantity={updateQuantity}
                            />
                        ))}
                    </Grid>
                )}

                {cartItems.length > 0 && (
                    <Box display={'flex'} flexDir={'column'} mt={6} borderTop="1px solid #e2e8f0" pt={4}>
                        <Flex justify="space-between" mb={4}>
                            <Text fontSize="lg" fontWeight="bold">
                                Total
                            </Text>
                            <Text fontSize="lg" fontWeight="bold">
                                {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(calculateTotal())}
                            </Text>
                        </Flex>
                        <Flex justify="flex-end">
                            <Button colorScheme="blue" width="fit-content" onClick={handleProceedToCheckout}>
                                Proceed to Checkout
                            </Button>
                        </Flex>
                    </Box>
                )}
            </Box>
        </AppLayout>
    );
}


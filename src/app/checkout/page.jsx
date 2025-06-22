"use client"; // This file runs client-side

import { useEffect, useState } from "react"; // Import required hooks
import { Box, Text, Button, Flex, Heading, Image } from "@chakra-ui/react";
import AppLayout from "@/layouts/AppLayout"; // Import your app layout
import { useCartStore } from "@/store/checkoutStore";

const Checkout = () => {
    const { selectedItemsForCheckout } = useCartStore(); // Access selected items for checkout

    // Calculate the total price of the selected items
    const calculateTotal = () => {
        return selectedItemsForCheckout.reduce((total, item) => {
            return total + item.material_listings.price * item.quantity;
        }, 0);
    };

    useEffect(() => {
        if (selectedItemsForCheckout.length === 0) {
            // If no items are selected for checkout, redirect to the cart page
            window.location.href = "/cart";
        }
    }, [selectedItemsForCheckout]);

    return (
        <AppLayout>
            <Box p={8}>
                <Heading as="h1" fontSize={'2xl'} mb={6}>
                    Checkout
                </Heading>

                {selectedItemsForCheckout.length === 0 ? (
                    <Text>Your cart is empty.</Text>
                ) : (
                    <Box>
                        {selectedItemsForCheckout.map((item) => (
                            <Flex
                                key={item.id}
                                justify="space-between"
                                align="center"
                                borderBottom="1px solid #e2e8f0"
                                p={4}
                                rounded="xl"
                                mb={4}
                            >
                                <Flex align="center">
                                    <Image
                                        src={item.material_listings.image_urls[0]}
                                        alt={item.material_listings.title}
                                        boxSize="100px"
                                        mr={4}
                                        rounded="lg"
                                    />
                                    <Box>
                                        <Text fontWeight="semibold">{item.material_listings.title}</Text>
                                        <Text>
                                            {Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(item.material_listings.price)}
                                        </Text>
                                        <Text>Quantity: {item.quantity}</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        ))}

                        <Flex justify="space-between" mt={6} borderTop="1px solid #e2e8f0" pt={4}>
                            <Text fontSize="xl" fontWeight="bold">
                                Total
                            </Text>
                            <Text fontSize="xl" fontWeight="bold">
                                {Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(calculateTotal())}
                            </Text>
                        </Flex>

                        <Flex justify="flex-end" mt={6}>
                            <Button colorScheme="blue" size="md">
                                Proceed to Payment
                            </Button>
                        </Flex>
                    </Box>
                )}
            </Box>
        </AppLayout>
    );
};

export default Checkout;

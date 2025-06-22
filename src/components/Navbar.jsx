"use client";
import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    IconButton,
    Avatar,
    Button,
    Link,
} from '@chakra-ui/react';
import {
    Flex,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaShoppingBag } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import useSidebarStore from '../store/sidebarStore';
import { useAuthStore } from '@/store/authStore';
import { redirect, usePathname } from 'next/navigation';


const Navbar = () => {
    const path = usePathname();
    const isDashboardPage = path.startsWith('/dashboard');
    const { user } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box
            rounded={'xl'}
            height="64px"
            bg={bgColor}
            zIndex={1}
            px={4}
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            <Flex alignItems={'center'} justifyContent="space-between" mx="auto" h={"full"}>
                {isMobile && (
                    <Flex alignItems="center">
                        <IconButton
                            icon={<RxHamburgerMenu />}
                            aria-label="Toggle sidebar"
                            onClick={toggleSidebar}
                            variant="ghost"
                            mr={2}
                        />
                        <Text variant="h6" color="gray.800">Dashboard</Text>
                    </Flex>
                )}
                {!isMobile && <Link href='/' variant="h6" fontWeight="bold" color="gray.800"><Text as={"span"} color={"green.600"}>ReCycle Hub</Text></Link>}
                <Flex alignItems="center">
                    {!isDashboardPage && (
                        <Button
                            variant="ghost"
                            colorScheme="teal"
                            size="sm"
                            onClick={() => redirect('/cart')}
                        >
                            <FaShoppingBag size={20} />
                        </Button>
                    )}
                    <Box position="relative" ml={2}>
                        <Avatar
                            name={user?.user_metadata?.name}
                            src={user?.user_metadata?.picture}
                            size="sm"
                            cursor="pointer"
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <Box
                                position="absolute"
                                right={0}
                                mt={2}
                                p={4}
                                w="200px"
                                bg="white"
                                boxShadow="xl"
                                rounded="xl"
                                zIndex={10}
                            >
                                <Link href='/auth/logout'
                                    w={'full'}
                                    px={4}
                                    py={2}
                                    rounded={'3xl'}
                                    _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                                >
                                    Logout
                                </Link>
                            </Box>
                        )}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;


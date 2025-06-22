
import React from 'react';
import { MdDashboard, MdDataset } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { FaInfoCircle } from 'react-icons/fa';
import {
    Box,
    Flex,
    VStack,
    Text,
    Link as ChakraLink,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSidebarStore from '../store/sidebarStore';

const SIDEBAR_WIDTH = '280px';

const dashboardMenuItems = [
    { name: 'Dashboard Utama', path: '/dashboard', icon: <MdDashboard size={22} />, section: 'NAVIGASI' },
    { name: 'Data Produk', path: '/dashboard/product', icon: <MdDataset size={22} />, section: 'NAVIGASI' },
    { name: 'Data Kategori', path: '/dashboard/category', icon: <HiTemplate size={22} />, section: 'NAVIGASI' },
    { name: 'Data Pengguna', path: '/dashboard/users', icon: <HiTemplate size={22} />, section: 'NAVIGASI' },
    { name: 'Logout', path: '/auth/logout', icon: <RiLogoutBoxFill size={22} color="red.500" />, section: 'AKUN' },
];

const publicMenuItems = [
    { name: 'Beranda', path: '/', icon: <MdDashboard size={22} />, section: 'HALAMAN' },
    { name: 'Tentang Kami', path: '/about', icon: <FaInfoCircle size={22} />, section: 'HALAMAN' },
    { name: 'Masuk Admin', path: '/login', icon: <RiLogoutBoxFill size={22} color="blue.500" />, section: 'AKSES' },
];

const MenuList = ({ onLinkClick, isDashboard }) => {
    const pathname = usePathname();
    const currentMenuItems = isDashboard ? dashboardMenuItems : publicMenuItems;

    const getLinkStyles = (path) => {
        const isActiveExact = pathname === path;
        const isActiveParent =
            pathname.startsWith(path) &&
            (pathname.length === path.length ||
                pathname[path.length] === '/');

        const isActive = (path === '/dashboard')
            ? isActiveExact
            : isActiveParent;

        return {
            fontSize: 'sm',
            height: '45px',
            as: Link,
            href: path,
            _hover: { textDecoration: 'none', bg: 'secondary', color: 'primary' },
            py: 2,
            px: 4,
            borderRadius: 'md',
            display: 'flex',
            alignItems: 'center',
            rounded: '3xl',
            bg: isActive ? 'grey1' : 'transparent',
            color: isActive ? 'primary' : 'secondary',
            fontWeight: isActive ? 'bold' : 'medium',
            onClick: onLinkClick,
        };
    };

    const groupedMenuItems = currentMenuItems.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <VStack as="ul" spacing={2} align="stretch" mt={10} px={2} listStyleType="none" ml={0}>
            {Object.keys(groupedMenuItems).map((sectionName, sectionIndex) => (
                <React.Fragment key={sectionName}>
                    <Text
                        fontSize={'xs'}
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        mb={2}
                        mt={sectionIndex > 0 ? 14 : 0}
                        pl={5}
                    >
                        {sectionName}
                    </Text>
                    {groupedMenuItems[sectionName].map((item) => (
                        <Box as="li" key={item.path}>
                            <ChakraLink {...getLinkStyles(item.path)}>
                                {item.icon && <Box as="span" mr={2}>{item.icon}</Box>}
                                <Text>{item.name}</Text>
                            </ChakraLink>
                        </Box>
                    ))}
                </React.Fragment>
            ))}
        </VStack>
    );
};

const Sidebar = ({ isDashboard = false }) => {
    const { isSidebarOpen, closeSidebar } = useSidebarStore();
    const pathname = usePathname();
    const isCurrentPathDashboard = pathname.startsWith('/dashboard');

    const handleLinkClick = () => {
        if (isSidebarOpen) {
            closeSidebar();
        }
    };

    const sidebarTitle = isDashboard || isCurrentPathDashboard ? "Dashboard" : "ReCycle Hub";

    return (
        <>
            <Box display={{ base: 'block', md: 'none' }}>
                <Drawer isOpen={isSidebarOpen} placement="left" onClose={closeSidebar} onOverlayClick={closeSidebar}>
                    <DrawerOverlay />
                    <DrawerContent bg="primary">
                        <DrawerCloseButton color={"secondary"} />
                        <DrawerHeader color={"secondary"} borderColor="gray.200">{sidebarTitle}</DrawerHeader>
                        <DrawerBody p={4}>
                            <MenuList onLinkClick={handleLinkClick} isDashboard={isDashboard || isCurrentPathDashboard} />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>

            <Box
                position="sticky"
                top="0"
                left="0"
                h="100vh"
                minW={SIDEBAR_WIDTH}
                maxW={SIDEBAR_WIDTH}
                bg="primary"
                p={4}
                zIndex="sticky"
                display={{ base: 'none', md: 'block' }}
                borderRight="1px solid"
                borderColor="gray.200"
            >
                <Box bgColor="primary" h="full" rounded={'xl'} overflowY="auto">
                    <Flex height="64px" alignItems="center" px={4}>
                        <Text fontSize="xl" fontWeight="bold" color={"secondary"}>
                            {sidebarTitle}
                        </Text>
                    </Flex>
                    <MenuList isDashboard={isDashboard || isCurrentPathDashboard} />
                </Box>
            </Box>
        </>
    );
};

export default Sidebar;

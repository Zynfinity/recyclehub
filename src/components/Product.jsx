"use client";
import cAlert from "@/theme/swal";
import { getAllProducts } from "@/services/product";
import { GoDot } from "react-icons/go";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Grid,
    GridItem,
    Heading,
    Image,
    Stack,
    Text,
    Box,
    Input,
    Select,
    VStack,
    InputGroup,
    InputLeftElement,
    Flex,
    List,
    ListItem,
    ListIcon,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerCloseButton,
    Link
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { addToCart } from "@/services/cart";

// --- Sub-komponen ProductFilterControls (Dipindahkan ke dalam Product.jsx) ---
const ProductFilterControls = ({
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    handleResetFilters,
    filteredProductsCount,
    totalProductsCount,
    currentPage,
    totalPages,
    onClose, // Prop ini dari Drawer
}) => {
    // Fungsi untuk memperbarui kategori dan menutup drawer jika onClose ada
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (onClose) onClose();
    };

    // Fungsi untuk memperbarui urutan dan menutup drawer jika onClose ada
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        if (onClose) onClose();
    };

    // Fungsi untuk mereset filter dan menutup drawer jika onClose ada
    const handleReset = () => {
        handleResetFilters();
        if (onClose) onClose();
    };

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold" color="gray.700" display={{ base: "none", lg: "block" }}>
                Filter Produk
            </Text>

            {/* Search Input */}
            <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                    Pencarian
                </Text>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        size="sm"
                    />
                </InputGroup>
            </Box>

            {/* Category Filter */}
            <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                    Kategori
                </Text>
                <List spacing={1}>
                    <ListItem
                        _hover={{ cursor: "pointer", bg: "gray.100" }}
                        onClick={() => handleCategorySelect("")}
                        p={2}
                        borderRadius="md"
                        bg={selectedCategory === "" ? "green.50" : "transparent"}
                        color={selectedCategory === "" ? "green.600" : "gray.700"}
                    >
                        <ListIcon as={GoDot} />
                        <span>Semua Kategori</span>
                    </ListItem>
                    {categories.map((category) => (
                        <ListItem
                            key={category}
                            _hover={{ cursor: "pointer", bg: "gray.100" }}
                            onClick={() => handleCategorySelect(category)}
                            p={2}
                            borderRadius="md"
                            bg={selectedCategory === category ? "green.50" : "transparent"}
                            color={selectedCategory === category ? "green.600" : "gray.700"}
                        >
                            <ListIcon as={GoDot} />
                            <span>{category}</span>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Sort By */}
            <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                    Urutkan
                </Text>
                <Select
                    placeholder="Pilih urutan"
                    value={sortBy}
                    onChange={handleSortChange}
                    bg="white"
                    size="sm"
                >
                    <option value="name-asc">Nama A-Z</option>
                    <option value="name-desc">Nama Z-A</option>
                    <option value="price-low">Harga Terendah</option>
                    <option value="price-high">Harga Tertinggi</option>
                </Select>
            </Box>

            {/* Reset Button */}
            <Button
                onClick={handleReset}
                variant="outline"
                colorScheme="green"
                size="sm"
                w="full"
            >
                Reset Filter
            </Button>

            {/* Results Count */}
            <Text fontSize="xs" color="gray.500" textAlign="center" pt={2} borderTop="1px solid" borderColor="gray.200">
                {filteredProductsCount} dari {totalProductsCount} produk
                <br />
                <Text as="span" fontSize="xs">
                    Halaman {currentPage} dari {totalPages}
                </Text>
            </Text>
        </VStack>
    );
};
// --- Akhir Sub-komponen ProductFilterControls ---


export default function Product() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12); // Jumlah produk per halaman

    // State untuk Drawer
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await getAllProducts();
            if (error) {
                return;
            }
            setProducts(data);
            setFilteredProducts(data);

            // Extract unique categories
            const uniqueCategories = [...new Set(data.map(product => product.material_categories.name))];
            setCategories(uniqueCategories);
        }
        fetchProducts();
    }, []);

    // Filter and sort products
    useEffect(() => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.material_categories.name === selectedCategory
            );
        }

        // Sort products
        if (sortBy === "price-low") {
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === "price-high") {
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === "name-asc") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "name-desc") {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, searchTerm, selectedCategory, sortBy]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSortBy("");
        setCurrentPage(1);
    };
    // --- Akhir Filter dan Sort ---
    const handleAddToCart = async (id) => {
        const payload = {
            id,
            quantity: 1
        }
        const { error, errorText, message } = await addToCart(payload);
        if (error) {
            return cAlert.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: message,
            })
        }
        cAlert.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Produk berhasil ditambahkan ke keranjang',
        })
    };
    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Flex gap={6} alignItems="flex-start">
            {/* Sidebar Filter Controls (Desktop/Large Screens) */}
            <Box
                w={{ base: "full", md: "300px" }}
                minW="250px"
                bg={'gray.50'}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                position="sticky"
                top="20px"
                alignSelf="flex-start"
                maxH="calc(100vh - 40px)"
                overflowY="auto"
                display={{ base: "none", lg: "block" }}
            >
                <ProductFilterControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    handleResetFilters={handleResetFilters}
                    filteredProductsCount={filteredProducts.length}
                    totalProductsCount={products.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </Box>

            {/* Main Content Area */}
            <Box flex={1} minW={0}>
                <Flex w={'full'} justify={'flex-start'} mb={4} justifyContent={'space-between'} alignItems={'center'} display={{ base: 'flex', lg: 'none' }}>
                    <Text fontSize="md" fontWeight="bold"> {selectedCategory || "Semua Produk"}
                    </Text>
                    <Button onClick={onOpen} colorScheme="green" leftIcon={<SearchIcon />}>
                        Filter Produk
                    </Button>

                </Flex>

                {/* Drawer Mobile */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth="1px">Filter Produk</DrawerHeader>
                        <DrawerBody>
                            <ProductFilterControls
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                categories={categories}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                handleResetFilters={handleResetFilters}
                                filteredProductsCount={filteredProducts.length}
                                totalProductsCount={products.length}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onClose={onClose} // Passed onClose to close drawer on filter selection
                            />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <Box textAlign="center" py={20}>
                        <Text fontSize="lg" color="gray.500">
                            Tidak ada produk yang ditemukan
                        </Text>
                        <Text fontSize="sm" color="gray.400" mt={2}>
                            Coba ubah filter atau kata kunci pencarian
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Grid
                            templateColumns={{
                                base: 'repeat(1, minmax(270px, 1fr))',
                                sm: 'repeat(2, minmax(270px, 1fr))',
                                md: 'repeat(2, 1fr)',
                                lg: 'repeat(2, 1fr)',
                                xl: 'repeat(3, 1fr)',
                            }}
                            gap={6}
                        >
                            {currentProducts.map((product) => (
                                <GridItem key={product.id}>
                                    <Card height='full' shadow="md" _hover={{ shadow: "lg", transform: "translateY(-2px)" }} transition="all 0.2s">
                                        <CardBody>
                                            <Image
                                                objectFit='cover'
                                                w="full"
                                                h="200px"
                                                src={product.image_urls[0] ?? 'https://placehold.co/600x400'}
                                                alt={product.description}
                                                borderRadius='lg'
                                            />
                                            <Stack mt='4' spacing='3'>
                                                <Heading size='sm' noOfLines={2}>{product.title}</Heading>
                                                <Text bg={'gray.100'} rounded={'full'} w={'fit-content'} px={3} py={1} fontSize={'xs'} color="gray.600">
                                                    {product.material_categories.name}
                                                </Text>
                                                <Text fontSize={'sm'} color="gray.600" noOfLines={3}>
                                                    {product.description}
                                                </Text>
                                                <Text color='green.600' fontSize='xl' fontWeight="bold">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)}
                                                </Text>
                                            </Stack>
                                        </CardBody>
                                        <Divider />
                                        <CardFooter>
                                            <ButtonGroup spacing='2' w="full" display={'flex'} justifyContent={'space-between'}>
                                                <Link href={`/product/${product.id}`}>
                                                    <Button variant='solid' colorScheme="green" size="sm">
                                                        Detail Produk
                                                    </Button>
                                                </Link>
                                            </ButtonGroup>
                                        </CardFooter>
                                    </Card>
                                </GridItem>
                            ))}
                        </Grid>
                    </>
                )}

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                    <Box mt={8}>
                        <Flex justify="center" align="center" gap={2} flexWrap="wrap">
                            {/* Previous Button */}
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                size="sm"
                                variant="outline"
                                colorScheme="green"
                            >
                                Previous
                            </Button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                const isCurrentPage = pageNumber === currentPage;

                                // Show first page, last page, current page, and pages around current page
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <Button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            size="sm"
                                            variant={isCurrentPage ? "solid" : "outline"}
                                            colorScheme="green"
                                            minW="40px"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                }

                                // Show ellipsis
                                if (
                                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                ) {
                                    return (
                                        <Text key={pageNumber} px={2} color="gray.500">
                                            ...
                                        </Text>
                                    );
                                }

                                return null;
                            })}

                            {/* Next Button */}
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                size="sm"
                                variant="outline"
                                colorScheme="green"
                            >
                                Next
                            </Button>
                        </Flex>

                        {/* Page Info */}
                        <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
                            Menampilkan {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} dari {filteredProducts.length} produk
                        </Text>
                    </Box>
                )}
            </Box>
        </Flex>
    );
}



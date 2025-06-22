import { Box, Flex, Text, Avatar, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
// supabase
const testimonials = [
    { id: 1, content: "Layanan dan dukungan yang luar biasa!", author: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, content: "Saya suka menggunakan aplikasi ini, sangat fantastis!", author: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, content: "Sangat direkomendasikan untuk semua orang.", author: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, content: "Alat yang wajib dimiliki untuk tim kami.", author: "David", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, content: "Kualitas yang luar biasa dan mudah digunakan.", author: "Eve", avatar: "https://i.pravatar.cc/150?img=5" }
];

const AuthLayout = ({ children }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div>
            <Box w={"full"} minHeight={"100dvh"}>
                <Flex justify={"center"} align={"center"} h={"100dvh"} gap={4}>
                    <Flex flexDir={"column"} display={{ base: "none", md: "flex" }} w={{ md: "40%", xl: "30%" }} bg={'primary'} h={"100dvh"} p={12}>
                        <Box color={"white"} fontSize={"xl"} fontWeight={"bold"}>
                            <Text><Text as={"span"} color={"accent"}>ReCycle</Text> <br /> Hub</Text>
                        </Box>
                        <Box display={"flex"} flexDir={"column"} flex={1} rounded={"xl"} justifyContent={"center"} color={"white"} gap={10}>
                            <Text fontSize={"3xl"} fontWeight={"bold"}>Apa Kata Mereka?</Text>
                            <Box>
                                <Avatar src={testimonials[currentTestimonial].avatar} size="md" />
                                <Text fontSize={"lg"} mt={2}>{testimonials[currentTestimonial].content}</Text>
                                <Text fontWeight={"bold"}>- {testimonials[currentTestimonial].author}</Text>
                                <Flex mt={4} justify={"space-between"}>
                                    <button onClick={prevTestimonial}>Previous</button>
                                    <button onClick={nextTestimonial}>Next</button>
                                </Flex>
                                <Box mt={4} display={"flex"} justify={"center"}>
                                    {testimonials.map((_, index) => (
                                        <Box
                                            key={index}
                                            bg={currentTestimonial === index ? "accent" : "white"}
                                            w={2}
                                            h={2}
                                            borderRadius={"full"}
                                            m={1}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                    <Flex w={{ base: "100%", md: "60%", xl: "70%" }} justify={"center"} align={"center"} h={"100dvh"}>
                        {/* Login Form */}
                        {children}
                    </Flex>
                </Flex>
            </Box>
        </div>
    );
};

export default AuthLayout;


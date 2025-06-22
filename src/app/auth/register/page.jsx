"use client";
import AuthLayout from "@/layouts/AuthLayout";
import supabase from "@/lib/supabaseClient";
import { Box, Flex, Text, Avatar, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const { user, session } = await supabase.auth.signUp({
                email,
                password,
            });

            if (user) {
                // Redirect to dashboard
                window.location.href = "/dashboard";
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthLayout>
            <Box bg={"white"} maxW={"md"} w={"full"} p={8} rounded={"xl"}>
                <Text fontSize={"2xl"} fontWeight={"bold"} mb={6}>Register</Text>
                <Flex flexDir={"column"} gap={6} as="form" onSubmit={handleRegister}>
                    <Box>
                        <Text mb={2}>Email</Text>
                        <Input placeholder='Masukkan Email' fontSize={"md"} type="email" size='lg' isRequired variant={'outline'} borderWidth={'2px'} _focus={{ borderColor: 'accent' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Box>
                    <Box>
                        <Text mb={2}>Password</Text>
                        <Input placeholder='Masukkan Password' fontSize={"md"} type="password" size='lg' isRequired variant={'outline'} borderWidth={'2px'} _focus={{ borderColor: 'accent' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Box>
                    {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                    <Text><Link to={'/register'} color={"primary"} fontSize={'sm'}>Lupa Password?</Link></Text>
                    <Flex flexDir={"column"} gap={4}>
                        <Button w={"full"} rounded={"3xl"} bg={"accent"} color={"primary"} type="submit" onClick={handleRegister}>Daftar</Button>
                        <Flex alignItems="center">
                            <hr style={{ flex: 1 }} />
                            <Text mx={2} fontSize="xs">ATAU</Text>
                            <hr style={{ flex: 1 }} />
                        </Flex>
                        <Link href={'/auth/login'}>
                            <Button
                                w={"full"}
                                rounded={"3xl"}
                                borderColor={"primary"}
                                variant={"outline"}
                                color={"primary"}
                                fontWeight={"semibold"}
                            >
                                Login
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
            </Box>
        </AuthLayout>
    );
};
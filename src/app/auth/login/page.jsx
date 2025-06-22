"use client";
import { Box, Flex, Text, Avatar, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "@/layouts/AuthLayout";
import supabase from "@/lib/supabase/server";
import { signInWithOAuth } from "../../../services/auth/action";
import { createBrowserClient } from "@supabase/ssr";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            // ...
            auth: {
                // ...
                detectSessionInUrl: true,
                flowType: 'pkce',
                storage: {
                    getItem: () => Promise.resolve('FETCHED_TOKEN'),
                    setItem: () => { },
                    removeItem: () => { },
                },
            },
            // ...
        }
    )

    const handleLogin = async (event) => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google', options: {
                    redirectTo: `${location.origin}/auth/callback`,
                }
            })
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthLayout>
            <Box bg={"white"} maxW={"md"} w={"full"} p={8} rounded={"xl"}>
                <Text fontSize={"2xl"} fontWeight={"bold"} mb={6}>Login</Text>
                <Flex flexDir={"column"} gap={6} as="form">
                    {/* <Box>
                        <Text mb={2}>Email</Text>
                        <Input
                            placeholder='Masukkan Email'
                            fontSize={"md"}
                            type="email"
                            size='lg'
                            isRequired
                            variant={'outline'}
                            borderWidth={'2px'}
                            _focus={{ borderColor: 'accent' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Text mb={2}>Password</Text>
                        <Input
                            placeholder='Masukkan Password'
                            fontSize={"md"}
                            type="password"
                            size='lg'
                            isRequired
                            variant={'outline'}
                            borderWidth={'2px'}
                            _focus={{ borderColor: 'accent' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                    {error && <Text color="red.500">{error}</Text>}
                    <Text>
                        <Link href={'/'} color={"primary"} fontSize={'sm'}>
                            Lupa Password?
                        </Link>
                    </Text> */}
                    <Flex flexDir={"column"} gap={4}>
                        {/* <Button w={"full"} rounded={"3xl"} bg={"accent"} color={"primary"}>
                            Masuk
                        </Button> */}
                        <Button w={"full"} rounded={"3xl"} bg={"white"} color={"primary"} variant={"outline"} leftIcon={<FcGoogle size={20} />} onClick={handleLogin}>
                            Masuk dengan Google
                        </Button>
                        {/* <Flex alignItems="center">
                            <hr style={{ flex: 1 }} />
                            <Text mx={2} fontSize="xs">
                                ATAU
                            </Text>
                            <hr style={{ flex: 1 }} />
                        </Flex>
                        <Link href={'/auth/register'}>
                            <Button
                                w={"full"}
                                rounded={"3xl"}
                                borderColor={"primary"}
                                variant={"outline"}
                                color={"primary"}
                                fontWeight={"semibold"}
                            >
                                Daftar
                            </Button>
                        </Link> */}
                    </Flex>
                </Flex>
            </Box>
        </AuthLayout>
    );
};
"use client";
import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const customTheme = extendTheme({
    breakpoints: {
        base: '0em',
        sm: '40em', //30
        md: '48em',
        lg: '62em',
        xl: '80em',
    },
    colors: {
        whitebg: "#F7FAFC",
        primary: "#1F2E4A",
        secondary: "#F5F5DC",
        accent: "#A2FF00",
        netral: "#F0F0E0",
        grey1: "#888888",
        brand: {
            50: '#f5f5f5',
            500: '#1F2E4A',
        },
    },
    fonts: {
        heading: 'Inter, serif',
        body: 'Inter, sans-serif',
    },
    fontSizes: {
        'display-xl': '3rem',
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 'lg',
            },
            variants: {
                outline: {
                    borderColor: 'brand.500',
                    color: 'brand.500',
                    _hover: {
                        bg: 'grey1',
                    },
                },
                solid: {
                    bg: 'primary',
                    color: 'secondary',
                    _hover: {
                        bg: 'grey1',
                    },
                },
            },
            defaultProps: {
                variant: 'solid',
                size: "sm",
            },
        },
        Input: {
            defaultProps: {
                variant: 'solid',
            },
        },
        Toast: {
            baseStyle: {
                borderRadius: 'md',
            },
            variants: {
                solid: {
                    bg: 'primary',
                    color: 'secondary',
                    _hover: {
                        bg: 'grey1',
                    },
                },
            },
            defaultProps: {
                variant: 'solid',
            },
        },
    },
    styles: {
        global: (props) => ({
            body: {
                bg: mode('white', 'gray.800')(props),
                color: mode('gray.800', 'whiteAlpha.900')(props),
                fontFamily: 'Inter, sans-serif',
            },
        }),
    },
});

export default customTheme;


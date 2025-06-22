"use client";
import { signOut } from '@/services/auth/action';
import { useEffect } from 'react';

export default function Logout() {
    useEffect(() => {
        signOut().then(() => {
            window.location.href = '/auth/login';
        });
    })
}
"use client";
import Product from "@/components/Product";
import AppLayout from "@/layouts/AppLayout";
import Image from "next/image";

export default function Home() {

    return (
        <AppLayout>
            <Product />
        </AppLayout>
    );
}

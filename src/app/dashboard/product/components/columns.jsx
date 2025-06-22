"use client";

import * as React from "react";
import {
    Button,
    Checkbox,
    Text,
    Flex
} from "@chakra-ui/react";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import Link from "next/link";

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                isChecked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                isChecked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(e.target.checked)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            label: "Pilih"
        }
    },
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
        meta: {
            label: "No"
        }
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                fontSize="sm"
                variant="ghost"
                onClick={() => column.toggleSorting()}
                rightIcon={<ArrowUpDownIcon fontSize="xs" />}
            >
                Nama Material
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        meta: {
            label: "Nama Material"
        }
    },
    {
        accessorKey: "material_categories.name",
        header: "Kategori",
        cell: ({ row }) => <Text>{row.original?.material_categories?.name || "-"}</Text>,
        meta: {
            label: "Kategori"
        }
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => (
            <Button
                fontSize="sm"
                variant="ghost"
                onClick={() => column.toggleSorting()}
                rightIcon={<ArrowUpDownIcon fontSize="xs" />}
            >
                Stok
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-left font-medium">
                {new Intl.NumberFormat("id-ID").format(row.getValue("quantity"))}
            </div>
        ),
        meta: {
            label: "Stok"
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Flex justifyContent="flex-end">
                <Button
                    fontSize="sm"
                    variant="ghost"
                    onClick={() => column.toggleSorting()}
                    rightIcon={<ArrowUpDownIcon fontSize="xs" />}
                >
                    Harga
                </Button>
            </Flex>
        ),
        cell: ({ row }) => {
            const price = row.getValue("price");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(price);
            return <div className="text-right font-medium">{formatted}</div>;
        },
        meta: {
            label: "Harga"
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <Flex gap={2}>
                <Link href={`/dashboard/product/${row.original.id}/edit`}>
                    <FaRegEdit size={22} color="gray" />
                </Link>
            </Flex>
        ),
        meta: {
            label: "Aksi"
        }
    }
];


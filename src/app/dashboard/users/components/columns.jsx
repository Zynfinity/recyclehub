"use client";

import * as React from "react";
import {
    Button,
    Checkbox,
    Text,
    Flex
} from "@chakra-ui/react";
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
        accessorKey: "full_name",
        header: ({ column }) => (
            <Button
                fontSize="sm"
                variant="ghost"
                onClick={() => column.toggleSorting()}
                rightIcon={<ArrowUpDownIcon fontSize="xs" />}
            >
                Nama Lengkap
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("full_name")}</div>,
        meta: {
            label: "Nama Lengkap"
        }
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div className="font-medium">{row.getValue("role")}</div>,
        meta: {
            label: "Role"
        }
    },
    {
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }) => <Text noOfLines={1} overflow="hidden" textOverflow="ellipsis">{row.getValue("address")}</Text>,
        meta: {
            label: "Alamat"
        }
    },
    {
        accessorKey: "phone_number",
        header: "Nomor Telepon",
        cell: ({ row }) => <div className="font-medium">{row.getValue("phone_number")}</div>,
        meta: {
            label: "Nomor Telepon"
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <Flex gap={2}>
                <Link href={`/dashboard/users/${row.original.id}/edit`}>
                    <FaRegEdit size={22} color="gray" />
                </Link>
            </Flex>
        ),
        meta: {
            label: "Aksi"
        }
    }
];

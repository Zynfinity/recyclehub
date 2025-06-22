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
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                fontSize="sm"
                variant="ghost"
                onClick={() => column.toggleSorting()}
                rightIcon={<ArrowUpDownIcon fontSize="xs" />}
            >
                Nama Kategori
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        meta: {
            label: "Nama Kategori"
        }
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <Text noOfLines={1} overflow="hidden" textOverflow="ellipsis">{row.getValue("description")}</Text>,
        meta: {
            label: ""
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <Flex gap={2}>
                <Link href={`/dashboard/category/${row.original.id}/edit`}>
                    <FaRegEdit size={22} color="gray" />
                </Link>
            </Flex>
        ),
        meta: {
            label: "Aksi"
        }
    }
];


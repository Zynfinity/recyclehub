"use client";

import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    Button,
    Flex,
    Box,
    Text
} from "@chakra-ui/react";

import { columns } from "./columns";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import { deleteCategory } from "../../../../services/category";
import cAlert from "@/theme/swal";

export function DataTable({ data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    return (
        <Flex gap={4} flexDir={"column"}>
            <Flex justifyContent={"space-between"} alignItems={"center"}>

                <Input size={{ base: "sm", md: "md" }} variant={"outline"} w={{ base: "150px", md: "sm" }}
                    placeholder="Filter kategori"
                    value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                />
                <Flex gap={4} alignItems={"center"}>
                    <Button
                        bgColor="red.500"
                        color={"white"}
                        size={"sm"}
                        fontSize="sm"
                        disabled={!table.getIsSomePageRowsSelected()}
                        onClick={() => {
                            const selectedRows = table.getSelectedRowModel().flatRows;
                            const ids = selectedRows.map((row) => row.original.id);

                            cAlert.fire({
                                title: "Yakin ingin menghapus data?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Ya",
                                cancelButtonText: "Tidak",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteProduct(ids);
                                    cAlert.fire("Deleted!", "Data berhasil dihapus.", "success").then(() => {
                                        window.location.reload();
                                    })

                                }
                            })
                        }}
                    >
                        <MdDeleteForever size={20} />
                    </Button>
                    <Link href={"/dashboard/category/create"}>
                        <Button bgColor={"primary"} fontSize="sm">Tambah</Button>
                    </Link>
                </Flex>

            </Flex>

            <TableContainer border="1px" borderColor="gray.200" borderRadius="md">
                <Table variant="simple" size="sm">
                    <Thead fontSize="sm" fontWeight={"normal"}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Td key={header.id} colSpan={header.colSpan} textAlign="left">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody fontWeight={"normal"}>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id} fontWeight={"normal"}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id} px={4} py={4}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Box>
                    <Text fontSize={"sm"} color={"gray.500"}>
                        Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                    </Text>
                </Box>
                <Flex gap={2}>
                    <Button variant={"solid"} fontSize={"sm"}
                        onClick={() => table.previousPage()}
                        isDisabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button variant={"solid"} fontSize={"sm"}
                        onClick={() => table.nextPage()}
                        isDisabled={!table.getCanNextPage()}
                    >
                        Berikutnya
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

"use client";

import * as React from "react";
import {
    useState
} from "react";
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
import { MdDeleteForever } from "react-icons/md";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { deleteUser } from "../../../../services/user";  // Assuming you have a deleteUser function
import Link from "next/link";
import { columns } from "./columns";

export function DataTable({ data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const table = useReactTable({
        data,
        columns: columns,  // User-specific columns
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
                    placeholder="Filter pengguna"
                    value={(table.getColumn("full_name")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("full_name")?.setFilterValue(event.target.value)
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

                            if (confirm("Yakin ingin menghapus data pengguna?")) {
                                deleteUser(ids);
                            }
                        }}
                    >
                        <MdDeleteForever size={20} />
                    </Button>
                    <Link href={"/dashboard/user/create"}>
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
                                    <Th key={header.id} colSpan={header.colSpan} textAlign="left">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody fontWeight={"normal"}>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
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
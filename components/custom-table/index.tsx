import * as React from 'react';
import { fadeIn } from "@/public/utils/motion";
import { motion } from "framer-motion";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Image from 'next/image';

export interface IColumn {
    label: string;
    accessor: string;
    Cell?: (row?: any) => React.ReactElement
    align?: 'left' | 'right' | 'center'
}

export default function TableTemplate({ data, columns }: { data: any[], columns: IColumn[] }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("up", 0, 0, 0.5)}
            className="mt-6"
        >
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow className=' font-medium'>
                            {columns.map(column =>
                                <TableCell
                                    className='!text-sm !font-medium !text-text-white'
                                    align={column.align} key={column.label}
                                >
                                    {column.label}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    {data.length > 0 &&
                        <TableBody>
                            {data.map((row: any, index) => (
                                <TableRow
                                    key={index} className='shadow-md'
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {columns.map(column => {
                                        return (
                                            <React.Fragment key={column.accessor}>
                                                {column.Cell
                                                    ? <TableCell className='flex items-center' style={{ justifyContent: column.align }}>{column.Cell(row)}</TableCell>
                                                    : <TableCell align={column.align}>{row[column.accessor]}</TableCell>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    }
                </Table>

                {data.length == 0 &&
                    <div className='w-[73%] flex flex-col items-center mx-auto text-base font-normal text-text-secondary'>
                        <Image
                            src="/images/received-invoices/box.svg"
                            width={320}
                            height={320}
                            alt=""
                        />
                        <p className="">There are no active salaries.</p>
                        <p className="">Set up individual or recurring salaries or even upload a CSV file to manage your salaries in batches.</p>
                    </div>
                }
            </TableContainer>
        </motion.div>
    );
}
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Pagination } from '@material-ui/lab';
import TablePagination from '@material-ui/core/TablePagination';
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

import { getTotalSizeofParent } from 'actionStore/FirebaseAction/parentAction';

const useStyles = makeStyles(styles);
const onePageCount = 20;
function Project(props) {
    const classes = useStyles();
    const [page, setPage] = useState(1); // total pages
    const [count, setCount] = useState(0); // current page

    useEffect(() => {
        getTotalPagesCount()
    }, [])

    const isFloat = (n) => {
        return Number(n) === n && n % 1 !== 0;
    }

    const getTotalPagesCount = async () => {
        const totalPages = await getTotalSizeofParent();
        const isCountFloat = isFloat(totalPages / onePageCount);
        if (isCountFloat) {
            const totalCount = (totalPages % onePageCount) + 1;
            setPage(totalCount)
        } else {
            const totalCount = (totalPages / onePageCount);
            setPage(totalCount)
        }
    }

    const handleChange = (event, value) => {
        // setPage(value);
        props.onNextPage(value);
    };

    const { tableHead, tableData, tableHeaderColor, status } = props;
    return (
        <div className={classes.tableResponsive}>
            <Table className={classes.table}>
                {tableHead !== undefined ? (
                    <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
                        <TableRow className={classes.tableHeadRow}>
                            {tableHead.map((prop, key) => {
                                return (
                                    <TableCell
                                        className={classes.tableCell + " " + classes.tableHeadCell}
                                        key={key}
                                    >
                                        {prop}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                ) : null}
                <TableBody>
                    {
                        tableData.length > 0 ?
                            tableData.map((item, key) => {
                                // console.log('----- tableData ----')
                                // console.log(item)
                                return (
                                    <TableRow key={key} className={classes.tableBodyRow}>
                                        <TableCell className={classes.tableCell} key={key}>
                                            {item.firstName} {item.lastName}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={key}>
                                            {item.email}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={key}>
                                            {item.primaryMobile}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={key}>
                                            {item.addressLine1}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                            : null
                    }
                    {/* {status === 'parents' ? */}
                    {/* <Pagination count={3} page={10} onChange={handleChange} /> */}
                    {/* <TablePagination rowsPerPageOptions={[]} colSpan={4} count={2} rowsPerPage={5} page={page} SelectProps={{
                        native: true
                    }} onChangePage={handleChange}  /> */}
                    <Pagination count={page} onChange={handleChange} />
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={page}
                        rowsPerPage={5}
                        page={page}
                        onPageChange={handleChange}
                    /> */}
                    {/* : null
                    } */}
                </TableBody>
            </Table>
        </div>
    )
}

Project.defaultProps = {
    tableHeaderColor: "gray",
};
Project.propTypes = {
    tableHeaderColor: PropTypes.oneOf([
        "warning",
        "primary",
        "danger",
        "success",
        "info",
        "rose",
        "gray",
    ]),
    tableHead: PropTypes.arrayOf(PropTypes.string),
    tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
export default Project

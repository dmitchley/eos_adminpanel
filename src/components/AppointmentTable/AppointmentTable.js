import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Edit from "@material-ui/icons/Edit";
import VpnKey from "@material-ui/icons/VpnKey";
import { getTotalSizeofAppointment } from 'actionStore/FirebaseAction/appointmentAction';
import styles from "./tableStyle";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// const headCells = [
//     { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
//     { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//     { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//     { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//     { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];

const headCells = [
    { id: 'Child_name', numeric: false, disablePadding: true, label: 'Child Name' },
    { id: 'Parent_name', numeric: false, disablePadding: true, label: 'Parent Name' },
    { id: 'className', numeric: false, disablePadding: true, label: 'Class Name' },
    { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
    { id: 'teacher', numeric: true, disablePadding: false, label: 'Teacher' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
    { id: 'startTime', numeric: false, disablePadding: false, label: 'Start Time' },
    // { id: 'duration', numeric: false, disablePadding: false, label: 'Duration' },
    { id: 'edit', numeric: false, disablePadding: false, label: 'Edit TimeSlot' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const { tableHead, tableData, tableHeaderColor, status } = props;

    return (
        <TableHead>
            <TableRow className={classes.tableBodyRow}>
                {/* <TableCell className={classes.tableCell} padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        className={classes.tableHeaderCell}
                        key={headCell.id}
                    >
                        {/* <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        > */}
                            {headCell.label}
                            {/* {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel> */}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Nutrition
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(styles);

export default function EnhancedTable(props) {
    const { tableHead, tableData, tableHeaderColor, status, showLoader } = props;

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [count, setCount] = React.useState(0); // current page
    const [emptyTimeout, setEmptyTimeout] = React.useState(false);

    useEffect(() => {
        getTotalPagesCount()
    }, [])

    const getTotalPagesCount = async () => {
        const totalPages = await getTotalSizeofAppointment();
        setCount(totalPages)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = tableData.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        const to = Math.min(((newPage + 1) * 3), count)
        validateOnNext(to)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, rowsPerPage));
        setPage(0);
    };

    const validateOnNext = (to) => {
        try {
            const currentPageLastRow = tableData[to - 1];
            const lastVisited = tableData[tableData.length - 1];
            if (currentPageLastRow.id !== lastVisited.id) {
                props.onNextPage();
            }
        } catch (error) {
            props.onNextPage();
        }
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

    const onAddChild = (selectedData) => {
        props.onAddChild(selectedData)
    }

    const onEditAppointment = (selectedData) => {
        props.onEditAppointment(selectedData)
    }

    const onSetPassword = (selectedData) => {
        props.onSetPassword(selectedData)
    }

    return (
        <div className={classes.root}>
            {/* <Paper className={classes.paper}> */}
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={tableData.length}
                    />
                    {/* {tableHead !== undefined ? (
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
                    ) : null} */}
                    <TableBody>
                        {stableSort(tableData, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        // onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        className={classes.tableBodyRow}
                                    >
                                        {/* <TableCell className={classes.tableCell} padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell> */}
                                        <TableCell className={classes.tableCell} component="th" id={labelId} scope="row" padding="none">
                                            {row.childName}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} component="th" id={labelId} scope="row" padding="none">
                                            {row.parent_name}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} component="th" id={labelId} scope="row" padding="none">
                                            {row.class_name}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} >{row.location_name}</TableCell>
                                        <TableCell className={classes.tableCell} >{row.teacherName == null ? '-' : row.teacherName}</TableCell>
                                        <TableCell className={classes.tableCell} >{row.date}</TableCell>
                                        <TableCell className={classes.tableCell} >{row.start_time}</TableCell>
                                        {/* <TableCell className={classes.tableCell} >{row.duration}</TableCell> */}
                                        <TableCell className={classes.tableActions}>
                                            <Tooltip
                                                id="tooltip-top"
                                                title="Edit timeSlot"
                                                placement="top"
                                                classes={{ tooltip: classes.tooltip }}
                                            >
                                                <IconButton
                                                    aria-label="Edit"
                                                    className={classes.tableActionButton}
                                                    onMouseDown={e => e.stopPropagation()}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        onEditAppointment(row)
                                                    }}
                                                >
                                                    <Edit className={classes.tableActionButtonIcon + " " + classes.edit} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {showLoader ? (
                            <TableRow style={{ height: (dense ? 33 : 53) * 3 }}>
                                {/* {emptyRows === 10
                                    && */}
                                <div
                                    style={{
                                        display: "block",
                                        width: '100%',
                                        height: '60%',
                                        position: "absolute",
                                        // left: 0,
                                        // right: 0,
                                        background: "rgba(255,255,255,0.8)",
                                        transition: "all .3s ease",
                                        // top: 0,
                                        // bottom: 0,
                                        textAlign: "center",
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        display: "table-row",
                                        verticalAlign: "middle",
                                        paddingTop: '20px',
                                    }}
                                    justify='center'
                                    alignItems="center"
                                >
                                    <CircularProgress justify='center' style={{ alignSelf: 'center', justifyContent: 'center', flex: 1 }} />
                                </div>
                                {/* } */}
                                <TableCell colSpan={6} />
                            </TableRow>
                        )
                            :
                            <>
                                {tableData.length <= 0
                                    &&
                                    <TableRow
                                        role="checkbox"
                                        tabIndex={-1}
                                        className={classes.tableBodyRow}
                                        style={{ height: (dense ? 33 : 53) * 3 }}
                                    >
                                        <TableCell colSpan={12} style={{ textAlign: 'center' }}  >NO DATA FOUND!!</TableCell>
                                    </TableRow>
                                }
                            </>
                        }

                        {/* {emptyRows === 3
                            && */}

                        {/* } */}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                // rowsPerPageOptions={[5, 10, 25]}
                rowsPerPageOptions={[20, 25, 30]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* </Paper> */}
            {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
        </div>
    );
}
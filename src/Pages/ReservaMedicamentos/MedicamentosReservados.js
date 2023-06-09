import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid , Stack} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import { Modal } from '@mui/material';



// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import SearchIcon from '@mui/icons-material/Search';
const Title = ({ children }) => {
  return (
      <p style={{fontWeight: "bold", margin: 0}}>{children}</p>
  );
}

const CustomBox = ({ children, style }) => {
  return (
      <Paper sx={{padding: "0 1em", boxSizing: "content-box", background: "#F4EEE5", ...style}} elevation={0}>
          {children}
      </Paper>
  );
}



function createData(id,code, name, lab, reserva,fecha) {
    return { id,code, name, lab, reserva, fecha };
}

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'code';
const DEFAULT_ROWS_PER_PAGE = 10;

const headCells = [
  { id: 'code', numeric: true, disablePadding: true, label: 'Código' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Medicamento' },
  { id: 'lab', numeric: false, disablePadding: false, label: 'Laboratorio' },
  { id: 'reserva', numeric: true, disablePadding: false, label: 'Cantidad Reservada' },
  { id: 'fecha', numeric: false, align: 'center', disablePadding: false, label: 'Fecha Llegada' },
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
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow bgcolor='#F4EEE5'> 
        <TableCell padding="checkbox">
          <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} inputProps={{ 'aria-label': 'Todos seleccionados' }} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? 'right' : (headCell.align ? headCell.align : 'left')} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false} >
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),}), }} >
      
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div" >
          {numSelected} seleccionado
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div" >
          Listado
        </Typography>
      )}

      {numSelected === 1 ? (
        <Tooltip title="Acciones">
          <IconButton>
            <ModeEditOutlineIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div></div>
      )}

      {numSelected >= 1 ? (
        <div>
        {/* <Tooltip title="Delte">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}
      </div>
      ) : (
        <div>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
        
      )}
    </Toolbar>
  );
}
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
export default function MedicamentosReservados () {
  
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);

  const [medicamento, setMedicamento] = useState('');
  const [info, setInfo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [fecha, setFecha] = React.useState('');
  const [laboratorio, setLab] = React.useState('');
  const [code, setCode] = React.useState('');

  const [rows, setRows] = React.useState([]); // Estado local para almacenar las filas
  const [respaldo, setRespaldo] = React.useState([]); 
  // Función para actualizar las filas y el HTML de forma reactiva
  const updateRows = (newRows) => {
    setRows(newRows);
    setVisibleRows(newRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  };
  async function GetData() {
           
    await fetch("http://localhost:8090/graphql", 
      {
        method: 'POST',
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          "query": `query GetReservas {
                      getReservas {
                        cantidadReservada
                        codigo
                        fechaLlegada
                        laboratorio
                        nombreMedicamento
                      }
                    }`,
          "operationName": "GetReservas",
          "variables":   {  }
        })
    })
      .then((response) => response.json())
      .then((data) => {
        let valores = data.data.getReservas;
        let newfilas = [];
        for (let i = 0; i < valores.length; i++) {
          newfilas.push(
            createData(
              i,
              valores[i].codigo,
              valores[i].nombreMedicamento,
              valores[i].laboratorio,
              valores[i].cantidadReservada,
              valores[i].fechaLlegada
            )
          );
        }
        updateRows(newfilas); // Actualizar las filas y el HTML reactivamente
        setRespaldo(newfilas);
      });
  }
  React.useEffect(() => {
    // ...
    GetData();
    // ...
  }, []);
  
  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);
    },
    [o],
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
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

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);
      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy],
  );

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpenFilter] = React.useState(false);
  const handleOpenFilter = () => setOpenFilter(true);
  const handleCloseFilter = () => setOpenFilter(false);
  
  const Filtrar = (search) => {
    console.log("search:",search)
    if (search === "") {
      updateRows(respaldo);
    }
    else {
      let filas = [];
      respaldo.forEach(i => {
        console.log(i)
        // { id,code, name, lab, reserva, fecha };
        if (i.code.toLowerCase().includes(search.toLowerCase()) ||
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.lab.toLowerCase().includes(search.toLowerCase()) ||
            (i.reserva + "").toLowerCase().includes(search.toLowerCase()) ||
            i.fecha.toLowerCase().includes(search.toLowerCase())) {
          filas.push(i);
        }
      });
      updateRows(filas);
      
    }
    
  }
  const AddReserva = () => {
    if (medicamento === "" || code === "" || cantidad === "" || cantidad <= 0 || laboratorio === "" || fecha === "") 
    {
      setInfo("(*) Complete todos los campos");
      return;
    }
    else  {
      setInfo("");
      const data = {
        "query": `mutation AddReserva($input: Reserva_Input) {
          addReserva(input: $input) {
            codigo
            cantidadReservada
            fechaLlegada
            laboratorio
            nombreMedicamento
        
          }
        }`,
        "operationName": "AddReserva",
        "variables":   { 
          "input": {
            "cantidadReservada": cantidad*1,
            "fechaLlegada": fecha,
            "laboratorio": laboratorio,
            "codigo": code,
            "nombreMedicamento": medicamento
          }
        } 
      }
      fetch("http://localhost:8090/graphql", {
        method: 'POST',
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify(data)
      }).then(response=>response.json()).then(data => {
        setOpen(false);
        GetData();
      });
    }
  }

  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{margin: '20px', padding: '20px'}}>
      
          <h1>Reserva de Medicamentos</h1>
          
          <div style={{marginBottom: '20px', color: 'black', borderRadius: '5px', display: 'inline-flex',width: '100%'}}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={10}>
              <div style={{backgroundColor: '#F4EEE5', width: '100%', borderRadius: '5px', display: 'flex'}}>
                  <IconButton type="button" sx={{ p: '10px' }} aria-label="search" >
                      <SearchIcon />
                  </IconButton>
                  <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Buscar..." inputProps={{ 'aria-label': 'Buscar...' }} onChange={(event) => Filtrar(event.target.value)} />
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <Button onClick={handleOpen} variant="contained" style={{backgroundColor: '#F4EEE5', color: 'black', boxShadow: 'none',  width:'100%'}}><AddIcon /></Button>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Paper sx={{width:"50%", top:"50%", left:"50%", position:"relative", transform: "translate(-50%,-50%)",backgroundColor: "#FEFBF6"}}>
                    <Paper sx={{background:"#F4EEE5", padding: '1em'}} elevation={0}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <b>Agregar Medicamento</b>
                    </Typography>
                    </Paper>
                    <span style={{ textAlign: "center", display: "block",color: "red" }}>{info}</span>
                    <Grid container spacing={2} sx={{padding:"1em"}}>
                      <Grid item xs={3}>
                        <Grid item xs={12}>
                            <Title>Código Medicamento</Title>
                            <CustomBox>
                                <InputBase sx={{width: "100%"}} placeholder='Ingrese código...' value={code} onChange={(event) => setCode(event.target.value)}></InputBase>
                            </CustomBox>
                        </Grid>
                      </Grid>
                      <Grid item xs={9}>
                        <Grid item xs={12}>
                            <Title>Medicamento</Title>
                            <CustomBox>
                                <InputBase sx={{width: "100%"}} placeholder='Ingrese medicamento...' value={medicamento} onChange={(event) => setMedicamento(event.target.value)}></InputBase>
                            </CustomBox>
                        </Grid>
                      </Grid>
                      <Grid item xs={3}>
                        <Grid item xs={12}>
                            <Title>Cantidad</Title>
                            <CustomBox>
                                <InputBase sx={{width: "100%"}} placeholder='0' value={cantidad} onChange={(event) => setCantidad(event.target.value)}></InputBase>
                            </CustomBox>
                        </Grid>
                      </Grid>
                      <Grid item xs={4}>
                        <Grid item xs={12}>
                            <Title>Fecha de Llegada</Title>
                            <CustomBox>
                                <InputBase sx={{width: "100%"}} placeholder='Ingrese Fecha de llegada...' value={fecha} onChange={(event) => setFecha(event.target.value)}></InputBase>
                            </CustomBox>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Title>Laboratorio</Title>
                            <CustomBox>
                                <InputBase sx={{width: "100%"}} placeholder='Ingrese Laboratorio...' value={laboratorio} onChange={(event) => setLab(event.target.value)}></InputBase>
                            </CustomBox>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                            <Button variant="contained" sx={{backgroundColor: "#A6D1E6", color: "#2C2C2F"}} onClick={handleClose}>Cancelar</Button>
                            <Button variant="contained" sx={{backgroundColor: "#A6D1E6", color: "#2C2C2F"}} onClick={AddReserva}>Agregar</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Modal>
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <Button onClick={handleOpenFilter} variant="contained" style={{backgroundColor: '#F4EEE5', color: 'black', marginRight: '10px', boxShadow: 'none', width:'100%'}}><FilterAltIcon /></Button>
              </Grid>
            </Grid>
          </div>
          
          <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>                
                  <EnhancedTableToolbar numSelected={selected.length} />
  
                  <TableContainer>
                      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                          <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length}/>
                          <TableBody bgcolor='#FEFBF6'>
                          {visibleRows ? visibleRows.map((row, index) => {
                                  const isItemSelected = isSelected(row.name);
                                  const labelId = `enhanced-table-checkbox-${index}`;
                                  return (
                                  <TableRow hover onClick={(event) => handleClick(event, row.name)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
                                      <TableCell padding="checkbox">
                                      <Checkbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                                      </TableCell>
                                      <TableCell component="th" id={labelId} scope="row" padding="none" align='right'>{row.code} </TableCell>
                                      <TableCell align="left">{row.name}</TableCell>
                                      <TableCell align="left">{row.lab}</TableCell>
                                      <TableCell align="right">{row.reserva}</TableCell>
                                      <TableCell align="center">{row.fecha}</TableCell>
                                  </TableRow>
                                  );
                              })
                              : null}
                          {paddingHeight > 0 && (
                              <TableRow style={{ height: paddingHeight, }}>
                                  <TableCell colSpan={6} />
                              </TableRow>
                          )}
                          </TableBody>
                      </Table>
                  </TableContainer>
  
                  <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
              </Paper>
          </Box>
  
          <Button style={{display: 'flex', float: 'right', backgroundColor: "#A6D1E6", color: "#2C2C2F"}} variant="contained" startIcon={<GetAppIcon />}> Generar Reporte</Button>
      </Paper>);  
}
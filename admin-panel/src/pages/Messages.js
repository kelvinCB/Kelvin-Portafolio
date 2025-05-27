import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Collapse,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MarkEmailRead as MarkReadIcon,
  MarkEmailUnread as MarkUnreadIcon,
  DeleteOutline as DeleteIcon,
  FilterAlt as FilterIcon,
  FilterAltOff as FilterOffIcon,
  Label as LabelIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMessages, 
  updateReadStatus, 
  updateStarredStatus,
  deleteMessage,
  exportMessagesToCSV
} from '../services/messageService';

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const searchParams = new URLSearchParams(location.search);
  
  // State for filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [filterRead, setFilterRead] = useState(
    searchParams.get('read') ? searchParams.get('read') === 'true' : null
  );
  const [filterStarred, setFilterStarred] = useState(
    searchParams.get('starred') ? searchParams.get('starred') === 'true' : null
  );
  const [filterDateFrom, setFilterDateFrom] = useState(
    searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')) : null
  );
  const [filterDateTo, setFilterDateTo] = useState(
    searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')) : null
  );
  const [showFilters, setShowFilters] = useState(false);
  
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Build query parameters
  const queryParams = {
    page: page + 1, // API usa 1-indexed
    limit: rowsPerPage,
    ...(searchText && { search: searchText }),
    ...(filterRead !== null && { read: filterRead }),
    ...(filterStarred !== null && { starred: filterStarred }),
    ...(filterDateFrom && { dateFrom: filterDateFrom.toISOString().split('T')[0] }),
    ...(filterDateTo && { dateTo: filterDateTo.toISOString().split('T')[0] })
  };

  // Query messages
  const { 
    data: messagesData, 
    isLoading: isLoadingMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['messages', queryParams],
    queryFn: () => getMessages(queryParams),
  });

  // Mutaciones
  const markReadMutation = useMutation({
    mutationFn: ({ id, read }) => updateReadStatus(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const markStarredMutation = useMutation({
    mutationFn: ({ id, starred }) => updateStarredStatus(id, starred),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setDeleteDialogOpen(false);
    }
  });

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.set('search', searchText);
    if (filterRead !== null) params.set('read', filterRead);
    if (filterStarred !== null) params.set('starred', filterStarred);
    if (filterDateFrom) params.set('dateFrom', filterDateFrom.toISOString().split('T')[0]);
    if (filterDateTo) params.set('dateTo', filterDateTo.toISOString().split('T')[0]);
    
    const newSearch = params.toString();
    if (newSearch !== location.search.slice(1)) {
      navigate({
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : ''
      }, { replace: true });
    }
  }, [searchText, filterRead, filterStarred, filterDateFrom, filterDateTo, navigate, location]);

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const handleReadStatusChange = (id, read) => {
    markReadMutation.mutate({ id, read: !read });
  };

  const handleStarredStatusChange = (id, starred) => {
    markStarredMutation.mutate({ id, starred: !starred });
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      deleteMutation.mutate(messageToDelete._id);
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportMessagesToCSV(queryParams);
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilterRead(null);
    setFilterStarred(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
  };

  // Renderizado
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mensajes
        </Typography>
        
        <Box>
          <Tooltip title="Exportar a CSV">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              sx={{ mr: 1 }}
            >
              Exportar
            </Button>
          </Tooltip>
          
          <Tooltip title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}>
            <Button
              variant={showFilters ? "contained" : "outlined"}
              color="primary"
              startIcon={showFilters ? <FilterOffIcon /> : <FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Filtros */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar"
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Leído</InputLabel>
                  <Select
                    value={filterRead === null ? '' : filterRead.toString()}
                    label="Leído"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterRead(value === '' ? null : value === 'true');
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Leídos</MenuItem>
                    <MenuItem value="false">No leídos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Destacado</InputLabel>
                  <Select
                    value={filterStarred === null ? '' : filterStarred.toString()}
                    label="Destacado"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterStarred(value === '' ? null : value === 'true');
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Destacados</MenuItem>
                    <MenuItem value="false">No destacados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="Desde"
                    value={filterDateFrom}
                    onChange={setFilterDateFrom}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <DatePicker
                    label="Hasta"
                    value={filterDateTo}
                    onChange={setFilterDateTo}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </LocalizationProvider>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleClearFilters}
                >
                  Limpiar filtros
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
      
      {/* Tabla de mensajes */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width="5%"></TableCell>
                <TableCell width="5%"></TableCell>
                <TableCell width="20%">Nombre</TableCell>
                <TableCell width="20%">Email</TableCell>
                <TableCell width="30%">Mensaje</TableCell>
                <TableCell width="15%">Fecha</TableCell>
                <TableCell width="5%">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingMessages ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : messagesError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    Error al cargar mensajes: {messagesError.message}
                  </TableCell>
                </TableRow>
              ) : messagesData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No se encontraron mensajes con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                messagesData?.data?.map((message) => (
                  <TableRow
                    key={message._id}
                    hover
                    onClick={() => navigate(`/messages/${message._id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: !message.read ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                    }}
                  >
                    <TableCell padding="checkbox">
                      <IconButton
                        aria-label={message.starred ? "Quitar destacado" : "Destacar"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarredStatusChange(message._id, message.starred);
                        }}
                        size="small"
                      >
                        {message.starred ? (
                          <StarIcon fontSize="small" color="warning" />
                        ) : (
                          <StarBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        aria-label={message.read ? "Marcar como no leído" : "Marcar como leído"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadStatusChange(message._id, message.read);
                        }}
                        size="small"
                      >
                        {message.read ? (
                          <MarkUnreadIcon fontSize="small" />
                        ) : (
                          <MarkReadIcon fontSize="small" color="primary" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={!message.read ? 'bold' : 'normal'}>
                        {message.name}
                      </Typography>
                      {message.tags && message.tags.length > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {message.tags.slice(0, 2).map((tag) => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              icon={<LabelIcon />}
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                          {message.tags.length > 2 && (
                            <Chip 
                              label={`+${message.tags.length - 2}`} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {message.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Delete"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(message);
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={messagesData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => {
            const handleFirstPageButtonClick = () => {
              onPageChange(null, 0);
            };
          
            const handleBackButtonClick = () => {
              onPageChange(null, page - 1);
            };
          
            const handleNextButtonClick = () => {
              onPageChange(null, page + 1);
            };
          
            const handleLastPageButtonClick = () => {
              onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
            };
          
            return (
              <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                  onClick={handleFirstPageButtonClick}
                  disabled={page === 0}
                  aria-label="first page"
                >
                  {'<<'}
                </IconButton>
                <IconButton
                  onClick={handleBackButtonClick}
                  disabled={page === 0}
                  aria-label="previous page"
                >
                  {'<'}
                </IconButton>
                <IconButton
                  onClick={handleNextButtonClick}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label="next page"
                >
                  {'>'}
                </IconButton>
                <IconButton
                  onClick={handleLastPageButtonClick}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label="last page"
                >
                  {'>>'}
                </IconButton>
              </Box>
            );
          }}
        />
      </Paper>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages;

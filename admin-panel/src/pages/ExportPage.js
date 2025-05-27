import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  GetApp as DownloadIcon,
  FilterAlt as FilterIcon,
  Mail as MailIcon,
  Star as StarIcon,
  Today as TodayIcon,
  LastPage as LastMonthIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { exportMessagesToCSV } from '../services/messageService';

const ExportPage = () => {
  // State for export filters
  const [read, setRead] = useState('');
  const [starred, setStarred] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [limit, setLimit] = useState(1000);
  
  // State for UI
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Function to get predefined dates
  const getPresetDate = (preset) => {
    const today = new Date();
    let from = new Date();
    
    switch (preset) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        from.setDate(today.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        break;
      case 'last7':
        from.setDate(today.getDate() - 7);
        break;
      case 'last30':
        from.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        let to = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateTo(to);
        break;
      case 'thisYear':
        from = new Date(today.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        from = new Date(today.getFullYear() - 1, 0, 1);
        let toLastYear = new Date(today.getFullYear() - 1, 11, 31);
        setDateTo(toLastYear);
        break;
      default:
        from = null;
    }
    
    setDateFrom(from);
    if (!['lastMonth', 'lastYear'].includes(preset)) {
      setDateTo(preset === 'today' || preset === 'yesterday' ? new Date(from) : null);
    }
  };
  
  // Handle export
  const handleExport = async () => {
    setLoading(true);
    
    try {
      // Build parameters for export
      const params = {};
      if (read !== '') params.read = read === 'true';
      if (starred !== '') params.starred = starred === 'true';
      if (dateFrom) params.dateFrom = dateFrom.toISOString().split('T')[0];
      if (dateTo) params.dateTo = dateTo.toISOString().split('T')[0];
      if (limit > 0) params.limit = limit;
      
      await exportMessagesToCSV(params);
      
      setAlertMessage('Export completed successfully');
      setAlertSeverity('success');
    } catch (error) {
      console.error('Export error:', error);
      setAlertMessage('Error exporting messages: ' + (error.message || 'Unknown error'));
      setAlertSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };
  
  // Handle filter clearing
  const handleClearFilters = () => {
    setRead('');
    setStarred('');
    setDateFrom(null);
    setDateTo(null);
    setLimit(1000);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Export Messages
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Export Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="read-select-label">Estado de lectura</InputLabel>
                <Select
                  labelId="read-select-label"
                  value={read}
                  label="Estado de lectura"
                  onChange={(e) => setRead(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Leídos</MenuItem>
                  <MenuItem value="false">No leídos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="starred-select-label">Destacados</InputLabel>
                <Select
                  labelId="starred-select-label"
                  value={starred}
                  label="Destacados"
                  onChange={(e) => setStarred(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Destacados</MenuItem>
                  <MenuItem value="false">No destacados</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Límite de registros"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
                fullWidth
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Fecha desde"
                value={dateFrom}
                onChange={setDateFrom}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Fecha hasta"
                value={dateTo}
                onChange={setDateTo}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" component="div" gutterBottom>
              Periodos predefinidos:
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip 
                icon={<TodayIcon />} 
                label="Hoy" 
                onClick={() => getPresetDate('today')} 
                color={dateFrom?.toDateString() === new Date().toDateString() && !dateTo ? 'primary' : 'default'}
              />
              <Chip 
                icon={<TodayIcon />} 
                label="Ayer" 
                onClick={() => getPresetDate('yesterday')} 
              />
              <Chip 
                icon={<CalendarIcon />} 
                label="Últimos 7 días" 
                onClick={() => getPresetDate('last7')} 
              />
              <Chip 
                icon={<CalendarIcon />} 
                label="Últimos 30 días" 
                onClick={() => getPresetDate('last30')} 
              />
              <Chip 
                icon={<CalendarIcon />} 
                label="Este mes" 
                onClick={() => getPresetDate('thisMonth')} 
              />
              <Chip 
                icon={<LastMonthIcon />} 
                label="Mes pasado" 
                onClick={() => getPresetDate('lastMonth')} 
              />
              <Chip 
                icon={<CalendarIcon />} 
                label="Este año" 
                onClick={() => getPresetDate('thisYear')} 
              />
              <Chip 
                icon={<CalendarIcon />} 
                label="Año pasado" 
                onClick={() => getPresetDate('lastYear')} 
              />
            </Stack>
          </Box>
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<FilterIcon />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={loading}
          >
            Export to CSV
          </Button>
        </CardActions>
      </Card>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Common Exports
              </Typography>
              
              <Stack spacing={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<MailIcon />} 
                  onClick={() => {
                    setRead('false');
                    handleExport();
                  }}
                  fullWidth
                >
                  Export unread messages
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<StarIcon />} 
                  onClick={() => {
                    setStarred('true');
                    handleExport();
                  }}
                  fullWidth
                >
                  Export starred messages
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<TodayIcon />} 
                  onClick={() => {
                    getPresetDate('thisMonth');
                    setTimeout(handleExport, 100); // small delay to ensure states are updated
                  }}
                  fullWidth
                >
                  Export messages from this month
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Export Guide
              </Typography>
              
              <Typography variant="body2" paragraph>
                Exported CSV files can be opened with:
              </Typography>
              
              <ul>
                <li>Microsoft Excel</li>
                <li>Google Sheets</li>
                <li>LibreOffice Calc</li>
                <li>Cualquier editor de texto</li>
              </ul>
              
              <Typography variant="body2" paragraph>
                Files include the following columns:
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">• ID</Typography>
                  <Typography variant="body2">• Name</Typography>
                  <Typography variant="body2">• Email</Typography>
                  <Typography variant="body2">• Phone</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">• Message</Typography>
                  <Typography variant="body2">• Date</Typography>
                  <Typography variant="body2">• Status (read/unread)</Typography>
                  <Typography variant="body2">• Starred</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExportPage;

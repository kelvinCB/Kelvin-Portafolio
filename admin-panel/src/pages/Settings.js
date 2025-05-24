import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Divider,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Backup as BackupIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  DeleteForever as DeleteForeverIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// URL base de la API
const API_URL = 'http://localhost:5000/api';

const Settings = () => {
  const { currentUser } = useAuth();
  
  // Estado para las configuraciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [theme, setTheme] = useState('light');
  
  // Estado para la configuración de seguridad
  const [rateLimitRequests, setRateLimitRequests] = useState(100);
  const [rateLimitTime, setRateLimitTime] = useState(15);
  
  // Estado para la UI
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Manejar guardado de configuraciones
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Aquí se enviaría la solicitud a la API para guardar las configuraciones
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      
      setSuccessMessage('Configuraciones guardadas correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage('Error al guardar las configuraciones');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cierre del Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Manejar backup manual
  const handleManualBackup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/config/backup`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccessMessage('Backup realizado correctamente: ' + response.data.message);
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage('Error al realizar el backup: ' + (error.response?.data?.message || error.message));
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar eliminación de datos antiguos
  const handleDeleteOldData = async () => {
    if (window.confirm('¿Estás seguro de eliminar mensajes con más de un año de antigüedad? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const response = await axios.delete(`${API_URL}/messages/batch`, {
          params: {
            beforeDate: oneYearAgo.toISOString()
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSuccessMessage(`Se eliminaron ${response.data.deletedCount} mensajes antiguos correctamente`);
        setSnackbarOpen(true);
      } catch (error) {
        setErrorMessage('Error al eliminar datos antiguos: ' + (error.response?.data?.message || error.message));
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración
      </Typography>
      
      <Grid container spacing={3}>
        {/* Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} /> Notificaciones
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Notificaciones por email" 
                    secondary="Recibe emails cuando lleguen nuevos mensajes"
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      edge="end"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider />
                
                {emailNotifications && (
                  <ListItem>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <TextField
                        label="Correo para notificaciones"
                        defaultValue={currentUser?.email}
                        variant="outlined"
                        fullWidth
                      />
                    </FormControl>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Backups */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BackupIcon sx={{ mr: 1 }} /> Copias de seguridad
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Backup automático" 
                    secondary="Realizar copias de seguridad automáticas"
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      edge="end"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider />
                
                {autoBackup && (
                  <ListItem>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="backup-frequency-label">Frecuencia de backup</InputLabel>
                      <Select
                        labelId="backup-frequency-label"
                        value={backupFrequency}
                        label="Frecuencia de backup"
                        onChange={(e) => setBackupFrequency(e.target.value)}
                      >
                        <MenuItem value="daily">Diaria</MenuItem>
                        <MenuItem value="weekly">Semanal</MenuItem>
                        <MenuItem value="monthly">Mensual</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                )}
              </List>
            </CardContent>
            <CardActions>
              <Button 
                startIcon={<BackupIcon />}
                variant="outlined" 
                color="primary"
                onClick={handleManualBackup}
                disabled={loading}
              >
                Backup manual
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Seguridad */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} /> Seguridad
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Límite de peticiones"
                    type="number"
                    value={rateLimitRequests}
                    onChange={(e) => setRateLimitRequests(Number(e.target.value))}
                    InputProps={{ inputProps: { min: 10 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Intervalo (minutos)"
                    type="number"
                    value={rateLimitTime}
                    onChange={(e) => setRateLimitTime(Number(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Limita los intentos de login a {rateLimitRequests} peticiones por {rateLimitTime} minutos para prevenir ataques de fuerza bruta.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Apariencia */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} /> Apariencia
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="theme-select-label">Tema</InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={theme}
                  label="Tema"
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Oscuro</MenuItem>
                  <MenuItem value="system">Sistema</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Mantenimiento */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                <WarningIcon sx={{ mr: 1 }} /> Zona de peligro
              </Typography>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                Las siguientes acciones pueden eliminar datos de forma permanente. Proceda con precaución.
              </Alert>
              
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleDeleteOldData}
              >
                Eliminar mensajes con más de 1 año de antigüedad
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Botones de acción */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={loading}
          size="large"
        >
          Guardar configuración
        </Button>
      </Box>
      
      {/* Snackbar para mensajes */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={errorMessage ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;

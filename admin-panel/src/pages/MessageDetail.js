import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Tooltip,
  Stack,
  Link
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MarkEmailRead as MarkReadIcon,
  MarkEmailUnread as MarkUnreadIcon,
  DeleteOutline as DeleteIcon,
  Label as LabelIcon,
  Add as AddIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMessage, 
  updateReadStatus, 
  updateStarredStatus,
  updateTags,
  deleteMessage 
} from '../services/messageService';

const MessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estados
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  
  // Consultar mensaje
  const { 
    data: message, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['message', id],
    queryFn: () => getMessage(id),
  });
  
  // Mutaciones
  const markReadMutation = useMutation({
    mutationFn: ({ id, read }) => updateReadStatus(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message', id] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const markStarredMutation = useMutation({
    mutationFn: ({ id, starred }) => updateStarredStatus(id, starred),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message', id] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const updateTagsMutation = useMutation({
    mutationFn: ({ id, tags, action }) => updateTags(id, tags, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message', id] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setTagInput('');
      setTagDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      navigate('/messages');
    }
  });
  
  // Handlers
  const handleAddTag = () => {
    if (tagInput.trim()) {
      updateTagsMutation.mutate({ 
        id: message._id, 
        tags: [tagInput.trim()], 
        action: 'add' 
      });
    }
  };
  
  const handleRemoveTag = (tag) => {
    updateTagsMutation.mutate({ 
      id: message._id, 
      tags: [tag], 
      action: 'remove' 
    });
  };
  
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(message._id);
  };
  
  // Si el mensaje no está marcado como leído al cargarlo, marcarlo automáticamente
  React.useEffect(() => {
    if (message && !message.read) {
      markReadMutation.mutate({ id: message._id, read: true });
    }
  }, [message, markReadMutation]);
  
  // Crear mensajes predefinidos para WhatsApp
  const getWhatsAppLink = () => {
    if (!message || !message.phone) return null;
    
    const phone = message.phone.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    const text = encodeURIComponent(`Hola ${message.name}, gracias por tu mensaje.`);
    return `https://wa.me/${phone}?text=${text}`;
  };
  
  const getEmailLink = () => {
    if (!message || !message.email) return null;
    
    const subject = encodeURIComponent(`RE: Mensaje del portafolio`);
    const body = encodeURIComponent(`Hola ${message.name},\n\nGracias por tu mensaje.\n\n`);
    return `mailto:${message.email}?subject=${subject}&body=${body}`;
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Error al cargar el mensaje: {error.message}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => refetch()}
          >
            Intentar de nuevo
          </Button>
        </Paper>
      </Box>
    );
  }
  
  if (!message) {
    return (
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            Mensaje no encontrado
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/messages')}
          >
            Volver a mensajes
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/messages')} 
          sx={{ mr: 2 }}
          aria-label="Volver a mensajes"
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h4" component="h1">
          Mensaje de {message.name}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title={message.starred ? "Quitar destacado" : "Destacar"}>
          <IconButton 
            onClick={() => markStarredMutation.mutate({ id: message._id, starred: !message.starred })}
            color={message.starred ? "warning" : "default"}
          >
            {message.starred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={message.read ? "Marcar como no leído" : "Marcar como leído"}>
          <IconButton 
            onClick={() => markReadMutation.mutate({ id: message._id, read: !message.read })}
            color={!message.read ? "primary" : "default"}
          >
            {message.read ? <MarkUnreadIcon /> : <MarkReadIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Eliminar mensaje">
          <IconButton 
            onClick={() => setDeleteDialogOpen(true)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3}>
        {/* Detalles del mensaje */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  <ScheduleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Recibido: {new Date(message.createdAt).toLocaleString()}
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Mensaje:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                {message.message}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Etiquetas:
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {message.tags && message.tags.length > 0 ? (
                    message.tags.map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        color="primary" 
                        variant="outlined"
                        icon={<LabelIcon />}
                        onDelete={() => handleRemoveTag(tag)}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay etiquetas
                    </Typography>
                  )}
                  
                  <Chip 
                    icon={<AddIcon />} 
                    label="Añadir etiqueta" 
                    onClick={() => setTagDialogOpen(true)}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Información del contacto */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de contacto
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Email:
                </Typography>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  <Link href={`mailto:${message.email}`}>{message.email}</Link>
                </Typography>
              </Box>
              
              {message.phone && (
                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> Teléfono:
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    <Link href={`tel:${message.phone}`}>{message.phone}</Link>
                  </Typography>
                </Box>
              )}
            </CardContent>
            
            <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Responder:
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmailIcon />}
                href={getEmailLink()}
                fullWidth
                sx={{ mb: 1 }}
              >
                Responder por Email
              </Button>
              
              {message.phone && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  Responder por WhatsApp
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Diálogo para añadir etiqueta */}
      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)}>
        <DialogTitle>Add tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Introduce una nueva tag para este mensaje. Las tags te ayudan a organizar tus mensajes.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="tag"
            label="Tag"
            type="text"
            fullWidth
            variant="outlined"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddTag} 
            color="primary"
            disabled={!tagInput.trim() || updateTagsMutation.isPending}
          >
            {updateTagsMutation.isPending ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
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

export default MessageDetail;

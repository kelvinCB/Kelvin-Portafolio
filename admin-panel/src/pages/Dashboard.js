import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider, 
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon,
  MailOutline as UnreadIcon,
  Star as StarIcon,
  Schedule as RecentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../services/messageService';

const StatCard = ({ title, value, icon, color, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'translateY(-5px)' : 'none',
          boxShadow: onClick ? 4 : 1
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ textAlign: 'center', my: 2 }}>
          {value !== undefined ? value : <CircularProgress size={40} />}
        </Typography>
      </CardContent>
      {onClick && (
        <CardActions>
          <Button size="small" color={color} onClick={onClick}>Ver detalles</Button>
        </CardActions>
      )}
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Consultar todos los mensajes (con límite pequeño para la página principal)
  const { data: allMessagesData, isLoading: allLoading } = useQuery({
    queryKey: ['messages', { limit: 10 }],
    queryFn: () => getMessages({ limit: 10 }),
  });
  
  // Consultar mensajes no leídos
  const { data: unreadMessagesData, isLoading: unreadLoading } = useQuery({
    queryKey: ['messages', { read: false, limit: 5 }],
    queryFn: () => getMessages({ read: false, limit: 5 }),
  });
  
  // Consultar mensajes destacados
  const { data: starredMessagesData, isLoading: starredLoading } = useQuery({
    queryKey: ['messages', { starred: true, limit: 5 }],
    queryFn: () => getMessages({ starred: true, limit: 5 }),
  });

  const totalMessages = allMessagesData?.total || 0;
  const unreadMessages = unreadMessagesData?.total || 0;
  const starredMessages = starredMessagesData?.total || 0;
  
  // Lista de los mensajes más recientes
  const recentMessages = allMessagesData?.data || [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total de mensajes */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Mensajes" 
            value={allLoading ? undefined : totalMessages}
            icon={<EmailIcon />}
            color="primary"
            onClick={() => navigate('/messages')}
          />
        </Grid>
        
        {/* Mensajes no leídos */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="No leídos" 
            value={unreadLoading ? undefined : unreadMessages} 
            icon={<UnreadIcon />}
            color="error"
            onClick={() => navigate('/messages?read=false')}
          />
        </Grid>
        
        {/* Mensajes destacados */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Destacados" 
            value={starredLoading ? undefined : starredMessages} 
            icon={<StarIcon />}
            color="warning"
            onClick={() => navigate('/messages?starred=true')}
          />
        </Grid>
        
        {/* Mensajes hoy */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Último mes" 
            value={allLoading ? undefined : totalMessages} 
            icon={<RecentIcon />}
            color="success"
            onClick={() => {
              const date = new Date();
              date.setMonth(date.getMonth() - 1);
              navigate(`/messages?dateFrom=${date.toISOString().split('T')[0]}`);
            }}
          />
        </Grid>
      </Grid>
      
      {/* Mensajes recientes */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Mensajes recientes
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        {allLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : recentMessages.length > 0 ? (
          <List>
            {recentMessages.map((message, index) => (
              <React.Fragment key={message._id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: !message.read ? 'action.hover' : 'inherit'
                  }}
                  onClick={() => navigate(`/messages/${message._id}`)}
                >
                  <ListItemAvatar>
                    <Avatar>{message.name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          component="span" 
                          variant="subtitle1"
                          sx={{ 
                            fontWeight: !message.read ? 'bold' : 'normal',
                            mr: 1
                          }}
                        >
                          {message.name}
                        </Typography>
                        {message.starred && (
                          <StarIcon fontSize="small" color="warning" />
                        )}
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ ml: 'auto' }}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {message.email} {message.phone && `- ${message.phone}`}
                        </Typography>
                        <Typography
                          component="p"
                          variant="body2"
                          color="text.secondary"
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
                      </>
                    }
                  />
                </ListItem>
                {index < recentMessages.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
            No hay mensajes disponibles
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/messages')}
          >
            Ver todos los mensajes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;

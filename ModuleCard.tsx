import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip, Tooltip, Grid, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  position: 'relative',
  overflow: 'visible',
}));

const StatusIndicator = styled('div')(({ status }: { status: 'online' | 'offline' | 'error' }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 
    status === 'online' ? '#4caf50' : 
    status === 'offline' ? '#9e9e9e' : '#f44336',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
}));

const TagContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

interface ModuleCardProps {
  name: string;
  description?: string;
  status?: 'online' | 'offline' | 'error';
  tags?: string[];
  version?: string;
  author?: string;
  usage?: number; // 0-100 percentage
  onClick?: () => void;
  onInfoClick?: (e: React.MouseEvent) => void;
  onCodeClick?: (e: React.MouseEvent) => void;
  onShareClick?: (e: React.MouseEvent) => void;
  onFavoriteClick?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  name,
  description = 'No description available',
  status = 'offline',
  tags = [],
  version = '',
  author = '',
  usage = 0,
  onClick,
  onInfoClick,
  onCodeClick,
  onShareClick,
  onFavoriteClick,
  isFavorite = false,
}) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/module/${name}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onFavoriteClick) onFavoriteClick(e);
  };

  const handleActionClick = (e: React.MouseEvent, callback?: (e: React.MouseEvent) => void) => {
    e.stopPropagation();
    if (callback) callback(e);
  };

  // Truncate description if too long
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 97)}...` 
    : description;

  return (
    <StyledCard onClick={handleCardClick}>
      <StatusIndicator status={status} />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom noWrap>
            {name}
          </Typography>
          {version && (
            <Chip 
              label={`v${version}`} 
              size="small" 
              sx={{ height: 20, fontSize: '0.7rem' }} 
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {truncatedDescription}
        </Typography>
        
        {author && (
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            Created by: {author}
          </Typography>
        )}
        
        {usage > 0 && (
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Usage: {usage}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={usage} 
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        )}

        {tags.length > 0 && (
          <TagContainer>
            {tags.slice(0, 3).map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                sx={{ height: 20, fontSize: '0.7rem' }} 
              />
            ))}
            {tags.length > 3 && (
              <Tooltip title={tags.slice(3).join(', ')}>
                <Chip 
                  label={`+${tags.length - 3}`} 
                  size="small" 
                  sx={{ height: 20, fontSize: '0.7rem' }} 
                />
              </Tooltip>
            )}
          </TagContainer>
        )}
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, pt: 0 }}>
        <Box>
          <Tooltip title="View details">
            <IconButton 
              size="small" 
              onClick={(e) => handleActionClick(e, onInfoClick)}
              aria-label="info"
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View code">
            <IconButton 
              size="small" 
              onClick={(e) => handleActionClick(e, onCodeClick)}
              aria-label="code"
            >
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Share module">
            <IconButton 
              size="small" 
              onClick={(e) => handleActionClick(e, onShareClick)}
              aria-label="share"
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              size="small" 
              onClick={handleFavoriteClick}
              aria-label={favorite ? "unfavorite" : "favorite"}
              color={favorite ? "error" : "default"}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default ModuleCard;

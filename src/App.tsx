import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Mail, Wand2, Briefcase, Heart, Crown, Coffee } from 'lucide-react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
    },
    secondary: {
      main: '#625B71',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    h4: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Refined tone types with clear distinctions
type ToneType = 'professional' | 'warm' | 'executive' | 'conversational';

// Tone configuration with clear descriptions and icons
const toneConfig = {
  professional: {
    icon: Briefcase,
    label: 'Professional',
    description: 'Clear, direct, and solution-focused',
  },
  warm: {
    icon: Heart,
    label: 'Warm',
    description: 'Empathetic and relationship-building',
  },
  executive: {
    icon: Crown,
    label: 'Executive',
    description: 'Authoritative and strategic',
  },
  conversational: {
    icon: Coffee,
    label: 'Conversational',
    description: 'Natural and approachable',
  },
};

function App() {
  const [email, setEmail] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReply = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://ai-email-writer-svlj.onrender.com/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: email,
          tone: tone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const data = await response.text();
      setGeneratedReply(data);
    } catch (err) {
      setError('Failed to generate reply. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Mail size={48} color={theme.palette.primary.main} />
            <Typography variant="h4" component="h1" gutterBottom>
              AI Email Reply Generator
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Generate perfect email responses with the right tone
            </Typography>
          </Box>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Paste your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Select tone:
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2, 
                mb: 3 
              }}>
                {(Object.keys(toneConfig) as ToneType[]).map((toneKey) => {
                  const ToneIcon = toneConfig[toneKey].icon;
                  return (
                    <Paper
                      key={toneKey}
                      onClick={() => setTone(toneKey)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.2s',
                        border: tone === toneKey ? 2 : 1,
                        borderColor: tone === toneKey ? 'primary.main' : 'divider',
                        backgroundColor: tone === toneKey ? 'primary.50' : 'background.paper',
                        '&:hover': {
                          backgroundColor: tone === toneKey ? 'primary.100' : 'grey.50',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        p: 1.5,
                        borderRadius: '50%',
                        backgroundColor: tone === toneKey ? 'primary.main' : 'grey.100',
                      }}>
                        <ToneIcon 
                          size={24} 
                          color={tone === toneKey ? 'white' : theme.palette.text.primary}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {toneConfig[toneKey].label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {toneConfig[toneKey].description}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={generateReply}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Wand2 />}
                disabled={!email || loading}
              >
                {loading ? 'Generating...' : 'Generate Reply'}
              </Button>

              {error && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>

          {generatedReply && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generated Reply:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={generatedReply}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigator.clipboard.writeText(generatedReply)}
                >
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
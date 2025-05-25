'use client';
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

export default function Hero() {
  return (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              py: { xs: 6, md: 15 },
              backgroundImage: `
                linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%),
                url("https://www.nokia.com/sites/default/files/2024-07/got-game-m2.jpg?height=600&width=1920&resize=1")
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white'
            }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      Spawn Your Services
                      <Typography component="span" variant="h2" color="primary.light" display="block">
                        In Seconds
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
  );
}
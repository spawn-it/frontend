'use client';
import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useTheme } from '@/context/ThemeProvider';

export default function ServiceImage({ image, name, id }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Card
      key={id}
      sx={{
        width: 280,
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s",
        bgcolor: colors.paper,
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(8px)',
        "&:hover": {
          transform: "scale(1.05)",
          zIndex: 1,
          bgcolor: colors.paperHover,
          "& .MuiCardContent-root": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Service Image */}
      <CardMedia
        component="img"
        height="160"
        image={image}
        alt={name}
        sx={{
          borderRadius: 2,
          transition: "all 0.5s ease",
          "&:hover": {
            filter: "brightness(1.2)",
          },
        }}
      />
      
      {/* Overlay with name on hover */}
      <CardContent
        className="MuiCardContent-root"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: isDarkMode
            ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          color: "white",
          p: 2,
          pt: 3,
          opacity: 0.7,
          transform: "translateY(5px)",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ 
            fontWeight: "bold",
            color: "white",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)"
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import Card from '../components/Card';
import { Box } from '@mui/material';

function GroupsPage() {
  return (
    <Box
      sx={{display: "flex", flexWrap: "wrap", gap: "20px"}}
    >
      <Card ></Card>
      <Card ></Card>
      <Card ></Card>
      <Card ></Card>
    </Box>
  );
}

export default GroupsPage;

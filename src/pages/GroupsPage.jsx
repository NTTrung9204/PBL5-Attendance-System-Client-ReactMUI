import React from 'react';
import Card from '../components/Card';
import { Box } from '@mui/material';
import ToggleSection from '../components/ToggleSection';

function GroupsPage() {
  const groupTeamName_1 = "Browse through the icons below to find the one you need";
  const groupTeamName_2 = "The search field supports synonyms—for example, try searching for hamburger";
  const groupTeamName_3 = "18 matching results";
  const groupTeamName_4 = "2,100+ ready-to-use React Material Icons from the official website.";

  return (
    <Box>
      <ToggleSection label="Classes">
        <Card groupTeamName={groupTeamName_1}></Card>
        <Card groupTeamName={groupTeamName_2}></Card>
        <Card groupTeamName={groupTeamName_3}></Card>
        <Card groupTeamName={groupTeamName_4}></Card>
      </ToggleSection>

      <ToggleSection label="Hidden">

      </ToggleSection>
    </Box>
  );
}

export default GroupsPage;

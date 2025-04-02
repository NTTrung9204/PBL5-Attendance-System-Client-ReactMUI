import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Box } from '@mui/material';
import ToggleSection from '../components/ToggleSection';
import AddGroupButton from '../components/AddGroupButton';

function GroupsPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/classes');
        if (!response.ok) {
          throw new Error('Không thể kết nối đến máy chủ');
        }
        const data = await response.json();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp học:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 24 }}>
        <AddGroupButton />
      </Box>
      
      <ToggleSection label="Classes">
        {loading ? (
          <Box>Đang tải dữ liệu lớp học...</Box>
        ) : error ? (
          <Box>Lỗi: {error}</Box>
        ) : (
          classes.map(classItem => (
            <Card 
              key={classItem.id} 
              groupTeamName={classItem.name} 
              classId={classItem.id}
            ></Card>
          ))
        )}
      </ToggleSection>

      <ToggleSection label="Hidden">

      </ToggleSection>
    </Box>
  );
}

export default GroupsPage;

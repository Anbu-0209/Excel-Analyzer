import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Typography,
  Grid,
} from '@mui/material';
import { FaFileAlt } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';

const UploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:5000/uploadHistory')
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => {
        console.error('Error fetching upload history:', error);
      });
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Filter history based on search input
  const filteredHistory = history.filter((item) =>
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatUploadTime = (uploadTime) => {
    const date = new Date(uploadTime);
    return !isNaN(date) ? date.toLocaleString() : 'Unknown Date';
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <Typography
        variant="h3"
        gutterBottom
        style={{ fontWeight: 'bold', color: 'red', marginBottom: '20px' }}
      >
        File Upload History
      </Typography>

      {/* Search Field */}
      <TextField
        variant="outlined"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: '30px', width: '300px' }}
      />

      {/* Cards */}
      <Grid container spacing={3}>
        {filteredHistory.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                width: 480,
                height: 170,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
                boxShadow: 3,
                borderRadius: 3,
                backgroundColor: '#c2c1c9',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* First Div: Icon and File Name */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <FaFileAlt
                    size={30}
                    color="#EF7320"
                    style={{ marginRight: '10px' }}
                  />
                  <Typography
                    variant="h6"
                    style={{
                      wordBreak: 'break-word',
                      color: 'black',
                      fontSize: '1.25rem',
                    }}
                  >
                    {item.fileName}
                  </Typography>
                </div>

                {/* Second Div: Size and Date/Time */}
                <div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ color: 'black', fontSize: '1rem' }}
                    gutterBottom
                  >
                    Size: {item.size || 'N/A'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ color: 'black', fontSize: '1rem' }}
                  >
                    Uploaded: {formatUploadTime(item.uploadTime)}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UploadHistory;

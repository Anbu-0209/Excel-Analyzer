import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import React, { useState, useEffect } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BarChartIcon from "@mui/icons-material/BarChart";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const cardBg = theme.palette.mode === "light" ? "#e8e0f0" : colors.primary[400];

  const [uploadHistory, setUploadHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/uploadHistory")
      .then((response) => response.json())
      .then((data) => {
        setUploadHistory(data);
      })
      .catch((error) => {
        console.error("Error fetching upload history:", error);
      });
  }, []);

  const formatUploadTime = (uploadTime) => {
    const date = new Date(uploadTime);
    return !isNaN(date) ? date.toLocaleString() : "Unknown Date";
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {[{
          title: "361", subtitle: "Total Files", progress: "0.75", increase: "+45%", icon: <FileCopyIcon />
        }, {
          title: "225", subtitle: "Charts Generated", progress: "0.50", increase: "+21%", icon: <BarChartIcon />
        }, {
          title: "1200", subtitle: "Uploads", progress: "0.30", increase: "+50%", icon: <CloudUploadIcon />
        }, {
          title: "1,325", subtitle: "Active Users", progress: "0.80", increase: "+63%", icon: <PersonAddIcon />
        }].map((stat, index) => (
          <Box
            key={index}
            gridColumn="span 3"
            backgroundColor={cardBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={stat.title}
              subtitle={stat.subtitle}
              progress={stat.progress}
              increase={stat.increase}
              icon={React.cloneElement(stat.icon, {
                sx: { color: colors.redAccent[600], fontSize: "36px" }
              })}
            />
          </Box>
        ))}

        {/* ROW 2 - Line Chart */}
        <Box gridColumn="span 8" gridRow="span 2" backgroundColor={cardBg}>
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Employee Generated
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                $59,342
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 2 - Recent Activity */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={cardBg} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Activity
            </Typography>
          </Box>
          {(uploadHistory || []).slice(-5).reverse().map((item, i) => (
            <Box
              key={`${item.fileName}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  {item.fileName}
                </Typography>
                <Typography color={colors.grey[100]}>Uploaded File</Typography>
              </Box>
              <Box color={colors.grey[100]}>
                {formatUploadTime(item.uploadTime)}
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                Excel
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 - Campaign Progress */}
        {/* <Box gridColumn="span 4" gridRow="span 2" backgroundColor={cardBg} p="30px">
          <Typography variant="h5" fontWeight="600">Campaign</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" />
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box> */}

        {/* ROW 3 - Bar Chart */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={cardBg}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 - Geography Chart */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={cardBg} padding="30px">
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>
            Geography Charts
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

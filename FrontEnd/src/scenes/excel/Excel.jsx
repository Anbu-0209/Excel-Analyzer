import React, { useState, useRef, useEffect } from "react";
import {Box,Typography,Paper,IconButton,Snackbar,Alert,Grid,Select,MenuItem,FormControl,InputLabel, Button,} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { Bar, Pie } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "@mui/material/styles";

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels );

const ExcelUpload = ({ setHistory }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [data, setData] = useState([]);
  const [xAxisField, setXAxisField] = useState("");
  const [yAxisField, setYAxisField] = useState("");
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null); 

  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  const axisColor = isLightMode ? "black" : "white";
  const gridColor = isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
  const labelColor = isLightMode ? "black" : "white";


  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const processFile = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);

      const now = new Date();
      const formattedDateTime = now.toLocaleString();
      const newHistory = {
        fileName: selectedFile.name,
        uploadTime: formattedDateTime,
      };
      const prevHistory =
        JSON.parse(localStorage.getItem("uploadHistory")) || [];
      const updatedHistory = [...prevHistory, newHistory];
      localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile?.name.endsWith(".xlsx") ||
      selectedFile?.name.endsWith(".xls")
    ) {
      setFile(selectedFile);
      showAlert("Uploading file...", "info");
  
      const formData = new FormData();
      formData.append("File", selectedFile);
  
      try {
        const uploadRes = await fetch("http://localhost:5000/uploads", {
          method: "POST",
          body: formData,
        });
  
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");
  
        showAlert("File uploaded successfully!", "success");
  
        const response = await fetch("http://localhost:5000/excel-data");
        const parsedData = await response.json();
        setData(parsedData);
  
        const now = new Date();
        const formattedDateTime = now.toLocaleString();
        const newHistory = {
          fileName: selectedFile.name,
          uploadTime: formattedDateTime,
        };
        const prevHistory =
          JSON.parse(localStorage.getItem("uploadHistory")) || [];
        const updatedHistory = [...prevHistory, newHistory];
        localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (error) {
        showAlert("Error uploading or processing file", "error");
        console.error(error);
      }
    } else {
      showAlert("Please upload a valid Excel file (.xlsx or .xls)", "error");
    }
  };
  
  const handleChartOptionsChange = () => {
    if (xAxisField && yAxisField) {
      const aggregatedData = {};
  
      data.forEach((item) => {
        const xValue = item[xAxisField];
        const yValue = parseFloat(item[yAxisField]) || 0;
  
        if (!aggregatedData[xValue]) {
          aggregatedData[xValue] = { total: yValue, count: 1 };
        } else {
          aggregatedData[xValue].total += yValue;
          aggregatedData[xValue].count += 1;
        }
      });
  
      const labels = Object.keys(aggregatedData);
      const values = labels.map(
        (label) => aggregatedData[label].total / aggregatedData[label].count
      );
  
      let chartConfig = {
        labels,
        datasets: [
          {
            label: `Datas`,
            data: values,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgb(43, 194, 231)",
            borderWidth: 3,
          },
        ],
      };
  
      // Pie chart config
      if (chartType === "pie") {
        chartConfig = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#f44336",
                "#e57373",
                "#ef5350",
                "#e53935",
                "#d32f2f",
              ],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        };
      }
  
      setChartData(chartConfig);
    }
  };
  
  useEffect(() => {
    handleChartOptionsChange();
  }, [xAxisField, yAxisField, chartType, data]);

  const handleDownloadImage = () => {
    if (chartRef.current && chartRef.current.canvas) {
      const canvas = chartRef.current.canvas;
      const jpegUrl = canvas.toDataURL("image/jpeg", 1.0); 
      const link = document.createElement("a");
      link.href = jpegUrl;
      link.download = `${chartType}-chart.jpg`;
      link.click();
    }
  };

  return (
    <Box m="70px">
      <Box
        sx={{ maxWidth: 1800, mx: 5, p: 5, bgcolor: "#b5aabf", color: "black" }}
      >
        <Typography variant="h3" mb={2}>
          Upload Excel File
        </Typography>

        <Paper
          elevation={isDragging ? 4 : 1}
          onClick={() => document.getElementById("fileInput")?.click()}
          sx={{
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : "grey.400",
            backgroundColor: "white",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            color: "black",
          }}
        >
          <IconButton color="primary">
            <CloudUploadIcon sx={{ fontSize: 48 }} />
          </IconButton>
          <Typography variant="body1" mt={1}>
            {file
              ? file.name
              : "Drag and drop a file here, or click to select a file"}
          </Typography>
          {!file && (
            <Typography variant="body2" color="textSecondary">
              Only Excel files (.xlsx, .xls) are supported
            </Typography>
          )}
          <input
            type="file"
            id="fileInput"
            hidden
            accept=".xlsx, .xls"
            onChange={handleFileSelect}
          />
        </Paper>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" mb={2}>
                Chart Options
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="x-axis-select">X-axis</InputLabel>
                <Select
                  labelId="x-axis-select"
                  value={xAxisField}
                  onChange={(e) => setXAxisField(e.target.value)}
                  label="X-axis"
                >
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="y-axis-select">Y-axis</InputLabel>
                <Select
                  labelId="y-axis-select"
                  value={yAxisField}
                  onChange={(e) => setYAxisField(e.target.value)}
                  label="Y-axis"
                >
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="chart-type-select">Chart Type</InputLabel>
                <Select
                  labelId="chart-type-select"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  label="Chart Type"
                >
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                </Select>
              </FormControl>
            </Paper>{" "}
            <br></br>
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleDownloadImage}
                disabled={!chartData}
                sx={{
                  backgroundColor: "blue",
                  color: "#fff",
                  width: "200px",
                  height: "50px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
              >
                Download Chart
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {chartData && (
              <Paper sx={{ p: 3, height: 400 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {chartType === "bar" && (
                    <Bar
                      ref={chartRef}
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { labels: { color: labelColor } },
                          title: {
                            display: true,
                            text: `${yAxisField} vs ${xAxisField}`,
                            color: labelColor,
                          },
                          datalabels: {
                            color: "red",
                            font: { weight: "bold" },
                            anchor: "end",
                            align: "top",
                          },
                        },
                        scales: {
                          x: {
                            ticks: { color: axisColor },
                            grid: { color: gridColor },
                          },
                          y: {
                            ticks: { color: axisColor },
                            grid: { color: gridColor },
                          },
                        }
                        
                      }}
                    />
                  )}
                  {chartType === "pie" && (
                    <Box sx={{ width: 420, height: 350 }}>
                      <Pie
                        ref={chartRef}
                        data={{
                          ...chartData,
                          datasets: chartData.datasets.map((dataset) => ({
                            ...dataset,
                            backgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "#4BC0C0",
                              "#9966FF",
                              "#FF9F40",
                            ],
                          })),
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { labels: { color: labelColor } },
                            datalabels: {
                              color: labelColor,
                              font: { weight: "bold", size: 14 },
                              anchor: "center",
                              align: "center",
                            },
                          }
                          
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ExcelUpload;



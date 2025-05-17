import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const employeeSalaryData = [
  {
    id: "Anbu",
    color: "hsl(100, 70%, 50%)",
    data: [
      { x: "Jan", y: 5000 },
      { x: "Feb", y: 5200 },
      { x: "Mar", y: 5400 },
      { x: "Apr", y: 7500 },
      { x: "May", y: 5600 },
      { x: "Jun", y: 9700 },
      { x: "Jul", y: 5800 },
      { x: "Aug", y: 4900 },
      { x: "Sep", y: 6000 },
    ],
  },
  {
    id: "Nithya",
    color: "hsl(200, 70%, 50%)",
    data: [
      { x: "Jan", y: 4500 },
      { x: "Feb", y: 4600 },
      { x: "Mar", y: 4800 },
      { x: "Apr", y: 6900 },
      { x: "May", y: 5000 },
      { x: "Jun", y: 5100 },
      { x: "Jul", y: 7200 },
      { x: "Aug", y: 5300 },
      { x: "Sep", y: 5400 },
    ],
  },
  {
    id: "Dhivya",
    color: "hsl(340, 70%, 50%)",
    data: [
      { x: "Jan", y: 8000 },
      { x: "Feb", y: 6200 },
      { x: "Mar", y: 7400 },
      { x: "Apr", y: 4600 },
      { x: "May", y: 9700 },
      { x: "Jun", y: 6800 },
      { x: "Jul", y: 5900 },
      { x: "Aug", y: 7000 },
      { x: "Sep", y: 7100 },
    ],
  },
];

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
      data={employeeSalaryData} // Use the salary data
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} 
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Person",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={true} 
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;


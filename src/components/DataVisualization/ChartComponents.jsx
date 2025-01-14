import React from "react";
import { LineChart, BarChart, PieChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Pie, Area } from "recharts";

const chartTypes = {
    LINE: 'line',
    BAR: 'bar',
    PIE: 'pie',
    AREA: 'area'
}

const ChartComponent = ({ type, data, width = 600, height = 400 }) => {
    const renderLineChart = () => {
        <LineChart width={width} height={height} data={data} className="bg-white rounded-lg p-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
    }


    const renderBarChart = () => {
        <BarChart width={width} height={height} data={data} className="bg-white rounded-lg p-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
    }

    const renderPieChart = () => (
        <PieChart width={width} height={height} className="bg-white rounded-lg p-4">
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                fill="#4f46e5"
                label
            />
            <Tooltip />
            <Legend />
        </PieChart>
    );

    const renderAreaChart = () => (
        <AreaChart width={width} height={height} data={data} className="bg-white rounded-lg p-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#818cf8" />
        </AreaChart>
    );

    const chartMap = {
        [chartTypes.LINE]: renderLineChart,
        [chartTypes.BAR]: renderBarChart,
        [chartTypes.PIE]: renderPieChart,
        [chartTypes.AREA]: renderAreaChart
    };

    return chartMap[type]?.() || null;
}

export default ChartComponent;
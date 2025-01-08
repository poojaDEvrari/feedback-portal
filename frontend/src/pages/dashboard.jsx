import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";
import { downloadFeedback } from "../api";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("Product"); // Default category
  const [summary, setSummary] = useState({
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  // Fetch feedback data whenever categoryFilter changes
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/feedback/feedbacks?category=${categoryFilter}`
        );

        console.log("Fetched Feedback Data:", response.data.data);
        setFeedbackData(response.data.data); // Adjust to access the actual data array
        calculateSummary(response.data.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, [categoryFilter]);

  const calculateSummary = (data) => {
    const highPriority = data.filter((feedback) => feedback.priority === "High").length;
    const mediumPriority = data.filter((feedback) => feedback.priority === "Medium").length;
    const lowPriority = data.filter((feedback) => feedback.priority === "Low").length;

    setSummary({
      total: data.length,
      highPriority,
      mediumPriority,
      lowPriority,
    });
  };

  const barData = {
    labels: ["High Priority", "Medium Priority", "Low Priority"],
    datasets: [
      {
        label: "Feedback Count",
        data: [summary.highPriority, summary.mediumPriority, summary.lowPriority],
        backgroundColor: ["#f87171", "#fbbf24", "#60a5fa"],
        borderColor: ["#e11d48", "#f59e0b", "#3b82f6"],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["High Priority", "Medium Priority", "Low Priority"],
    datasets: [
      {
        label: "Feedback Distribution",
        data: [summary.highPriority, summary.mediumPriority, summary.lowPriority],
        backgroundColor: ["#f87171", "#fbbf24", "#60a5fa"],
      },
    ],
  };

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Data Summary", 10, 10);
    doc.text(`Total Feedbacks: ${summary.total}`, 10, 20);
    doc.text(`High Priority: ${summary.highPriority}`, 10, 30);
    doc.text(`Medium Priority: ${summary.mediumPriority}`, 10, 40);
    doc.text(`Low Priority: ${summary.lowPriority}`, 10, 50);

    doc.save("feedback_summary.pdf");
  };

  // XLSX Generation
  const generateXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(feedbackData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedbacks");
    XLSX.writeFile(wb, "feedback_data.xlsx");
  };

  const handleDownload = (format) => {
    if (format === "pdf") {
      generatePDF();
    } else if (format === "xlsx") {
      generateXLSX();
    } else {
      try {
        downloadFeedback();
        alert("Feedback downloaded successfully!");
      } catch (error) {
        alert("Failed to download feedback.");
        console.error("Download error:", error);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <h1 className="text-2xl font-bold text-center mb-6">Feedback Dashboard</h1>

      {/* Category Filter */}
      <div className="flex justify-center mb-6">
        <select
          className="px-4 py-2 border rounded-md"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="Product">Product</option>
          <option value="Service">Service</option>
          <option value="Support">Support</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold">Total Feedbacks</h2>
          <p className="text-2xl font-bold">{summary.total}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold">High Priority</h2>
          <p className="text-2xl font-bold">{summary.highPriority}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold">Medium Priority</h2>
          <p className="text-2xl font-bold">{summary.mediumPriority}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold">Low Priority</h2>
          <p className="text-2xl font-bold">{summary.lowPriority}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">Feedback Priority Breakdown (Bar Chart)</h2>
          <Bar data={barData} />
        </div>
        <div className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-semibold mb-4">Feedback Priority Distribution (Pie Chart)</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Download Feedback Button */}
      <div className="text-center mt-6">
       
        <button
          onClick={() => handleDownload("pdf")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-4"
        >
          Download Feedback (PDF)
        </button>
        <button
          onClick={() => handleDownload("xlsx")}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-yellow-600"
        >
          Download Feedback (XLSX)
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

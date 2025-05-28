import axiosInstance from "./axiosInstance.js";
import toast from "react-hot-toast";

export async function downloadReportHandler({data_name, path, report_name}) {
  try {
    const response = await axiosInstance.get(path, {
      responseType: 'blob'
    });

    //Creating URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", report_name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Error downloading ${data_name} details:`, error);
    toast.error(`Failed to download ${data_name} details? Please try again later`);
  }
}
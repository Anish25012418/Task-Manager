import React, {use, useContext, useEffect, useState} from 'react';
import {useUserAuth} from "../../hooks/useUserAuth.jsx";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../context/userContext.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import DashboardLayout from "./DashboardLayout.jsx";
import InfoCard from "../cards/InfoCard.jsx";
import CustomPieChart from "../charts/CustomPieChart.jsx";
import CustomBarChart from "../charts/CustomBarChart.jsx";
import {LuArrowRight} from "react-icons/lu";
import TaskListTable from "../tables/TaskListTable.jsx";
import {addThousandsSeparator} from "../../utils/helper.js";
import moment from "moment";

const DashboardView = () => {
  const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]
  const hour = moment().hour();

  useUserAuth();
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    dashboardData: null,
    pieChartData: [],
    barChartData: [],
  });

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 }
    ];

    setData((prevData) => ({...prevData, pieChartData: taskDistributionData, barChartData: priorityLevelData}))
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get( user?.role === "admin" ?
        API_PATHS.TASKS.GET_DASHBOARD_DATA : API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      )
      if (response.data) {
        setData((prevState) => ({...prevState, dashboardData: response.data}));
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users.", error);
    }
  }

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  useEffect(() => {
    getDashboardData();
  }, [user])

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">{hour < 12 ? "Good Morning!" : hour < 18 ? "Good Afternoon!" : "Good Evening!"} {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard label="Total Tasks"
                    value={addThousandsSeparator(data.dashboardData?.charts?.taskDistribution?.All || 0)}
                    color="bg-primary"/>
          <InfoCard label="Pending Tasks"
                    value={addThousandsSeparator(data.dashboardData?.charts?.taskDistribution?.Pending || 0)}
                    color="bg-violet-500"/>
          <InfoCard label="In Progress Tasks"
                    value={addThousandsSeparator(data.dashboardData?.charts?.taskDistribution?.InProgress || 0)}
                    color="bg-cyan-500"/>
          <InfoCard label="In Progress Tasks"
                    value={addThousandsSeparator(data.dashboardData?.charts?.taskDistribution?.Completed || 0)}
                    color="bg-lime-500"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart data={data.pieChartData} colors={COLORS}/>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority</h5>
            </div>
            <CustomBarChart data={data.barChartData}/>
          </div>
        </div>


        <div className = "md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base"/>
              </button>
            </div>
            <TaskListTable tableData={data.dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardView;
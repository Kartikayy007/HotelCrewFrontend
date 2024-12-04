import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, MenuItem, Skeleton } from '@mui/material';
import { 
  fetchTodayAttendanceList, 
  fetchAttendanceStats,
  fetchWeeklyAttendance,
  selectWeeklyStats 
} from './../../../../redux/slices/AdminAttendanceSlice';

const AdminAttendanceList = ({ onBack }) => {
  const dispatch = useDispatch();
  const [timeFilter, setTimeFilter] = useState('daily');
  
  const { todayList, stats, loading } = useSelector(state => state.attendance);
  const weeklyStats = useSelector(selectWeeklyStats);

  useEffect(() => {
    dispatch(fetchTodayAttendanceList());
    dispatch(fetchAttendanceStats());
  }, [dispatch]);

   ('Weekly stats:', weeklyStats);

  useEffect(() => {
    if (timeFilter === 'weekly') {
      dispatch(fetchWeeklyAttendance());
    }
  }, [dispatch, timeFilter]);

  const dummyHistoricalData = {
    dates: ['2024-03-01', '2024-03-08', '2024-03-15', '2024-03-22'],
    present: [1,2321,421,42,21],
    absent: [12,11,21,241,1]
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={150} height={32} className="rounded" />
        <div className="flex items-center gap-4">
          <Skeleton variant="rectangular" width={128} height={40} className="rounded" />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((col) => (
          <div key={col} className="space-y-4">
            <Skeleton variant="rectangular" height={40} className="rounded" />
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="rectangular" height={60} className="rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const AttendanceStats = ({ present, absent }) => {
    const total = present + absent;
    const presentPercentage = total > 0 ? (present / total) * 100 : 0;
    const absentPercentage = total > 0 ? (absent / total) * 100 : 0;
    
    return (
      <div className="bg-[#F1F6FC] rounded-lg p-4 mb-4">
        <div className="h-2 bg-[#DEE8FF] rounded overflow-hidden mb-2">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${presentPercentage}%` }}
          />
        </div>
        <div className="h-2 bg-[#DEE8FF] rounded overflow-hidden mb-2">
          <div 
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${absentPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-green-600">{present} Present ({presentPercentage.toFixed(1)}%)</span>
          <span className="text-red-600">{absent} Absent ({absentPercentage.toFixed(1)}%)</span>
          <span className="text-gray-600">{total} Total</span>
        </div>
      </div>
    );
  };

  const getFilteredData = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    switch (timeFilter) {
      case 'daily':
        const presentList = todayList.filter(item => item.current_attendance === "Present");
        const absentList = todayList.filter(item => item.current_attendance === "Absent");
        
        return {
          'Today': {
            presentList,
            absentList,
            present: presentList.length,
            absent: absentList.length,
            showColumns: true
          }
        };

      case 'weekly':
        if (!weeklyStats.dates) return {};
        
        const dateStats = weeklyStats.dates.map((date, index) => ({
          date,
          formattedDate: new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          present: weeklyStats.total_crew_present[index],
          absent: weeklyStats.total_staff_absent[index]
        }));

        // Sort in reverse chronological order
        dateStats.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Convert to required format
        return dateStats.reduce((acc, stat) => {
          acc[stat.formattedDate] = {
            present: stat.present,
            absent: stat.absent,
            showColumns: false
          };
          return acc;
        }, {});

      default:
        return {};
    }
  };

  const AttendanceColumn = ({ title, list = [], bgColor, textColor }) => (
    <div className="flex-1">
      <div className={`${bgColor} rounded-t-lg p-3 font-medium ${textColor}`}>
        {title}
      </div>
      <div className="p-3 space-y-2 bg-[#F1F6FC] rounded-b-lg min-h-96">
        {list.map(item => (
          <div key={item.id} className="text-sm p-2 bg-white rounded shadow-sm">
            <div className="font-medium text-gray-700">{item.email}</div>
            <div className="text-xs text-gray-500">{item.role}</div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-8">
            No records found
          </div>
        )}
      </div>
    </div>
  );

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attendance List</h2>
          <div className="flex items-center gap-4">
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              size="small"
              className="w-32"
            >
              <MenuItem value="daily">Today</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >
              &#x2715;
            </button>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {Object.entries(filteredData).map(([period, data]) => (
            <div key={period} className="border-b border-[#DEE8FF] py-4 last:border-0">
              <h3 className="font-semibold mb-3">Period: {period}</h3>
              <AttendanceStats present={data.present} absent={data.absent} />
              {data.showColumns && (
                <div className="flex gap-4">
                  <AttendanceColumn
                    title={`Present (${data.presentList?.length || 0})`}
                    list={data.presentList}
                    bgColor="bg-green-100"
                    textColor="text-green-700"
                  />
                  <AttendanceColumn
                    title={`Absent (${data.absentList?.length || 0})`}
                    list={data.absentList}
                    bgColor="bg-red-100"
                    textColor="text-red-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceList;
import { useState, useCallback, useEffect } from "react";
import DatePicker from "../../components/date_picker/date_picker";
import JobItem from "../../components/job_item/job_item";
import Pagination from "../../components/pagination/pagination";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { IMission } from "../../interfaces/mission";
import { FiSearch } from "react-icons/fi";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { BiRightArrowAlt, BiSolidPlusCircle } from "react-icons/bi";

const Overview = () => {
  const today = Math.floor(
    new Date(
      `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()} 00:00:00`
    ).getTime() / 1000
  );
  const endDate = today + 86399;
  const startDate = endDate - 86400 * 30;

  // Info: (20231027 - Julian) Mission State
  const [missions, setMissions] = useState<IMission>();
  // Info: (20231030 - Julian) is show loading skeleton
  const [isLoading, setIsLoading] = useState(true);
  // Info: (20231027 - Julian) is fetch API
  const [allJobDone, setAllJobDone] = useState(false);
  // Info: (20231024 - Julian) Filter State
  const [searchText, setSearchText] = useState("");
  const [dateStart, setDateStart] = useState(startDate);
  const [dateEnd, setDateEnd] = useState(endDate);
  const [filteredDate, setFilteredDate] = useState({
    startTimeStamp: startDate,
    endTimeStamp: endDate,
  });
  // Info: (20231025 - Julian) Job List State
  const [currentTab, setCurrentTab] = useState<"all" | "processing" | "done">(
    "all"
  );
  // Info: (20231025 - Julian) Sort by Newest/Oldest
  const [sortByNewest, setSortByNewest] = useState(true);
  // Info: (20231025 - Julian) Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(missions?.totalPage ?? 1);

  const uploadDateSortHandler = () => setSortByNewest(!sortByNewest);

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchText(searchTerm);
  };

  const dateStartUpdateHandler = useCallback(
    async (date: number) => {
      setDateStart(date);
      setFilteredDate({
        startTimeStamp: date,
        endTimeStamp: dateEnd,
      });
    },
    [dateEnd, filteredDate]
  );

  const dateEndUpdateHandler = useCallback(
    async (date: number) => {
      setDateEnd(date + 86399);
      setFilteredDate({
        startTimeStamp: dateStart,
        endTimeStamp: date + 86399,
      });
    },
    [dateStart, filteredDate]
  );

  // Info: (20231027 - Julian) Submit upload form
  const uploadExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setAllJobDone(false);

    await fetch(`/api/mission`, {
      method: "POST",
      body: new FormData(document.forms["uploadForm"]),
    }).then((res) => {
      if (res.ok) {
        // Info: (20231030 - Julian) Show loading skeleton
        setIsLoading(true);
        // Info: (20231027 - Julian) Get mission list
        getMissions();
        // Info: (20231027 - Julian) Clear input
        event.target.value = "";
      } else {
        alert("Upload failed. Please try again.");
      }
    });
  };

  // Info: (20231027 - Julian) Get mission list
  const getMissions = async () => {
    const response = await fetch(`/api/mission?page=${activePage}`, {
      method: "GET",
    });
    const missions: IMission = await response.json();
    if (response.ok) setIsLoading(false);
    // Info: (20231025 - Julian) Check if all job done
    if (missions.missions.every((mission) => mission.done)) {
      setAllJobDone(true);
    } else {
      setAllJobDone(false);
    }
    setMissions(missions);
    setTotalPages(missions.totalPage);
  };

  const jobList = missions?.missions.map((mission) => ({
    id: mission.id,
    author: {
      name: mission.user.name,
      email: mission.user.id,
      avatar: mission.user.image,
    },
    fileName: mission.name,
    uploadTimestamp: Math.floor(new Date(mission.created_at).getTime() / 1000),
    progress: mission.progress,
    status: mission.done ? "done" : "processing",
  }));

  const filteredJobList = jobList
    ? jobList
        // Info: (20231025 - Julian) Filter by tab
        .filter((job) =>
          currentTab === "all" ? true : job.status === currentTab
        )
        // Info: (20231025 - Julian) Filter by search text
        .filter(
          (job) =>
            job.fileName.toLowerCase().includes(searchText.toLowerCase()) ||
            job.author.name.toLowerCase().includes(searchText.toLowerCase()) ||
            job.uploadTimestamp.toString().includes(searchText.toLowerCase())
        )
        // Info: (20231025 - Julian) Filter by upload date
        .filter(
          (job) =>
            job.uploadTimestamp >= filteredDate.startTimeStamp &&
            job.uploadTimestamp <= filteredDate.endTimeStamp
        )
        // Info: (20231025 - Julian) Sort by upload time
        .sort((a, b) =>
          sortByNewest
            ? b.uploadTimestamp - a.uploadTimestamp
            : a.uploadTimestamp - b.uploadTimestamp
        )
    : [];

  // Info: (20231030 - Julian) Filter
  // useEffect(() => {
  //   setActivePage(1);
  //   setTotalPages(Math.ceil(filteredJobList.length / ITEMS_PER_PAGE));
  // }, [currentTab, searchText, filteredDate, sortByNewest]);

  useEffect(() => {
    // Info: (20231025 - Julian) If not all job done, check every 5 seconds
    if (!allJobDone) {
      const interval = setInterval(() => {
        getMissions();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allJobDone]);

  useEffect(() => {
    getMissions();
  }, [activePage]);

  const jobListSkeleton = isLoading ? (
    <div className="animate-pulse w-full flex items-center border-x border-b border-coolGray p-2 h-50px">
      <div className="flex items-center space-x-4 w-200px">
        <div className="ml-6 rounded-full w-40px h-40px bg-coolGray"></div>
        <div className="bg-coolGray h-15px w-80px"></div>
      </div>
      <div className="w-100px lg:block hidden">
        <div className="w-50px h-15px bg-coolGray"></div>
      </div>
      <div className="w-120px lg:block hidden">
        <div className="w-50px h-15px bg-coolGray"></div>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="w-50px h-20px bg-coolGray rounded-full"></div>
        <div className="w-20px h-20px bg-coolGray rounded-full"></div>
      </div>
    </div>
  ) : null;

  const displayedJobList = filteredJobList.map((job, index) => (
    <JobItem
      missionId={job.id}
      key={index}
      author={job.author}
      fileName={job.fileName}
      uploadTimestamp={job.uploadTimestamp}
      progress={job.progress}
      status={job.status}
      allJobDone={allJobDone}
      setAllJobDone={setAllJobDone}
    />
  ));

  const displayedMissions = (
    <>
      {jobListSkeleton}
      {isLoading
        ? displayedJobList // Info: (20231030 - Julian) 為了放入 loading skeleton ， job list 需要切掉最後一個
            .slice(0, -1)
        : displayedJobList}
    </>
  );

  const overview = (
    <div className="flex h-full bg-white2 flex-1 flex-col p-6 space-y-6 rounded">
      {/* Info: (20231024 - Julian) Title */}
      <h1 className="text-black font-bold text-42px">Projects</h1>
      {/* Info: (20231024 - Julian) Filter */}
      <div className="flex items-center space-x-10">
        {/* Info: (20231024 - Julian) Search Bar */}
        <div className="flex items-center relative flex-1">
          <input
            className="w-300px bg-white h-48px py-3 pl-12 pr-4 w-full placeholder:text-gray rounded border border-gray2 shadow-lg"
            type="search"
            placeholder="Search"
            onChange={searchChangeHandler}
          />
          <FiSearch size={24} style={{ position: "absolute", left: "16px" }} />
        </div>
        {/* Info: (20231024 - Julian) Date Picker */}
        <div className="flex items-center space-x-3">
          <DatePicker
            date={dateStart}
            setDate={dateStartUpdateHandler}
            maxDate={dateEnd}
          />
          <BiRightArrowAlt size={24} />
          <DatePicker
            date={dateEnd}
            setDate={dateEndUpdateHandler}
            minDate={dateStart}
          />
        </div>
      </div>
      {/* Info: (20231024 - Julian) Tools bar */}
      <div className="flex items-center justify-between">
        {/* Info: (20231024 - Julian) Tab */}
        <div className="flex items-center border-b border-coolGray space-x-4">
          <button
            onClick={() => setCurrentTab("all")}
            className={`border-b flex items-center py-2 px-3 space-x-1 ${
              currentTab === "all"
                ? "border-primaryGreen text-primaryGreen"
                : "border-transparent"
            } transition-all duration-200 ease-in-out`}
          >
            <p className="text-base">All</p>
            <p
              className={`rounded-full text-white px-6px py-2px text-xs ${
                currentTab === "all" ? "bg-primaryGreen" : "bg-black"
              }`}
            >
              {missions?.missions.length ?? 0}
            </p>
          </button>
          <button
            onClick={() => setCurrentTab("processing")}
            className={`border-b flex items-center py-2 px-3 space-x-1 ${
              currentTab === "processing"
                ? "border-primaryGreen text-primaryGreen"
                : "border-transparent"
            } transition-all duration-200 ease-in-out`}
          >
            <p className="text-base">Processing</p>
            <p
              className={`rounded-full text-white px-6px py-2px text-xs ${
                currentTab === "processing" ? "bg-primaryGreen" : "bg-black"
              }`}
            >
              {missions?.missions.filter((mission) => !mission.done).length ??
                0}
            </p>
          </button>
          <button
            onClick={() => setCurrentTab("done")}
            className={`border-b flex items-center py-2 px-3 space-x-1 ${
              currentTab === "done"
                ? "border-primaryGreen text-primaryGreen"
                : "border-transparent"
            } transition-all duration-200 ease-in-out`}
          >
            <p className="text-base">Done</p>
            <p
              className={`rounded-full text-white px-6px py-2px text-xs ${
                currentTab === "done" ? "bg-primaryGreen" : "bg-black"
              }`}
            >
              {missions?.missions.filter((mission) => mission.done).length ?? 0}
            </p>
          </button>
        </div>
        {/* Info: (20231024 - Julian) Buttons */}
        <div className="flex items-center space-x-4">
          {/* Info: (20231030 - Julian) Template Download Button */}
          <a
            href="/template.xlsx"
            download="template.xlsx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 text-sm text-white bg-primaryGreen rounded-full px-2 py-1"
          >
            <FaArrowAltCircleDown color="white" size={20} />
            <p>Template</p>
          </a>
          {/* Info: (20231030 - Julian) Upload Button */}
          <form id="uploadForm" target="hidden-form">
            <label className="hover:cursor-pointer">
              <BiSolidPlusCircle color="#57BE6C" size={40} />
              <input
                type="file"
                name="file"
                className="hidden"
                accept=".xlsx"
                onChange={(event) => uploadExcel(event)}
              />
            </label>
            <iframe className="hidden" name="hidden-form"></iframe>
          </form>
        </div>
      </div>
      {/* Info: (20231024 - Julian) Job List */}
      <div className="flex flex-col w-full flex-1">
        {/* Info: (20231025 - Julian) Job List Header */}
        <div className="flex items-center h-50px border border-primaryGreen bg-primaryGreen text-sm text-white p-2">
          <div className="w-6 opacity-0">
            <input
              type="checkbox"
              className="accent-white"
              //checked={selectAll}
              //onChange={selectAllHandler}
            />
          </div>
          {/* Info: (20231025 - Julian) Author */}
          <div className="w-180px px-3 whitespace-nowrap">Author</div>

          {/* Info: (20231025 - Julian) File Name */}
          <div className="w-100px whitespace-nowrap lg:block hidden">
            File Name
          </div>

          {/* Info: (20231025 - Julian) Upload Date */}
          <div className="w-120px flex items-center whitespace-nowrap lg:flex hidden">
            <p>Upload Date</p>
            <button onClick={uploadDateSortHandler}>
              {sortByNewest ? (
                <BsArrowDownShort size={24} />
              ) : (
                <BsArrowUpShort size={24} />
              )}
            </button>
          </div>
          {/* Info: (20231025 - Julian) Job Status */}
          <div className="flex-1">Status</div>
        </div>
        {displayedMissions}
      </div>
      {/* Info: (20231025 - Julian) Pagination */}
      <div className="w-full flex justify-center my-6">
        <Pagination
          activePage={activePage}
          setActivePage={setActivePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );

  return overview;
};

export default Overview;

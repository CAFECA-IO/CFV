import '../styles/globals.css';
import Head from 'next/head';
import Image from 'next/image';
import DatePicker from '../components/date_picker/date_picker';
import JobItem from '../components/job_item/job_item';
import Pagination from '../components/pagination/pagination';
import {useState, Dispatch, SetStateAction, useCallback, useEffect} from 'react';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useSession, signIn, signOut} from 'next-auth/react';
import {GoogleLogin} from '@react-oauth/google';
import {PiHouseBold} from 'react-icons/pi';
import {LuUsers} from 'react-icons/lu';
import {FiSearch, FiDownload} from 'react-icons/fi';
import {BiRightArrowAlt, BiSolidPlusCircle} from 'react-icons/bi';
import {BsArrowDownShort, BsArrowUpShort} from 'react-icons/bs';
import {TbTrash} from 'react-icons/tb';
import {ITEMS_PER_PAGE} from '../constants/config';

const dummyUser = {
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  avatar: '/avatar/user_photo_1.jpeg',
};

const dummyJobList = [
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 001',
    uploadTimestamp: 1698272000,
    status: 'done',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 002',
    uploadTimestamp: 1698273198,
    status: 'done',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 003',
    uploadTimestamp: 1698383198,
    status: 'done',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 004',
    uploadTimestamp: 1698582719,
    status: 'processing',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 005',
    uploadTimestamp: 1698584719,
    status: 'processing',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 006',
    uploadTimestamp: 1698684719,
    status: 'processing',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 129',
    uploadTimestamp: 1698282719,
    status: 'done',
    checked: false,
  },
  {
    author: {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: '/avatar/user_photo_1.jpeg',
    },
    fileName: 'File 141',
    uploadTimestamp: 1698402719,
    status: 'done',
    checked: false,
  },
];

const Main = () => {
  const {data: session, status} = useSession();
  const content = !session ? <OperationView session={session} /> : <LoginView />;
  const view = (
    <div className="p-10px font-roboto flex min-h-screen max-w-1032px mx-auto justify-center items-center">
      {content}
    </div>
  );
  return view;
};

const LoginView = () => {
  const view = (
    <div className="flex flex-col justify-center items-end bg-cover bg-login h-720px w-full bg-white rounded">
      <div className="text-2xl font-bold w-1/2 p-20 space-y-12">
        <h1 className="text-black text-42px">Sign in</h1>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <div className="h-px bg-coolGray w-full"></div>
        <div className="text-sm text-darkBlue">No account yet? Sign Up</div>
      </div>
    </div>
  );

  return view;
};

const OperationView = session => {
  const session_data = JSON.stringify(session);
  const [menu, setMenu] = useState<'overview' | 'collaborators'>('overview');

  const view = (
    <div className="flex items-start justify-start w-full h-720px rounded bg-white">
      <MenuView menu={menu} setMenu={setMenu} />
      <JobBoard menu={menu} />
    </div>
  );

  return view;
};

const MenuView = ({
  menu,
  setMenu,
}: {
  menu: 'overview' | 'collaborators';
  setMenu: Dispatch<SetStateAction<'overview' | 'collaborators'>>;
}) => {
  const view = (
    <div className="w-250px flex flex-col z-10 space-y-10 items-center h-full rounded px-4 py-6 bg-white shadow-xl">
      {/* Info: (20231024 - Julian) Logo */}
      <div>
        <Image src="/tsmc_logo.svg" width={100} height={80} alt="tsmc_logo" />
      </div>
      {/* Info: (20231024 - Julian) User Info */}
      <div className="flex space-x-4 items-center">
        {/* Info: (20231024 - Julian) Avatar */}
        <div className="rounded-full overflow-hidden relative w-50px h-50px">
          <Image
            src={dummyUser.avatar}
            fill
            style={{objectFit: 'cover', objectPosition: 'top'}}
            alt="avatar"
          />
        </div>
        {/* Info: (20231024 - Julian) User Name & Email */}
        <div className="flex flex-col">
          <h2 className="text-sm text-black">{dummyUser.name}</h2>
          <p className="text-gray text-xs">{dummyUser.email}</p>
        </div>
      </div>
      {/* Info: (20231024 - Julian) Menu Items */}
      <div className="flex flex-col w-full">
        {/* Info: (20231024 - Julian) Overview */}
        <button
          onClick={() => setMenu('overview')}
          className={`flex w-full font-bold border text-base ${
            menu === 'overview'
              ? 'text-white border-primaryGreen bg-primaryGreen'
              : 'text-black2 border-gray2 bg-white'
          } items-center space-x-2 p-3`}
        >
          <PiHouseBold size={24} />
          <p>Overview</p>
        </button>
        {/* Info: (20231024 - Julian) Collaborators */}
        <button
          onClick={() => setMenu('collaborators')}
          className={`flex w-full font-bold border text-base ${
            menu === 'collaborators'
              ? 'text-white border-primaryGreen bg-primaryGreen'
              : 'text-black2 border-gray2 bg-white'
          } items-center space-x-2 p-3`}
        >
          <LuUsers size={24} />
          <p>Collaborators</p>
        </button>
      </div>
    </div>
  );
  return view;
};

const JobBoard = ({menu}: {menu: 'overview' | 'collaborators'}) => {
  const startDate = Math.floor(new Date().getTime() / 1000);
  const endDate = startDate + 86400 * 30;

  // Info: (20231024 - Julian) Filter State
  const [searchText, setSearchText] = useState('');
  const [dateStart, setDateStart] = useState(startDate);
  const [dateEnd, setDateEnd] = useState(endDate);
  const [filteredDate, setFilteredDate] = useState({
    startTimeStamp: startDate,
    endTimeStamp: endDate,
  });
  // Info: (20231025 - Julian) Job List State
  const [currentTab, setCurrentTab] = useState<'all' | 'processing' | 'done'>('all');
  // Info: (20231025 - Julian) Sort by Newest/Oldest
  const [sortByNewest, setSortByNewest] = useState(true);
  // Info: (20231025 - Julian) Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(dummyJobList.length / ITEMS_PER_PAGE));
  // Info: (20231025 - Julian) Select All
  const [selectAll, setSelectAll] = useState(false);

  const endIdx = activePage * ITEMS_PER_PAGE;
  const startIdx = endIdx - ITEMS_PER_PAGE;

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
      setDateEnd(date);
      setFilteredDate({
        startTimeStamp: dateStart,
        endTimeStamp: date,
      });
    },
    [dateStart, filteredDate]
  );

  const uploadDateSortHandler = () => setSortByNewest(!sortByNewest);
  const selectAllHandler = () => setSelectAll(!selectAll);

  const filteredJobList = dummyJobList
    // Info: (20231025 - Julian) Filter by tab
    .filter(job => (currentTab === 'all' ? true : job.status === currentTab))
    // Info: (20231025 - Julian) Filter by search text
    .filter(job => job.fileName.toLowerCase().includes(searchText.toLowerCase()))
    // Info: (20231025 - Julian) Filter by upload date
    .filter(
      job =>
        job.uploadTimestamp >= filteredDate.startTimeStamp &&
        job.uploadTimestamp <= filteredDate.endTimeStamp
    )
    // Info: (20231025 - Julian) Sort by upload time
    .sort((a, b) =>
      sortByNewest ? b.uploadTimestamp - a.uploadTimestamp : a.uploadTimestamp - b.uploadTimestamp
    );

  useEffect(() => {
    setActivePage(1);
    setTotalPages(Math.ceil(filteredJobList.length / 7));
  }, [currentTab, searchText, filteredDate, sortByNewest]);

  const displayedJobList = filteredJobList
    .map((job, index) => (
      <JobItem
        key={index}
        author={job.author}
        fileName={job.fileName}
        uploadTimestamp={job.uploadTimestamp}
        status={job.status}
        checked={job.checked}
      />
    )) // Info: (20231025 - Julian) Pagination
    .slice(startIdx, endIdx);

  const overview = (
    <div className="flex h-full bg-white2 flex-1 flex-col p-6 space-y-6 rounded">
      {/* Info: (20231024 - Julian) Title */}
      <h1 className="text-black font-bold text-42px">Projects</h1>
      {/* Info: (20231024 - Julian) Filter */}
      <div className="flex items-center space-x-10">
        {/* Info: (20231024 - Julian) Search Bar */}
        <div className="flex items-center relative flex-1">
          <input
            className="w-300px h-48px py-3 pl-12 pr-4 w-full placeholder:text-gray rounded border border-gray2 shadow-lg"
            type="search"
            placeholder="Search"
            onChange={searchChangeHandler}
          />
          <FiSearch size={24} style={{position: 'absolute', left: '16px'}} />
        </div>
        {/* Info: (20231024 - Julian) Date Picker */}
        <div className="flex items-center space-x-3">
          <DatePicker date={dateStart} setDate={dateStartUpdateHandler} maxDate={dateEnd} />
          <BiRightArrowAlt size={24} />
          <DatePicker date={dateEnd} setDate={dateEndUpdateHandler} minDate={dateStart} />
        </div>
      </div>
      {/* Info: (20231024 - Julian) Tools bar */}
      <div className="flex items-center justify-between">
        {/* Info: (20231024 - Julian) Tab */}
        <div className="flex items-center border-b border-coolGray space-x-4">
          <button
            onClick={() => setCurrentTab('all')}
            className={`border-b py-2 px-3 transition-all duration-200 ease-in-out ${
              currentTab === 'all' ? 'border-primaryGreen text-primaryGreen' : 'border-transparent'
            }`}
          >
            <p>All</p>
          </button>
          <button
            onClick={() => setCurrentTab('processing')}
            className={`border-b py-2 px-3 transition-all duration-200 ease-in-out ${
              currentTab === 'processing'
                ? 'border-primaryGreen text-primaryGreen'
                : 'border-transparent'
            }`}
          >
            <p>Processing</p>
          </button>
          <button
            onClick={() => setCurrentTab('done')}
            className={`border-b py-2 px-3 transition-all duration-200 ease-in-out ${
              currentTab === 'done' ? 'border-primaryGreen text-primaryGreen' : 'border-transparent'
            }`}
          >
            <p>Done</p>
          </button>
        </div>
        {/* Info: (20231024 - Julian) Buttons */}
        <div className="flex items-center space-x-4">
          <button>
            <FiDownload size={24} />
          </button>
          <button>
            <TbTrash size={24} />
          </button>
          <button>
            <BiSolidPlusCircle color="#57BE6C" size={40} />
          </button>
        </div>
      </div>
      {/* Info: (20231024 - Julian) Job List */}
      <div className="flex flex-col w-full flex-1">
        {/* Info: (20231025 - Julian) Job List Header */}
        <div className="flex items-center h-50px border border-primaryGreen bg-primaryGreen text-sm text-white p-2">
          <div className="w-6">
            <input
              type="checkbox"
              className="accent-white"
              checked={selectAll}
              onChange={selectAllHandler}
            />
          </div>
          {/* Info: (20231025 - Julian) Author */}
          <div className="w-180px px-3 whitespace-nowrap">Author</div>

          {/* Info: (20231025 - Julian) File Name */}
          <div className="w-100px whitespace-nowrap lg:block hidden">File Name</div>

          {/* Info: (20231025 - Julian) Upload Date */}
          <div className="w-120px flex items-center whitespace-nowrap lg:flex hidden">
            <p>Upload Date</p>
            <button onClick={uploadDateSortHandler}>
              {sortByNewest ? <BsArrowDownShort size={24} /> : <BsArrowUpShort size={24} />}
            </button>
          </div>
          {/* Info: (20231025 - Julian) Job Status */}
          <div className="flex-1">Status</div>
        </div>
        {displayedJobList}
      </div>
      {/* Info: (20231025 - Julian) Pagination */}
      <div className="w-full flex justify-center my-6">
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );

  return menu === 'overview' ? overview : <div>Collaborators</div>;
};

const App = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
  const googleId = process.env.GOOGLE_ID || '';
  const googleSecret = process.env.GOOGLE_SECRET || '';

  return (
    <>
      <Head>
        <title>TSMS</title>
        <link rel="icon" href="/tsms.ico" />
      </Head>

      <SessionProvider session={session}>
        <GoogleOAuthProvider clientId={googleId}>
          <Main />
        </GoogleOAuthProvider>
      </SessionProvider>
    </>
  );
};

export default App;

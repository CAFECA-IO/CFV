import Image from 'next/image';
import {FiDownload} from 'react-icons/fi';
import {ImCross} from 'react-icons/im';
import {timestampToString} from '@/lib/common';

interface JobItemProps {
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  fileName: string;
  uploadTimestamp: number;
  status: string;
  checked: boolean;
}

const JobItem = ({author, fileName, uploadTimestamp, status, checked}: JobItemProps) => {
  const uploadDate = timestampToString(uploadTimestamp);

  const displayedStatus =
    status === 'done' ? (
      <>
        {/* Info: (20231025 - Julian) Process bar */}
        <div className="flex-1">
          <p className="rounded-full bg-primaryGreen w-fit px-10px py-2px text-white text-sm">
            Done
          </p>
        </div>
        {/* Info: (20231025 - Julian) Download/Stop Button */}
        <button className="w-5 mx-auto">
          <FiDownload color="#101010" size={16} />
        </button>
      </>
    ) : (
      <>
        {/* Info: (20231025 - Julian) Process bar */}
        <div className="flex-1 flex flex-col text-xs text-gray">
          <div className="w-3/4 bg-coolGray h-15px">
            <span className="bg-primaryGreen h-15px w-1/2 z-10 block"></span>
          </div>
          <p>Estimated remaining time : </p>
        </div>
        {/* Info: (20231025 - Julian) Download/Stop Button */}
        <button className="w-5 mx-auto">
          <ImCross color="#101010" size={12} />
        </button>
      </>
    );

  return (
    <div className="flex items-center border-x border-b border-coolGray p-2 h-50px">
      <div className="w-6 flex items-center">
        <input type="checkbox" className="accent-primaryGreen" />
      </div>
      {/* Info: (20231024 - Julian) Author */}
      <div className="flex items-center space-x-2 w-180px">
        <div className="rounded-full overflow-hidden relative w-40px h-40px">
          <Image
            src={author.avatar}
            fill
            style={{objectFit: 'cover', objectPosition: 'top'}}
            alt="avatar"
          />
        </div>
        {/* Info: (20231024 - Julian) User Name & Email */}
        <div className="flex flex-col">
          <h2 className="text-sm text-black font-bold">{author.name}</h2>
          <p className="text-gray text-xs">{author.email}</p>
        </div>
      </div>

      {/* Info: (20231024 - Julian) File Name */}
      <div className="w-100px lg:block hidden">
        <p className="text-black text-sm">{fileName}</p>
      </div>

      {/* Info: (20231024 - Julian) Upload Date */}
      <div className="w-120px lg:flex flex-col hidden">
        <h2 className="text-black text-sm">{uploadDate.date}</h2>
        <p className="text-gray text-xs">{uploadDate.time}</p>
      </div>

      {/* Info: (20231024 - Julian) Job Status */}
      <div className="flex-1 flex items-center space-x-2">{displayedStatus}</div>
    </div>
  );
};

export default JobItem;

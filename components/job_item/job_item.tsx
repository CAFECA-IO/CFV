import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { timestampToString } from "../../lib/common";

interface JobItemProps {
  missionId: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  fileName: string;
  uploadTimestamp: number;
  progress: number;
  status: string;
}

const JobItem = ({
  missionId,
  author,
  fileName,
  uploadTimestamp,
  progress,
  status,
}: JobItemProps) => {
  const uploadDate = timestampToString(uploadTimestamp);
  const truncateFileName =
    fileName.length > 10 ? `${fileName.slice(0, 10)}...` : fileName;
  const progressPercent = Math.round(progress * 100);

  const deleteMission = async () => {
    await fetch(`/api/mission/${missionId}`, {
      method: "DELETE",
    });
    alert("Mission Deleted");
  };

  const displayedStatus =
    status === "done" ? (
      <>
        {/* Info: (20231025 - Julian) Process bar */}
        <div className="flex-1">
          <p className="rounded-full bg-primaryGreen w-fit px-10px py-2px text-white text-sm">
            Done
          </p>
        </div>
        {/* Info: (20231025 - Julian) Download/Stop Button */}
        <a
          href={`/api/mission/${missionId}`}
          target="_blank"
          className="w-5 mx-auto"
        >
          <FiDownload color="#101010" size={16} />
        </a>
      </>
    ) : (
      <>
        {/* Info: (20231025 - Julian) Process bar */}
        <div className="flex-1 flex flex-col text-xs text-gray">
          <div className="w-3/4 bg-coolGray h-15px">
            <span
              style={{
                width: `${progressPercent}%`,
              }}
              className="bg-primaryGreen animate-pulse h-15px z-10 block transition-all duration-300 ease-in-out"
            ></span>
          </div>
          <p>{progressPercent}%</p>
        </div>
        {/* Info: (20231025 - Julian) Download/Stop Button */}
        <button className="w-5 mx-auto" onClick={deleteMission}>
          <TbTrash color="#101010" size={16} />
        </button>
      </>
    );

  return (
    <div className="flex items-center border-x border-b border-coolGray p-2 h-50px">
      <div className="w-6 flex items-center opacity-0">
        <input type="checkbox" className="accent-primaryGreen" />
      </div>
      {/* Info: (20231024 - Julian) Author */}
      <div className="flex items-center space-x-2 w-180px">
        <div className="rounded-full overflow-hidden relative w-40px h-40px">
          <Image
            src={author.avatar}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
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
        <p className="text-black text-sm">{truncateFileName}</p>
      </div>

      {/* Info: (20231024 - Julian) Upload Date */}
      <div className="w-120px lg:flex flex-col hidden">
        <h2 className="text-black text-sm">{uploadDate.date}</h2>
        <p className="text-gray text-xs">{uploadDate.time}</p>
      </div>

      {/* Info: (20231024 - Julian) Job Status */}
      <div className="flex-1 flex items-center space-x-2">
        {displayedStatus}
      </div>
    </div>
  );
};

export default JobItem;

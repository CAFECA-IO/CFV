import Image from 'next/image';

const JobItem = () => {
  return (
    <div className="flex items-center border-b border-coolGray py-2">
      <div className="w-40px flex items-center">
        <input type="checkbox" className="w-4 h-4" />
      </div>
      {/* Info: (20231024 - Julian) Author */}
      <div className="flex items-center space-x-2 w-250px flex-1">
        <div className="rounded-full overflow-hidden relative w-40px h-40px">
          <Image
            src={'/avatar/user_photo_1.jpeg'}
            fill
            style={{objectFit: 'cover', objectPosition: 'top'}}
            alt="avatar"
          />
        </div>
        {/* Info: (20231024 - Julian) User Name & Email */}
        <div className="flex flex-col">
          <h2 className="text-sm text-black font-bold">Jane Doe</h2>
          <p className="text-gray text-xs">jane.doe@gmail.com</p>
        </div>
      </div>

      {/* Info: (20231024 - Julian) File Name */}
      <div className="w-100px">
        <p className="text-black text-sm">File 001</p>
      </div>

      {/* Info: (20231024 - Julian) Upload Date */}
      <div className="w-100px flex flex-col">
        <h2 className="text-black text-sm">2023-08-08</h2>
        <p className="text-gray text-xs">14 : 30 : 04</p>
      </div>

      {/* Info: (20231024 - Julian) Job Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primaryGreen"></div>
        </div>
      </div>
    </div>
  );
};

export default JobItem;

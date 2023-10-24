import {Dispatch, SetStateAction, useState} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({activePage, setActivePage, totalPages}: IPagination) => {
  const [targetPage, setTargetPage] = useState<number>(1);

  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

  // Info: (20230907 - Julian) 將在 input 輸入的數字放入 targetPage
  const pageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;
    if (value > totalPages) {
      setTargetPage(totalPages);
    } else if (value < 1) {
      setTargetPage(1);
    } else {
      setTargetPage(value);
    }
  };

  // Info: (20230907 - Julian) 按下 Enter 後，將 targetPage 設定給 activePage
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setActivePage(targetPage);
    }
  };

  const previousBtn = (
    <button
      onClick={() => setActivePage(activePage - 1)}
      disabled={activePage === 1 ? true : false}
      className={buttonStyle}
    >
      <RiArrowLeftSLine className="text-2xl" />
    </button>
  );

  const nextBtn = (
    <button
      onClick={() => setActivePage(activePage + 1)}
      disabled={activePage === totalPages ? true : false}
      className={buttonStyle}
    >
      <RiArrowRightSLine className="text-2xl" />
    </button>
  );

  const pageInput = (
    <input
      name="page"
      type="number"
      placeholder={`${activePage}`}
      className="flex h-48px w-48px items-center justify-center rounded border border-hoverWhite bg-darkPurple p-3 text-center text-sm text-hoverWhite"
      onChange={pageChangeHandler}
      onKeyDown={handleKeyDown}
      min={1}
      max={totalPages}
    />
  );

  return (
    <div className="flex flex-col items-center">
      {/* Info: (20230907 - Julian) Selector */}
      <ul className="mb-2 flex w-fit items-center justify-center gap-1 text-sm font-medium">
        <li>{previousBtn}</li>
        <li>{pageInput}</li>
        <li>{nextBtn}</li>
      </ul>

      {/* Info: (20230907 - Julian) activePage of totalPage */}
      <div className="inline-flex w-150px items-center">
        <span className="w-full border-b border-lilac"></span>
        <p className="whitespace-nowrap px-2 text-sm text-lilac">
          {activePage} of {totalPages}
        </p>
        <span className="w-full border-b border-lilac"></span>
      </div>
    </div>
  );
};

export default Pagination;

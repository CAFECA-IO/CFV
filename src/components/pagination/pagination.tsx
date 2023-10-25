import {Dispatch, SetStateAction} from 'react';
import {BiChevronRight, BiChevronLeft} from 'react-icons/bi';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({activePage, setActivePage, totalPages}: IPagination) => {
  const arrowSize = 'h-6 w-6';
  const truncationLimit = 5;
  const surroundPage = Math.floor(truncationLimit / 2);

  const pagesNum = Array.from({length: totalPages}, (_, i) => i + 1);

  const isPageVisible = (page: number) => {
    if (page === 1 || page === totalPages) {
      return true;
    }

    if (activePage <= truncationLimit - 1 && page <= truncationLimit) {
      return true;
    } else if (
      activePage >= truncationLimit &&
      activePage <= totalPages - 1 &&
      page >= activePage - surroundPage &&
      page <= activePage + surroundPage
    ) {
      return true;
    } else if (activePage >= totalPages - 1 && page > totalPages - truncationLimit) {
      return true;
    }

    return false;
  };

  const pages = pagesNum.map((page, i, arr) => {
    const isPrevPageVisible = arr[i - 1] ? isPageVisible(arr[i - 1]) : false;
    const shouldTruncateBefore = page !== 1 && !isPrevPageVisible && isPageVisible(page);
    return (
      <>
        {shouldTruncateBefore && <li>...</li>}
        {isPageVisible(page) && (
          <li key={`page-section-${page}`}>
            <button
              onClick={() => setActivePage(page)}
              className={`h-8 w-8 rounded-full text-center ${
                activePage === page ? 'bg-primaryGreen text-white' : 'text-black'
              }`}
            >
              {page}
            </button>
          </li>
        )}
      </>
    );
  });

  const pagination = (
    <>
      <li>
        <button
          onClick={() => setActivePage((prev: number) => Math.max(prev - 1, 1))}
          disabled={activePage === 1}
          className="text-black flex items-center disabled:text-gray space-x-2"
        >
          <BiChevronLeft size={24} />
          <p>Previous</p>
        </button>
      </li>
      {pages}
      <li>
        <button
          onClick={() => setActivePage((prev: number) => Math.min(prev + 1, totalPages))}
          disabled={activePage === totalPages}
          className="text-black flex items-center disabled:text-gray space-x-2"
        >
          <p>Next</p>
          <BiChevronRight size={24} />
        </button>
      </li>
    </>
  );

  return (
    <ol className="flex justify-center gap-2 text-sm font-medium items-center">{pagination}</ol>
  );
};

export default Pagination;

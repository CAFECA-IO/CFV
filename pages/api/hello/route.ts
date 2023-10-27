import XLSX, {read} from 'xlsx';

// sleep function
const sleep = async (ms: number) => {
  console.log('sleep: ', ms);
  return new Promise(resolve => setTimeout(resolve, ms));
};

const removeSymbol = (address: string) => {
  return encodeURIComponent(address.replaceAll('#', ''));
};

const getDistance = async (address1: string, address2: string, retry = 3) => {
  try {
    // get distance from google api with address1 and address2
    const cleanAddress1 = removeSymbol(address1);
    const cleanAddress2 = removeSymbol(address2);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${cleanAddress1}&destinations=${cleanAddress2}&key=AIzaSyC3Sn90tnB460mmoRUsAk04rhTeafprVBY`;
    const map = `https://www.google.com.tw/maps/dir/${cleanAddress1}/${cleanAddress2}`;
    console.log(url);
    // const response = await fetch(url);
    // const data = await response.json();
    // const address1Parsed = data.origin_addresses[0];
    // const address2Parsed = data.destination_addresses[0];
    // const distance = data.rows[0].elements[0].distance.text;
    const result = {
      // address1: address1Parsed,
      // address2: address2Parsed,
      // distance: distance
      url,
      map,
    };
    return result;
  } catch (error) {
    console.log(error);
    await sleep(1000);
    const retryTime = retry - 1;
    if (retryTime === 0) {
      return {
        address1: 'Unknown Address',
        address2: 'Unknown Address',
        distance: '?? km',
      };
    } else {
      return getDistance(address1, address2, retryTime);
    }
  }
};

const parseSheet = async (sheet: any) => {
  const json = XLSX.utils.sheet_to_json(sheet);
  const result: any[] = [];

  let count = 0;
  for (let row of json) {
    const values = Object.values(row || {});
    const newRecord: any = row;
    const address1 = values[1] as string;
    const address2 = values[2] as string;
    const distance = await getDistance(address1, address2);

    newRecord['Origin'] = distance.address1;
    newRecord['Destination'] = distance.address2;
    newRecord['Distance'] = distance.distance;
    newRecord['URL'] = distance.url;
    newRecord['Map'] = distance.map;
    result.push(newRecord);

    const sleepTime = Math.ceil(Math.random() * 100 + 100);
    // await sleep(sleepTime);
  }

  const rsSheet = XLSX.utils.json_to_sheet(result);
  return rsSheet;
};

export async function GET(request: Request) {
  // read address from xlsx file
  /*
  const workbook = await read('src/xlsx/ground3_result.xlsx', { type: 'file' });
  const newWorkbook = XLSX.utils.book_new();
  const sheetList = workbook.SheetNames;
  
  for(let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const rsSheet = await parseSheet(sheet);
    XLSX.utils.book_append_sheet(newWorkbook, rsSheet, sheetName);
    const sleepTime = Math.ceil(Math.random() * 500);
    await sleep(sleepTime);
  }
  XLSX.writeFile(newWorkbook, 'src/xlsx/ground3_result2.xlsx');

  const response = new Response('DONE!');
  return response;
  */
}

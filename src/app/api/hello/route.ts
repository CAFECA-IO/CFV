import XLSX, { read } from 'xlsx';

export async function GET(request: Request) {
  // read address from xlsx file
  const workbook = await read('src/xlsx/air.xlsx', { type: 'file' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet);

  const record1 = Object.values(json[1]);
  const address1 = record1[3];
  const address2 = record1[7];

  // get distance from google api with address1 and address2
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${address1}&destinations=${address2}&key=AIzaSyC3Sn90tnB460mmoRUsAk04rhTeafprVBY`;
  const response = await fetch(url);
  const data = await response.json();

  // get distance from google distance api 
  const url2 = `https://maps.googleapis.com/maps/api/distance/json?units=metric&origins=${address1}&destinations=${address2}&key=AIzaSyC3Sn90tnB460mmoRUsAk04rhTeafprVBY`;
  const response2 = await fetch(url2);
  const data2 = await response2.json();

  return new Response(JSON.stringify(data2));
}

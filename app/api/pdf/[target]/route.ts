import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer';

async function htmlToPDF(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
  });

  await browser.close();
  return pdf;
}

export async function GET(req: NextRequest, context: { params }) {
  const target = context.params.target;
  const pdfBuffer = await htmlToPDF(target);
  
  const contentType = 'application/pdf';
  const response = new NextResponse(pdfBuffer);
  response.headers.set("content-type", contentType);
  response.headers.set('Access-Control-Allow-Credentials', "false")
  response.headers.set('Access-Control-Allow-Origin', '*') 
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.set('Access-Control-Allow-Headers', 'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date')

  return response;
}
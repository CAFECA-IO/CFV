import Image from "next/image";
import Overview from "../components/overview/overview";
import { useState, Dispatch, SetStateAction } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as crypto from "crypto";
import { createSecureServer } from "http2";

const MERCHANT_ID = process.env.MERCHANT_ID as string;
const PAYMENT_VERSION = process.env.PAYMENT_VERSION as string;
const PAYMENT_URL = process.env.PAYMENT_URL as string;
const PAYMENT_NOTIFY_URL = process.env.PAYMENT_NOTIFY_URL as string;
const PAYMENT_RETURN_URL = process.env.PAYMENT_RETURN_URL as string;
const VERSION = process.env.VERSION as string;
const HASHKEY = process.env.HASHKEY as string;
const HASHIV = process.env.HASHIV as string;

const genDataChain = (data) => {
  const dataChain = Object.keys(data).reduce((prev, curr) => {
    const value = prev + `&${curr}= ${encodeURIComponent(data[curr])}`;
    return value;
  }, `MerchantID=${MERCHANT_ID}&Version=${VERSION}&RespondType=JSON&NotifyURL=${encodeURIComponent(PAYMENT_NOTIFY_URL)}&ReturnURL=${encodeURIComponent(PAYMENT_RETURN_URL)}`);
  return dataChain;
}

const createSesEncrypt = (data) => {
  const cipherKey = HASHKEY as string;
  const cipherIV = HASHIV as string;
  const encrypt = crypto.createCipheriv('aes-256-cbc', cipherKey, cipherIV);
  const enc = encrypt.update(genDataChain(data), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

const createSesDecrypt = (data) => {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(data, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const seed = plainText.replace(/[\x00-\x20]+/g, '');
  const result = JSON.parse(seed);
  return result;
}

const Payment = () => {
  const { data: session, status } = useSession();
  const orderData = { ItemDesc: "100筆分析運算資源", Amt: "100", Email: "luphia@outlook.com" };
  const TimeStamp = Math.ceil(Date.now() / 1000);

  const MerchantOrderNo = Date.now();
  const order = {
    ...orderData,
    TimeStamp,
    Amt: orderData.Amt,
    MerchantOrderNo,
  };

  const aesEncrypt = createSesEncrypt(order);


  const content = (
    <form action={process.env.PAYMENT_URL} method="post">
      MerchantID: <input name="MerchantID" className="bg-white m-1" defaultValue={MERCHANT_ID} /><br/>
      RespondType: <input name="RespondType" className="bg-white m-1" defaultValue="application/json" /><br/>
      Version: <input name="Version" className="bg-white m-1" defaultValue={PAYMENT_VERSION} /><br/>
      LangType: <input name="LangType" className="bg-white m-1" defaultValue="zh-tw" /><br/>
      NotifyURL: <input name="NotifyURL" className="bg-white m-1" defaultValue={PAYMENT_NOTIFY_URL} /><br/>
      ReturnUrl: <input name="ReturnUrl" className="bg-white m-1" defaultValue={PAYMENT_RETURN_URL} /><br/>
      <hr/>
      MerchantOrderNo: <input name="MerchantOrderNo" className="bg-white m-1" defaultValue={Date.now()} /><br/>
      TradeSha: <input name="TradeSha" className="bg-white m-1" defaultValue="" /><br/>
      TradeInfo: <input name="TradeInfo" className="bg-white m-1" defaultValue="" /><br/>
      Timestamp: <input name="TimeStamp" className="bg-white m-1" defaultValue={Math.ceil(Date.now() / 1000)} /><br/>
      Amt: <input name="Amt" className="bg-white m-1" defaultValue="100" /><br/>
      ItemDesc: <input name="ItemDesc" className="bg-white m-1" defaultValue="100筆分析運算資源" /><br/>
      Email: <input type="email" name="Email" className="bg-white m-1" defaultValue="luphia@outlook.com" /><br/>
      <button type="submit">Submit</button>
    </form>
  );
  const view = (
    <div className="p-10px font-roboto flex min-h-screen max-w-1032px mx-auto justify-center items-center">
      {content}
    </div>
  );
  return view;
};

export default Payment;
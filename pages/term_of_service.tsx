// a react view of terms of service
const content = (
  <div className="w-800px m-auto">
    <br />
    <br />
    <h1 className="text-2xl font-bold justify-center items-center">服務條款</h1>
    <p className="m-10px">
      歡迎使用碳足跡盤查網服務！請在使用我們的服務之前仔細閱讀以下條款。當您訪問或使用我們的平台時，即表示您同意遵守以下條款和條件：
    </p>
    <p className="m-10px">
      1. 服務描述：<br />
      我們的碳足跡分析平台旨在協助用戶評估和管理其個人或組織的碳足跡。我們提供的服務可能包括但不限於碳足跡計算工具、建議和資源等。
    </p>
    <p className="m-10px">
      2. 使用者註冊：<br />
      為了訪問和使用我們的服務，您可能需要註冊一個帳戶。您需確保提供的資訊準確無誤，並保證及時更新您的個人資料。您應當妥善保管您的帳戶資訊，並對您的帳戶和密碼負有保管責任。
    </p>
    <p className="m-10px">
      3. 用戶責任：<br />
      您同意不會利用我們的服務從事任何違法活動，包括但不限於侵犯他人的知識產權、洩露機密信息、發布誹謗性言論等。您應尊重其他用戶的權利和隱私。
    </p>
    <p className="m-10px">
      4. 隱私保護：<br />
      我們尊重用戶的隱私權，並致力於保護用戶的個人資訊。我們將根據我們的隱私政策處理您的個人資料，請您仔細閱讀我們的隱私政策以瞭解我們收集、使用和共享個人資訊的方式。
    </p>
    <p className="m-10px">
      5. 服務提供的限制：<br />
      我們的服務可能會受到技術和其他限制的影響，我們不保證服務將始終無中斷、及時、安全或免於錯誤。
    </p>
    <p className="m-10px">
      6. 知識產權：<br />
      我們的平台包含受知識產權法保護的內容，包括但不限於軟體、文字、圖像、圖表、視頻等。除非我們另有聲明，否則這些內容的所有權利均屬於我們或我們的授權方。未經我們或授權方的明確書面許可，您不得以任何方式使用、修改、散佈或重製這些內容。
    </p>
    <p className="m-10px">
      7. 費用：<br />
      我們的距離分析服務可收取費用每 100 筆 TWD 100 元，每個帳號擁有 10 筆免費試用額度，我們保留隨時更改費用標準的權利。
    </p>
    <p className="m-10px">
      8. 免責聲明：<br />
      在法律允許的範圍內，我們不對因使用我們的服務而導致的任何直接或間接損失承擔責任，包括但不限於利潤損失、商譽損失、資料損失等。
    </p>
    <p className="m-10px">
      9. 修改與終止：<br />
      我們保留隨時修改、暫停或終止提供服務的權利。我們將盡量提前通知您，但在某些情況下，我們可能無法提前通知。
    </p>
    <p className="m-10px">
      10. 準據法與管轄權：<br />
      本條款受中華民國法律管轄，任何因本條款引起的爭議應提交中華民國有管轄權的法院裁決。
    </p>
    <p className="m-10px">
      如果您對這些條款有任何疑問或疑慮，請與我們聯繫。感謝您使用我們的服務！
    </p>
  </div>
);

// footer view, sticky to the bottom, height 100px
const footer = (
  <div className="fixed flex bottom-0 justify-center items-center w-full h-100px bg-white text-gray">
    <p className="text-xs">
      © 2021 MerMer Ltd. All rights reserved.
    </p>
    <p className="text-xs ml-2">
      <a href="/">回到首頁</a> | <a href="privacy_policy">隱私權條款</a> | <a href="mailto:contact@mermer.com.tw">聯絡我們</a>
    </p>
  </div>
);

const TermOfService = () => {
  return (
    <div className="w-full h-full justify-center items-center">
      { content }
      { footer }
    </div>
  );
}

export default TermOfService;
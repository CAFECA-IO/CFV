// a react view of terms of service
const content = (
  <div className="w-800px m-auto">
    <br />
    <br />
    <h1 className="text-2xl font-bold justify-center items-center">隱私權條款</h1>
    <p className="m-10px">
    我們尊重您的隱私權。本隱私權條款描述了我們收集、使用和共享您的個人資訊的政策和做法。請您在使用我們的服務之前仔細閱讀以下內容：
    </p>
    <p className="m-10px">
      1. 收集的資訊：<br />
      我們可能會收集與您使用我們服務相關的個人資訊，包括但不限於姓名、電子郵件地址、聯絡資訊、使用偏好等。我們可能通過您註冊帳戶、填寫問卷調查、使用分析工具等方式收集這些資訊。
    </p>
    <p className="m-10px">
      2. 資訊使用：<br />
      我們收集的個人資訊將用於提供、維護和改進我們的服務，以及向您提供相關信息和建議。我們也可能將您的資訊用於內部記錄、市場研究和其他合法用途。
    </p>
    <p className="m-10px">
      3. 資訊分享：<br />
      我們不會未經您的同意向任何第三方披露您的個人資訊，除非符合法律法規的規定或為保護我們的權益和財產安全所必需。
    </p>
    <p className="m-10px">
      4. 資訊保護：<br />
      我們會採取合理的安全措施保護您的個人資訊，以防止未經授權的存取、使用、修改或披露。然而，請注意，網際網路上的資訊傳輸並非完全安全，我們無法保證您的資訊在傳輸過程中的安全性。
    </p>
    <p className="m-10px">
      5. Cookie 與追蹤技術：<br />
      我們可能使用Cookie和其他追蹤技術收集和存儲有關您的資訊。這些技術有助於我們識別您的瀏覽器，記住您的偏好，並提供更個性化的使用體驗。您可以通過瀏覽器設置拒絕Cookie，但這可能會影響您對我們服務的使用。
    </p>
    <p className="m-10px">
      6. 兒童隱私保護：<br />
      我們的服務不面向未滿十八歲的兒童。如果您發現您的兒童未經您的同意向我們提供了個人資訊，請與我們聯繫，我們將立即刪除該資訊。
    </p>
    <p className="m-10px">
      7. 第三方連結：<br />
      我們的服務可能包含指向第三方網站或服務的連結，我們不對這些網站或服務的隱私政策負責。請在訪問這些第三方網站或服務之前閱讀其隱私政策。
    </p>
    <p className="m-10px">
      8. 隱私權條款的變更：<br />
      我們保留隨時修改本隱私權條款的權利，修改後的條款將在我們的網站上公布。您繼續使用我們的服務將被視為接受修改後的隱私權條款。
    </p>
    <br />
    <p className="m-10px">
    如果您對這些隱私權條款有任何疑問或疑慮，請與我們聯繫。感謝您使用我們的服務！
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
      <a href="/">回到首頁</a> | <a href="/term_of_service">服務條款</a> | <a href="mailto:contact@mermer.com.tw">聯絡我們</a>
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
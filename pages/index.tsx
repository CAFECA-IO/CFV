import Image from "next/image";
import Overview from "../components/overview/overview";
import { useState, Dispatch, SetStateAction } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { GoogleLogin } from "@react-oauth/google";
import { PiHouseBold } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { PiPlantFill } from "react-icons/pi";

const dummyUser = {
  name: "Jane Doe",
  email: "jane.doe@gmail.com",
  avatar: "/avatar_147144.png",
};

const Main = () => {
  const { data: session, status } = useSession();
  const content = !session ? (
    <OperationView session={session} />
  ) : (
    <LoginView />
  );
  const view = (
    <div className="p-10px font-roboto flex min-h-screen max-w-1032px mx-auto justify-center items-center">
      {content}
    </div>
  );
  return view;
};

const LoginView = () => {
  const view = (
    <div className="flex flex-col justify-center items-end bg-cover bg-login h-720px w-full bg-white rounded">
      <div className="text-2xl font-bold w-1/2 p-20 space-y-12">
        <h1 className="text-black text-42px">Sign in</h1>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <div className="h-px bg-coolGray w-full"></div>
        <div className="flex items-center space-x-1">
          <PiPlantFill color="red" />
          <PiPlantFill color="orange" />
          <PiPlantFill color="gold" />
          <PiPlantFill color="lime" />
          <PiPlantFill color="turquoise" />
          <PiPlantFill color="violet" />
          <PiPlantFill color="pink" />
        </div>
      </div>
    </div>
  );

  return view;
};

const OperationView = (session) => {
  const session_data = JSON.stringify(session);
  const [menu, setMenu] = useState<"overview" | "collaborators">("overview");

  const view = (
    <div className="relative flex items-start justify-start w-full h-720px rounded bg-white">
      <MenuView menu={menu} setMenu={setMenu} />
      <JobBoard menu={menu} />
    </div>
  );

  return view;
};
const MenuView = ({
  menu,
  setMenu,
}: {
  menu: "overview" | "collaborators";
  setMenu: Dispatch<SetStateAction<"overview" | "collaborators">>;
}) => {
  const view = (
    <div className="w-250px flex flex-col z-10 space-y-10 items-center h-full rounded px-4 py-6 bg-white shadow-xl">
      {/* Info: (20231024 - Julian) Logo */}
      <div>
        <Image src="/logo.png" width={100} height={80} alt="tsmc_logo" />
      </div>
      {/* Info: (20231024 - Julian) User Info */}
      <div className="flex space-x-4 items-center">
        {/* Info: (20231024 - Julian) Avatar */}
        <div className="rounded-full overflow-hidden relative w-50px h-50px">
          <Image
            src={dummyUser.avatar}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
            alt="avatar"
          />
        </div>
        {/* Info: (20231024 - Julian) User Name & Email */}
        <div className="flex flex-col">
          <h2 className="text-sm text-black">{dummyUser.name}</h2>
          <p className="text-gray text-xs">{dummyUser.email}</p>
        </div>
      </div>
      {/* Info: (20231024 - Julian) Menu Items */}
      <div className="flex flex-col w-full">
        {/* Info: (20231024 - Julian) Overview */}
        <button
          onClick={() => setMenu("overview")}
          className={`flex w-full font-bold border text-base ${
            menu === "overview"
              ? "text-white border-primaryGreen bg-primaryGreen"
              : "text-black2 border-gray2 bg-white"
          } items-center space-x-2 p-3`}
        >
          <PiHouseBold size={24} />
          <p>Overview</p>
        </button>
        {/* Info: (20231024 - Julian) Collaborators
        <button
          onClick={() => setMenu("collaborators")}
          className={`flex w-full font-bold border text-base ${
            menu === "collaborators"
              ? "text-white border-primaryGreen bg-primaryGreen"
              : "text-black2 border-gray2 bg-white"
          } items-center space-x-2 p-3`}
        >
          <LuUsers size={24} />
          <p>Collaborators</p>
        </button>
        */}
      </div>
    </div>
  );
  return view;
};

const JobBoard = ({ menu }: { menu: "overview" | "collaborators" }) => {
  return menu === "overview" ? <Overview /> : <div>Collaborators</div>;
};

export default Main;

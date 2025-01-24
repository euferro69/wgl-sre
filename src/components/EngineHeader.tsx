import { playAudio } from "@/utils/Audio";
import { Avatar, Button, Tooltip } from "@mui/material";
import Link from "next/link";

export default function EngineHeader() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-start align-middle bg-[#222] border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
        <img
          alt="Blue Engine"
          src="/favicon.ico"
          width={24}
          height={24}
          className="object-contain ml-2 mr-1"
        />
        <Tooltip title="File actions">
          <button className="px-2 py-1 mr-2 hover:bg-slate-600">File</button>
        </Tooltip>
        <button className="px-2 py-1 mr-2 hover:bg-slate-600">Edit</button>
        <button className="px-2 py-1 mr-2 hover:bg-slate-600">View</button>
        <Link href={"https://github.com/euferro69/BlueEngine"}><button className="px-2 py-1 mr-2 hover:bg-slate-600">Docs</button></Link>
      </div>
      <div className="flex flex-row w-full bg-[#222] p-2 border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
        <Button
          variant="contained"
          color="info"
          size="small"
          onClick={() => {
            playAudio("/audio/ci-3-91252.mp3");
          }}
        >
          Play Audio
        </Button>
      </div>
    </div>
  );
}

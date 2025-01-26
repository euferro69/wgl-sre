import { playAudio } from "@/utils/Audio";
import { PlayArrow } from "@mui/icons-material";
import { Avatar, Button, Tooltip } from "@mui/material";
import Link from "next/link";

export default function EngineHeader() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full gap-2 bg-[#222] p-2 border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
        <Button
          variant="contained"
          color="info"
          size="small"
          className=""
          onClick={() => {
            playAudio("/audio/ci-3-91252.mp3");
          }}
        >
          Play Audio
        </Button>
        {/* <Button
          variant="contained"
          color="inherit"
          size="small"
          startIcon={<PlayArrow />}
          className="!bg-slate-500"
        >
          Simulate
        </Button> */}
      </div>
    </div>
  );
}

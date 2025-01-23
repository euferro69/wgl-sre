import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";

export default function EngineConsole() {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {});

  return (
    <>
      <div className="flex flex-col absolute bottom-0 w-full h-fit">
        <div className="felx flex-row w-full h-full bg-[#222] p-0">
          <div className="border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
            <IconButton
              aria-label="delete"
              color="inherit"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
            >
              {open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            Console
          </div>
        </div>
        <div
          id="engine-console"
          className={
            open
              ? "w-full overflow-y-auto bg-[#222] flex flex-col max-h-52 p-4 transition-all"
              : "w-full overflow-y-auto bg-[#222] flex flex-col max-h-0 p-0 transition-all"
          }
        ></div>
      </div>
    </>
  );
}

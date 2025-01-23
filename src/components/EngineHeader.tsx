import { Avatar, Button, Tooltip } from "@mui/material";

export default function EngineHeader() {
    return (
        <div className="absolute top-0 flex flex-col w-full">
            <div className="flex flex-row bg-[#222] border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
                <Tooltip title="File actions"><button className="px-2 py-1 mr-2 hover:bg-slate-600">File</button></Tooltip>
                <button className="px-2 py-1 mr-2 hover:bg-slate-600">Edit</button>
                <button className="px-2 py-1 mr-2 hover:bg-slate-600">View</button>
                <button className="px-2 py-1 mr-2 hover:bg-slate-600">Help</button>
            </div>
            <div className="flex flex-row w-full bg-[#222] p-2 border border-t-[#333] border-b-[#333] border-l-0 border-r-0">
                <Avatar alt="Blue Engine" src="/favicon.ico" sx={{ width: 25, height: 25 }} className="mr-2" />
                <div className="w-full h-full flex align-middle">Blue Engine</div>
            </div>
        </div>
    );
}
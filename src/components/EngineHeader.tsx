import { Avatar } from "@mui/material";

export default function EngineHeader() {
    return (
        <div className="flex flex-row absolute top-0 w-full bg-gray-700 p-2">
            <Avatar alt="Blue Engine" src="/favicon.ico" sx={{ width: 25, height: 25 }} className="mr-2" />
            <div className="w-full h-full flex align-middle">Blue Engine</div>
        </div>
    );
}
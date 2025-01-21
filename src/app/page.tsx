import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";

export default function Home() {
  return (
    <>
      <FpsOverlay />
      <LogOverlay />
      <canvas id="webgl-canvas"></canvas>
    </>
  );
}

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TopTracksChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current).append("svg").attr("width", 500).attr("height", 300);
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * 50)
      .attr("y", d => 300 - d.playcount * 5)
      .attr("width", 40)
      .attr("height", d => d.playcount * 5)
      .attr("fill", "blue");
  }, [data]);

  return <div ref={ref}></div>;
}

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Page } from '../services/api';

interface MarkovVisualizationProps {
  results: Page[];
  currentState: string;
  onStateChange: (id: number) => void;
}

const MarkovVisualization: React.FC<MarkovVisualizationProps> = ({
  results,
  currentState,
  onStateChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !results.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create force simulation
    const simulation = d3.forceSimulation(results)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Create links based on relatedPages
    const links: any[] = [];
    results.forEach(page => {
      page.relatedPages?.forEach(relatedId => {
        const target = results.find(p => p.id === relatedId);
        if (target) {
          links.push({
            source: page,
            target,
            value: page.clickProbability
          });
        }
      });
    });

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => d.value * 2);

    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(results)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => onStateChange(d.id));

    // Add circles for nodes
    node.append("circle")
      .attr("r", 30)
      .attr("fill", d => d.title === currentState ? "#4299e1" : "#9ae6b4")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    // Add labels
    node.append("text")
      .text(d => d.title.slice(0, 15) + (d.title.length > 15 ? "..." : ""))
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .attr("font-size", "10px");

    // Update positions on simulation tick
    simulation.nodes(results).on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [results, currentState]);

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MarkovVisualization; 
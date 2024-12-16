import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Page } from '../services/api';

interface SimulationPage extends Page, d3.SimulationNodeDatum {}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationPage> {
  value: number;
}

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

  // Create filtered links based on current state
  const filteredLinks = useMemo(() => {
    const links: SimulationLink[] = [];
    const currentPage = results.find(p => p.title === currentState);
    
    if (currentPage) {
      // Add links from current page to related pages
      currentPage.relatedPages?.forEach(relatedId => {
        const target = results.find(p => p.id === String(relatedId));
        if (target) {
          links.push({
            source: currentPage,
            target,
            value: currentPage.clickProbability
          });
        }
      });

      // Add links from other pages to current page
      results.forEach(page => {
        if (page.relatedPages?.includes(currentPage.id)) {
          links.push({
            source: page,
            target: currentPage,
            value: page.clickProbability
          });
        }
      });
    }
    return links;
  }, [results, currentState]);

  useEffect(() => {
    if (!svgRef.current || !results.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Update the simulation setup with better initial positioning
    const simulation = d3.forceSimulation<SimulationPage>(results as SimulationPage[])
      // Stronger center force to keep nodes more contained
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      // Reduced charge for less scattering
      .force("charge", d3.forceManyBody().strength(-300))
      // Larger collision radius to prevent overlap
      .force("collision", d3.forceCollide().radius(100).strength(0.8))
      // Add x and y forces to create a more grid-like layout
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("link", d3.forceLink<SimulationPage, SimulationLink>(filteredLinks)
        .id(d => d.id)
        .distance(200)
        .strength(0.5)
      );

    // Initialize node positions in a circle
    const radius = Math.min(width, height) / 3;
    const angleStep = (2 * Math.PI) / results.length;
    results.forEach((d, i) => {
      const angle = i * angleStep;
      (d as SimulationPage).x = width / 2 + radius * Math.cos(angle);
      (d as SimulationPage).y = height / 2 + radius * Math.sin(angle);
    });

    // Add alpha decay to make the simulation settle more quickly
    simulation.alphaDecay(0.02);

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    // Add arrow markers for directed links
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 40)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

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
    simulation.nodes(results as SimulationPage[]);
    (simulation.force("link") as d3.ForceLink<SimulationPage, SimulationLink>).links(filteredLinks);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SimulationPage).x!)
        .attr("y1", d => (d.source as SimulationPage).y!)
        .attr("x2", d => (d.target as SimulationPage).x!)
        .attr("y2", d => (d.target as SimulationPage).y!);

      node
        .attr("transform", d => `translate(${(d as SimulationPage).x!},${(d as SimulationPage).y!})`);
    });

    return () => {
      simulation.stop();
    };
  }, [results, currentState, filteredLinks]);

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MarkovVisualization;
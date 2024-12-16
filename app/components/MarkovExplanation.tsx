import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MarkovExplanation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    
    svg.attr('width', width)
       .attr('height', height);

    svg.selectAll("*").remove();

    // Define states with more descriptive labels
    const states = [
      { 
        id: 'search', 
        label: 'Search Results',
        description: 'Initial state with ranked results',
        x: 150, 
        y: 200 
      },
      { 
        id: 'page1', 
        label: 'Page Selected',
        description: 'Click prob (p) increases, others decrease',
        x: 400, 
        y: 200 
      },
      { 
        id: 'related', 
        label: 'Related Pages',
        description: 'Connected through Markov transitions',
        x: 650, 
        y: 200 
      }
    ];

    // Define transitions with probabilities
    const transitions = [
      { 
        source: 'search', 
        target: 'page1', 
        label: 'Click (p)',
        description: '↑ Rank by 50%'
      },
      { 
        source: 'page1', 
        target: 'search', 
        label: 'Return (r)',
        description: '↓ Rank by 20%'
      },
      { 
        source: 'page1', 
        target: 'page1', 
        label: 'Stay (s)',
        description: '↑ Rank by 30%'
      },
      { 
        source: 'page1', 
        target: 'related', 
        label: 'Navigate',
        description: 'Follow connections'
      }
    ];

    // Add state nodes with improved styling
    const nodes = svg.selectAll('.state')
      .data(states)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add larger circles with gradient
    const gradient = svg.append("defs")
      .append("radialGradient")
      .attr("id", "stateGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#63B3ED");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4299E1");

    nodes.append('circle')
      .attr('r', 45)
      .attr('fill', 'url(#stateGradient)')
      .attr('stroke', '#2B6CB0')
      .attr('stroke-width', 2);

    // Add state labels with better positioning
    nodes.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 0)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white');

    // Add state descriptions
    nodes.append('text')
      .text(d => d.description)
      .attr('text-anchor', 'middle')
      .attr('dy', 70)
      .attr('font-size', '12px')
      .attr('fill', '#4A5568')
      .call(wrap, 150);

    // Add transitions with better styling
    transitions.forEach(t => {
      const source = states.find(s => s.id === t.source)!;
      const target = states.find(s => s.id === t.target)!;
      
      const isLoop = source === target;
      let path;

      if (isLoop) {
        path = `M ${source.x},${source.y - 45}
                C ${source.x - 70},${source.y - 100}
                  ${source.x + 70},${source.y - 100}
                  ${source.x},${source.y - 45}`;
      } else {
        path = `M ${source.x + 45},${source.y}
                L ${target.x - 45},${target.y}`;
      }

      // Add arrow paths with animation
      svg.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#4A5568')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)')
        .style('opacity', 0.7);

      // Add transition labels with descriptions
      const midX = isLoop ? source.x : (source.x + target.x) / 2;
      const midY = isLoop ? source.y - 90 : source.y - 25;

      const labelGroup = svg.append('g')
        .attr('transform', `translate(${midX},${midY})`);

      labelGroup.append('text')
        .text(t.label)
        .attr('text-anchor', 'middle')
        .attr('dy', 0)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#2D3748');

      labelGroup.append('text')
        .text(t.description)
        .attr('text-anchor', 'middle')
        .attr('dy', 20)
        .attr('font-size', '12px')
        .attr('fill', '#4A5568');
    });

    // Improved arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4A5568');

  }, []);

  // Helper function to wrap text
  function wrap(text: d3.Selection<any, any, any, any>, width: number) {
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line: string[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1;
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px");
      
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node()!.getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px").text(word);
        }
      }
    });
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">How Markov Chain Ranking Works</h2>
      <svg ref={svgRef} className="w-full" />
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800">Click Probability (p)</h3>
          <p>Increases when users select a result. Weighs 50% of final rank.</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800">Stay Probability (s)</h3>
          <p>Increases with time spent on page. Weighs 30% of final rank.</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800">Return Rate (r)</h3>
          <p>Affects ranking based on user returns. Weighs 20% of final rank.</p>
        </div>
      </div>
    </div>
  );
};

export default MarkovExplanation; 
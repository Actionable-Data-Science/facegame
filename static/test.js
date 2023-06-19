class PairedForceGraph {
  constructor(elementSelector, options) {
    this.elementSelector = elementSelector;
    this.options = options;
    this.data = {
      nodes: [],
      links: [],
    };
    this.svg = null;
    this.nodes = null;
    this.lines = null;
    this.simulation = null;
    this.dragStarted = this.dragStarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragEnded = this.dragEnded.bind(this);
    // this.initializeSimulation()
  }

  addPair(greenNode, blackNode) {
    const { nodes, links } = this.data;
    const greenId = `green-${nodes.length}`;
    const blackId = `black-${nodes.length}`;

    nodes.push(
      { id: greenId, x: greenNode.x, y: greenNode.y },
      { id: blackId, x: blackNode.x, y: blackNode.y }
    );

    links.push({ source: greenId, target: blackId });
  }

  initializeSimulation() {
    const { width, height } = this.options;

    this.simulation = d3
      .forceSimulation(this.data.nodes)
      .force("charge", d3.forceManyBody().strength(0))
      .force(
        "link",
        d3
          .forceLink(this.data.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", this.update.bind(this));
  }

  renderTo() {
    // this.initializeSimulation()
    const { width, height } = this.options;

    this.svg = d3
      .select(this.elementSelector)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const combinedNodes = this.svg
      .selectAll(".node")
      .data(this.data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", this.dragStarted)
          .on("drag", this.dragged)
          .on("end", this.dragEnded)
      );

    combinedNodes
      .append("circle")
      .attr("r", this.options.nodeRadius)
      .attr("fill", (d) => (d.id.startsWith("green") ? "green" : "black"));

    this.lines = this.svg
      .selectAll(".line")
      .data(this.data.links)
      .enter()
      .append("line")
      .attr("class", "line")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    this.update();
  }

  update() {
    console.log("Update called");
    const nodes = this.data.nodes; // Neuen Block hinzufügen

    this.lines
      .attr("x1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        console.log("Source Node:", sourceNode);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr("y1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        console.log("Source Node:", sourceNode);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr("x2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.target);
        console.log("Target Node:", targetNode);
        return targetNode ? targetNode.x : 0;
      })
      .attr("y2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.target);
        console.log("Target Node:", targetNode);
        return targetNode ? targetNode.y : 0;
      });
  }

  dragStarted(event, d) {
    console.log("Drag started");
    const { nodes } = this.data;
    if (!event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(event, d) {
    console.log("Dragged");
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event, d) {
    console.log("Drag ended");
    const { nodes } = this.data;
    if (!event.active) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
}

// Beispielverwendung
const graph = new PairedForceGraph("#graph", {
  width: 600,
  height: 400,
  nodeRadius: 10,
});

// Paar 1
const greenNode1 = { x: 100, y: 100 };
const blackNode1 = { x: 200, y: 200 };
graph.addPair(greenNode1, blackNode1);

// Paar 2
const greenNode2 = { x: 300, y: 100 };
const blackNode2 = { x: 400, y: 200 };
graph.addPair(greenNode2, blackNode2);

graph.renderTo();

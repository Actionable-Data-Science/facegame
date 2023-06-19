class FaceVisualizer {
  _visualizationCanvas;
  _rect;

  constructor(width, height, faceBoundingBox = "bla") {
    this._visualizationCanvas = document.createElement("canvas");
    this._visualizationCanvas.width = width;
    this._visualizationCanvas.height = height;
    this._rect = {
      x1: 100,
      y1: 100,
      x2: 300,
      y2: 300,
    };
  }

  drawAUs() {
    const canvas = this._visualizationCanvas;
    const context = canvas.getContext("2d");

    const texts = ["Text 1", "Text 2", "Text 3"];
    const coordinates = [
      { x: 150, y: 150 },
      { x: 200, y: 200 },
      { x: 250, y: 250 },
    ];

    context.font = "12px Arial";
    context.fillStyle = "white";

    this.drawRect(context, this._rect);

    // Erstellen Sie ein D3-Force-Directed-Layout
    const simulation = d3
      .forceSimulation(coordinates)
      .force("x", d3.forceX().strength(0.1))
      .force("y", d3.forceY().strength(0.1))
      .force("collide", d3.forceCollide(12).strength(1).iterations(100))
      .stop();

    // Führen Sie das Layout für eine bestimmte Anzahl von Iterationen aus
    for (let i = 0; i < 100; i++) {
      simulation.tick();
    }

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const coord = coordinates[i];

      const x = coord.x;
      const y = coord.y;

      const textWidth = context.measureText(text).width;
      const textHeight = 12; // Höhe der Schriftart

      if (
        this.isCollisionWithRect(x, y, textWidth, textHeight) ||
        this.isCollisionWithOtherTexts(coordinates, i, x, y, textWidth)
      ) {
        continue;
      }

      this.drawText(context, text, x, y);
      this.drawLine(context, this._rect.x1, this._rect.y1, x, y);
    }

    return canvas.toDataURL();
  }

  isCollisionWithRect(x, y, width, height) {
    return (
      x + width > this._rect.x1 &&
      x < this._rect.x2 &&
      y + height > this._rect.y1 &&
      y < this._rect.y2
    );
  }

  isCollisionWithOtherTexts(coordinates, currentIndex, x, y, width) {
    for (let i = 0; i < currentIndex; i++) {
      const coord = coordinates[i];
      const otherX = coord.x;
      const otherY = coord.y;

      const otherWidth = context.measureText(texts[i]).width;
      const otherHeight = 12; // Höhe der Schriftart

      if (
        this.isCollision(
          x,
          y,
          width,
          12,
          otherX,
          otherY,
          otherWidth,
          otherHeight
        )
      ) {
        return true;
      }
    }

    return false;
  }

  isCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  drawRect(context, rect) {
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
  }

  drawText(context, text, x, y) {
    context.fillText(text, x, y);
  }

  drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.stroke();
  }
}

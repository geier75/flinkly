import { useEffect, useRef } from "react";

/**
 * 🏎️ F1-RACE-START ANIMATION
 * 
 * Animiertes Canvas mit:
 * - Digitale F1-Autos an der Startlinie
 * - 5 rote Lichter → alle aus → Grün
 * - Loop-fähig (10-15 Sekunden)
 * - Geschwindigkeits-Effekte (Motion-Blur, Zoom)
 */
export default function F1RaceStart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationFrame: number;
    let time = 0;

    // Animation states
    let lightsOn = 0; // 0-5 (number of red lights on)
    let lightsPhase = "building"; // "building" | "waiting" | "go"
    let carsMoving = false;
    let carPosition = 0;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = "rgba(15, 23, 42, 0.3)"; // Dark blue overlay
      ctx.fillRect(0, 0, width, height);

      // Draw grid/track
      drawTrack(ctx, width, height);

      // Draw F1 start lights
      drawStartLights(ctx, width, height, lightsOn, lightsPhase);

      // Draw cars
      drawCars(ctx, width, height, carPosition, carsMoving);

      // Update animation state
      time += 0.016; // ~60fps

      // Light sequence
      if (lightsPhase === "building") {
        if (time > lightsOn * 0.5 && lightsOn < 5) {
          lightsOn++;
        }
        if (lightsOn === 5 && time > 3) {
          lightsPhase = "waiting";
          time = 0;
        }
      } else if (lightsPhase === "waiting") {
        if (time > 1 + Math.random() * 2) { // Random delay 1-3s
          lightsPhase = "go";
          lightsOn = 0;
          carsMoving = true;
          time = 0;
        }
      } else if (lightsPhase === "go") {
        carPosition += 5; // Speed
        if (carPosition > width + 200) {
          // Reset animation
          lightsPhase = "building";
          lightsOn = 0;
          carsMoving = false;
          carPosition = 0;
          time = 0;
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

// Helper functions
function drawTrack(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Track lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;

  // Horizontal lines
  for (let i = 0; i < 5; i++) {
    const y = height * 0.3 + i * (height * 0.4 / 4);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Start line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.3);
  ctx.lineTo(width * 0.2, height * 0.7);
  ctx.stroke();

  // Checkered pattern on start line
  const checkSize = 20;
  for (let i = 0; i < (height * 0.4) / checkSize; i++) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(width * 0.2 - 10, height * 0.3 + i * checkSize, 20, checkSize);
  }
}

function drawStartLights(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightsOn: number,
  phase: string
) {
  const lightSize = 30;
  const spacing = 50;
  const startX = width / 2 - (5 * spacing) / 2;
  const startY = height * 0.15;

  // Light panel background
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(startX - 20, startY - 20, 5 * spacing + 20, lightSize + 40);

  // Draw 5 lights
  for (let i = 0; i < 5; i++) {
    const x = startX + i * spacing;
    const y = startY;

    // Light glow
    if (phase === "building" && i < lightsOn) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, lightSize * 2);
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - lightSize * 2, y - lightSize * 2, lightSize * 4, lightSize * 4);
    }

    // Light circle
    ctx.beginPath();
    ctx.arc(x, y, lightSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = phase === "building" && i < lightsOn ? "#ff0000" : "rgba(100, 0, 0, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Green light (GO!)
  if (phase === "go") {
    const greenX = width / 2;
    const greenY = startY;

    // Green glow
    const gradient = ctx.createRadialGradient(greenX, greenY, 0, greenX, greenY, lightSize * 3);
    gradient.addColorStop(0, "rgba(0, 255, 0, 0.8)");
    gradient.addColorStop(1, "rgba(0, 255, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(greenX - lightSize * 3, greenY - lightSize * 3, lightSize * 6, lightSize * 6);

    // Green circle
    ctx.beginPath();
    ctx.arc(greenX, greenY, lightSize, 0, Math.PI * 2);
    ctx.fillStyle = "#00ff00";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // "GO!" text
    ctx.fillStyle = "#00ff00";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GO!", greenX, greenY + lightSize * 3);
  }
}

function drawCars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  position: number,
  moving: boolean
) {
  const carWidth = 80;
  const carHeight = 40;
  const lanes = 4;

  for (let i = 0; i < lanes; i++) {
    const x = width * 0.2 - carWidth - 20 + (moving ? position : 0);
    const y = height * 0.35 + i * (height * 0.3 / lanes);

    // Motion blur when moving
    if (moving) {
      ctx.fillStyle = `rgba(139, 92, 246, ${0.3 - position / width})`;
      for (let j = 0; j < 5; j++) {
        ctx.fillRect(x - j * 10, y, carWidth, carHeight);
      }
    }

    // Car body
    ctx.fillStyle = i % 2 === 0 ? "#8B5CF6" : "#4ECDC4";
    ctx.fillRect(x, y, carWidth, carHeight);

    // Car details
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(x + 10, y + 5, 20, 30); // Cockpit
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x + 5, y + 10, 10, 20); // Front wing
    ctx.fillRect(x + carWidth - 15, y + 10, 10, 20); // Rear wing

    // Wheels
    ctx.fillStyle = "#000";
    ctx.fillRect(x + 15, y - 5, 10, 10);
    ctx.fillRect(x + 15, y + carHeight - 5, 10, 10);
    ctx.fillRect(x + carWidth - 25, y - 5, 10, 10);
    ctx.fillRect(x + carWidth - 25, y + carHeight - 5, 10, 10);

    // Number
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}`, x + carWidth / 2, y + carHeight / 2 + 7);
  }
}

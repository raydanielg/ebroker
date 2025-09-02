import React, { useEffect, useRef, useState } from "react";
import { formatPriceAbbreviated } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext";

const SemiDonutChart = ({ data, colors, totalEmiData, stroke }) => {
  const t = useTranslation();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    const total = data.reduce((prev, d) => prev + d.value, 0);

    // Store segment data for hover detection
    const segments = [];

    const paintCanvas = () => {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      // Set canvas width and height
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      const halfWidth = width * 0.5;
      const center = { x: width * 0.5, y: halfWidth };
      const radius = halfWidth - 30;
      const strokeWidth = stroke || 50; // Ensure stroke has a default value

      const pi = Math.PI;
      let startAngle = pi; // Start from 180 degrees (left side)

      // Clear segments for new calculation
      segments.length = 0;

      // Draw the semi-donut segments
      for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const sweepAngle = (entry.value / total) * pi; // Semi-circle is PI radians
        const midAngle = startAngle + sweepAngle / 2;

        // Calculate point for tooltip positioning - on the arc at the middle of the segment
        const tooltipX = center.x + Math.cos(midAngle) * radius;
        const tooltipY = center.y + Math.sin(midAngle) * radius;

        // Store segment data for hover detection
        segments.push({
          startAngle,
          endAngle: startAngle + sweepAngle,
          color: colors[i % colors.length],
          data: entry,
          tooltipX,
          tooltipY,
        });

        ctx.beginPath();
        ctx.arc(
          center.x,
          center.y,
          radius,
          startAngle,
          startAngle + sweepAngle,
        );
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineCap = "butt";
        ctx.lineWidth = strokeWidth;
        ctx.stroke();

        startAngle += sweepAngle;
      }
    };

    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const width = canvasRef.current.clientWidth;
      const halfWidth = width * 0.5;
      const center = { x: width * 0.5, y: halfWidth };
      const radius = halfWidth - 30;

      // Calculate distance from center
      const dist = Math.sqrt(
        Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2),
      );

      // Check if point is within the donut stroke area (considering stroke width)
      const strokeWidth = stroke || 50;
      const innerRadius = radius - strokeWidth / 2;
      const outerRadius = radius + strokeWidth / 2;

      if (dist >= innerRadius && dist <= outerRadius) {
        // Calculate the angle between mouse position and center of semi-donut
        let angle = Math.atan2(y - center.y, x - center.x);

        // Convert to range [0, 2PI] for easier comparison
        if (angle < 0) angle += 2 * Math.PI;

        // Check if point is within the semi-donut's range (upper half)
        if (angle <= Math.PI * 2 && angle >= Math.PI) {
          // Find which segment the angle belongs to
          for (const segment of segments) {
            if (angle >= segment.startAngle && angle <= segment.endAngle) {
              // Found the segment under the mouse
              const containerRect =
                containerRef.current.getBoundingClientRect();

              setHoveredData({
                tooltipX: segment.tooltipX,
                tooltipY: segment.tooltipY,
                containerLeft: containerRect.left,
                containerTop: containerRect.top,
                label: segment.data.name || segment.data.label || "Value",
                value: segment.data.value,
                color: segment.color,
              });
              return;
            }
          }
        }
      }

      // No segment found under cursor
      setHoveredData(null);
    };

    const handleMouseLeave = () => {
      setHoveredData(null);
    };

    // Initial paint
    paintCanvas();

    // Add event listeners
    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Handle window resize
    const handleResize = () => {
      paintCanvas();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [data, colors, stroke]);

  // Format the total amount with proper currency symbol
  const formattedAmount = totalEmiData?.total_amount
    ? `${formatPriceAbbreviated(totalEmiData.total_amount)}`
    : "$0.00";

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-[2/1] h-auto w-full max-w-sm"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Center text overlay */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/4 flex-col items-center justify-center text-center">
        <p className="font-medium text-gray-700">
          {t("totalAmount") || "Total Amount"}
        </p>
        <span className="text-2xl font-bold">{formattedAmount}</span>
      </div>

      {/* Tooltip for hover - positioned relative to the segment */}
      {hoveredData && (
        <div
          className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full transform rounded-md bg-white p-2 text-sm shadow-lg`}
          style={{
            top: hoveredData.tooltipY - 25,
            left: hoveredData.tooltipX,
          }}
        >
          <div className="mb-1 flex w-full items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: hoveredData.color }}
            ></div>
            <p className="text-nowrap font-semibold">{hoveredData.label}</p>
          </div>
          <p className="font-medium">
            {formatPriceAbbreviated(hoveredData.value)}
          </p>
        </div>
      )}
    </div>
  );
};

export default SemiDonutChart;

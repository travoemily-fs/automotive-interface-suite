// gauge calculation utilities
export interface GaugeCalculation {
  angle: number; // current needle angle in degrees
  percentage: number; // value as percentage of range
  x: number; // needle tip x coordinate
  y: number; // needle tip y coordinate
  isWarning: boolean; // true IF in warning range
  isDanger: boolean; // true IF in danger range
}

export function calculateGaugePosition(
  value: number,
  min: number,
  max: number,
  startAngle: number = -120, // starting angle in degrees
  endAngle: number = 120, // ending angle in degrees
  centerX: number = 0, // center x coordinate
  centerY: number = 0, // center y coordinate
  radius: number = 100, // needle length
  warningThreshold?: number,
  dangerThreshold?: number,
): GaugeCalculation {
  // clamps value to the min/max range
  const clampedValue = Math.max(min, Math.min(max, value));

  // calculates percentage of range
  const percentage = (clampedValue - min) / (max - min);

  // calculates angle based on percentage
  const totalAngle = endAngle - startAngle;
  const angle = startAngle + percentage * totalAngle;

  // converts to radians for trig
  const radians = (angle * Math.PI) / 180;

  // calculates needle tip position
  const isWarning = warningThreshold ? clampedValue >= warningThreshold : false;
  const isDanger = dangerThreshold ? clampedValue >= dangerThreshold : false;

  // fix added to satisfy errors arising from no 'y' or 'x' values created
  const x = centerX + Math.cos(radians) * radius;
  const y = centerY + Math.sin(radians) * radius;

  return {
    angle,
    percentage,
    x,
    y,
    isWarning,
    isDanger,
  };
}

export function generateGaugePath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  strokeWidth: number = 10,
): string {
  const startRadians = (startAngle * Math.PI) / 180;
  const endRadians = (endAngle * Math.PI) / 180;

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const startX = centerX + Math.cos(startRadians) * radius;
  const startY = centerY + Math.sin(startRadians) * radius;

  const endX = centerX + Math.cos(endRadians) * radius;
  const endY = centerY + Math.sin(endRadians) * radius;

  return `
    M 
    ${startX}
    ${startY}
    A
    ${radius}
    ${radius}
    0
    ${largeArcFlag}
    1 
    ${endX}
    ${endY}`;
}

export function formatSpeed(speed: number): string {
  return Math.round(speed).toString();
}

export function formatRPM(rpm: number): string {
  // problematic line, fixed by adding math rounding method and removing toFixed in exchange for to string. no more decimals in our display! 
  return Math.round(rpm / 1000).toString();
}

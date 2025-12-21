// import needed dependencies
import React from "react";

import LightIcon from "../../assets/icons/light.svg";
import LeftIcon from "../../assets/icons/circle_chev_left.svg";
import RightIcon from "../../assets/icons/circle_chev_right.svg";
import WarningIcon from "../../assets/icons/warning.svg";

type IconName = "light" | "left" | "right" | "warning";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({
  name,
  size = 18,
  color = "currentColor",
}: IconProps) {
  const props = {
    width: size,
    height: size,
    fill: color,
    stroke: color,
  };

  switch (name) {
    case "light":
      return <LightIcon {...props} />;
    case "left":
      return <LeftIcon {...props} />;
    case "right":
      return <RightIcon {...props} />;
    case "warning":
      return <WarningIcon {...props} />;
    default:
      return null;
  }
}

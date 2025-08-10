// components/Graphics/LayoutSVG.jsx
// React component version of your layout.svg for use in Board.jsx.
// Uses forwardRef so Board can directly measure the <rect> element.

import React, { forwardRef } from "react";

const LayoutSVG = forwardRef(function LayoutSVG(props, ref) {
  return (
    <svg
      ref={ref}
      width={2048}
      height={2048}
      viewBox="0 0 2048 2048"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      id="screenshot-573f3699-be59-8001-8006-9f6bab2830ef"
      {...props}
    >
      <g id="shape-573f3699-be59-8001-8006-9f6bab2830ef">
        {/* The group that contains our target measurement rect */}
        <g id="shape-573f3699-be59-8001-8006-9f6abe0e40f0">
          <rect
            x={528}
            y={396}
            width={770}
            height={770}
            style={{
              fill: "transparent", // invisible in UI
              fillOpacity: 0,
            }}
          />
        </g>
      </g>
    </svg>
  );
});

export default LayoutSVG;

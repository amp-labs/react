import React from "react";

export const CheckMarkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <circle cx="9" cy="9" r="9" fill="#BBF7D0" />
    <path
      d="M13 7L7.5 12L5 9.72727"
      stroke="#16A34A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function NavIcon(completed: boolean, pending?: boolean) {
  if (pending) {
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
      },
      React.createElement("circle", {
        cx: "9",
        cy: "9",
        r: "5",
        fill: "#FBD38D",
      }),
    );
  }
  if (completed) {
    return CheckMarkIcon;
  }
  // default to empty icon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <circle cx="9" cy="9" r="5" fill="#BFDBFE" />
    </svg>
  );
}

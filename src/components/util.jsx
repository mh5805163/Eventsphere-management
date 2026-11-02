import { cloneElement } from "react";
export function Slot({ children, ...props }) {
  return cloneElement(children, {
    ...props,
    className: [props.className, children.props.className]
      .filter(Boolean)
      .join(" "),
  });
}

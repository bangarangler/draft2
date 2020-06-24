import React, { useState, useEffect } from "react";

const HeadingStyleDropDown = (props) => {
  const onToggle = (event) => {
    let value = event.target.value;
    props.onToggle(value);
  };

  // useEffect(() => {
  //   let className = "RichEditor-styleButton";
  //   if (props.active) {
  //     className += " RichEditor-activeButton";
  //   }
  // }, [props.active]);

  return (
    <span>
      <select value={props.active} onChange={props.onToggle}>
        <option value="">Heading Levels</option>
        {props.blockTypeHeadings.map((heading) => {
          return (
            <option className="className" value={heading.style}>
              {heading.label}
            </option>
          );
        })}
      </select>
    </span>
  );
};

export default HeadingStyleDropDown;

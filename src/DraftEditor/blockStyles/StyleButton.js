import React, { useEffect } from "react";
import { EditorState, Editor, RichUtils, AtomicBlockUtils } from "draft-js";
import {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BLOCK_TYPE_HEADINGS,
  BlockStyleControls,
} from "./BlockStyles";

const StyleButton = (props) => {
  let className;
  const onToggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  useEffect(() => {
    className = "RichEditor-styleButton";
    if (props.active) {
      className += " RichEditor-activeButton";
    }
  }, [props.active]);

  return (
    <button className={className} onMouseDown={onToggle}>
      {props.label}
    </button>
  );
};

export default StyleButton;

import React, { useState } from "react";
import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import { mediaBlockRenderer } from "./entities/mediaBlockRenderer";
import basicTextStylePlugin from "./plugins/basicTextStylePlugin";
import addLinkPlugin from "./plugins/addLinkPlugin";
import createHighlightPlugin from "./plugins/highlightPlugin";
import {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls,
} from "./blockStyles/BlockStyles";
import StyleButton from "./blockStyles/BlockStyles";

const highlightPlugin = createHighlightPlugin();

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [URLValue, setURLValue] = useState("");

  const plugins = [addLinkPlugin, highlightPlugin, basicTextStylePlugin];
  const update = (editorState) => {
    setEditorState(editorState);
  };

  const toggleBlockType = (blockType) => {
    update(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      update(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onItalicClick = () => {
    update(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const onUnderlineClick = () => {
    update(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const onBoldClick = () => {
    update(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };
  const onStrikeThroughClick = () => {
    update(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  };

  const onHighlight = () => {
    console.log("running onHighlight");
    update(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  };

  const isAddingOrUpdatingLink = () => {
    const editedState = editorState;
    const contentState = editedState.getCurrentContent();
    const startKey = editedState.getSelection().getStartKey();
    const startOffset = editedState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    let url = "";
    if (linkKey !== null) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
      const updatedLink = window.prompt("Update link-", url);
      const selection = editorState.getSelection();
      if (updatedLink == null) {
        return;
      } else if (url !== updatedLink) {
        const contentWithEntity = contentState.replaceEntityData(linkKey, {
          url: updatedLink,
        });
        const newEditorState = EditorState.push(
          editorState,
          contentWithEntity,
          "create-entity"
        );
        update(RichUtils.toggleLink(newEditorState, selection, linkKey));
      }
    } else {
      onAddLink();
    }
  };

  const onAddLink = () => {
    const command = "add-link";
    const editedState = editorState;
    const selection = editedState.getSelection();
    const link = window.prompt("Paste the link -");
    if (!link) {
      update(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editedState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    update(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };

  const onURLChange = (e) => setURLValue(e.target.value);

  // const focus = () => focus();

  const onAddImage = (e) => {
    e.preventDefault();
    const editedState = editorState;
    const urlValue = window.prompt("Paste Image Link");
    const contentState = editedState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      "create-entity"
    );
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
      () => {
        setTimeout(() => 0);
      }
    );
  };

  return (
    <div>
      <button onClick={onItalicClick}>I</button>
      <button onClick={onBoldClick}>B</button>
      <button onClick={onUnderlineClick}>U</button>
      <button onClick={onStrikeThroughClick}>S</button>
      <button onClick={onHighlight}>
        <span style={{ background: "yellow" }}>H</span>
      </button>
      <button id="link_url" onClick={isAddingOrUpdatingLink}>
        LINK
      </button>
      <button onClick={onAddImage}>Photo</button>
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <Editor
        blockRendererFn={mediaBlockRenderer}
        blockStyleFn={getBlockStyle}
        editorState={editorState}
        onChange={update}
        handleKeyCommand={handleKeyCommand}
        plugins={plugins}
        //ref="editor"
      />
    </div>
  );
};

export default DraftEditor;

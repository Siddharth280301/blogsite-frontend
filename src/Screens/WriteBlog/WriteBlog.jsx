import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DraftailEditor, serialiseEditorStateToRaw } from "draftail";
import { EditorState } from "draft-js";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  BlockquoteButton,
  CodeBlockButton,
  OrderedListButton,
  UnorderedListButton,
  BoldButton,
  ItalicButton,
  UnderlineButton,
} from "@draft-js-plugins/buttons";

// Styles Imports
import "./WriteBlog.css";
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import { Link } from "react-router-dom";
import { BaseURL } from "../../environment";
import axios from "axios";

const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;
const plugins = [inlineToolbarPlugin, sideToolbarPlugin];

function WriteBlog() {
  /**
   * Component returns a rich text editor with 3 components:
   *  1) DraftailEditor (main)
   *  2) InlineToolbar (plugin)
   *  3) SideToolbar (plugin)
   *
   *  !! Requires styles imports for editor and plugins
   */

  const [blogTitle, setBlogTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [previewVisible, setPreviewVisible] = useState(false);

  const navigate = useNavigate();

  const showPreview = () => {
    const blogContent = serialiseEditorStateToRaw(editorState);
    if (blogTitle == "") alert("Please add title to your blog!");
    else if (blogContent == null) alert("Please add content to your blog!");
    else setPreviewVisible(true);
  };

  const publishBlog = () => {
    // window.confirm("Are you sure to publish blog?");

    axios
      .post(BaseURL + "/blogs", {
        title: blogTitle,
        content: serialiseEditorStateToRaw(editorState),
      })
      .then((res) => {
        console.log("Response: ", res);
        if (res.status === 200) {
          alert(res.data);
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.log("Error :", error);
      })
      .finally(() => setPreviewVisible(false));
  };

  const Toolbar = () => {
    return (
      <div className="toolbar-container">
        <div className="section-1">
          <Link to={"/home"}>
            <div className="home-link">
              <p>Blogomo</p>
            </div>
          </Link>
          <p>Draft in XYZ ABC </p>
          <p> Sav(ed/ing)</p>
        </div>
        <div className="section-2">
          <button onClick={showPreview} type="button">
            Publish
          </button>
          <p>D</p>
          <p>N</p>
          <p>P</p>
        </div>
      </div>
    );
  };

  const Preview = () => {
    return (
      <div className="preview-container">
        <div>
          Preview{" "}
          <button onClick={publishBlog} type="button">
            Publish Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="write-blog-container">
      {previewVisible && <Preview />}
      <Toolbar />
      <div>
        <textarea
          placeholder="Title"
          onChange={(e) => setBlogTitle(e.target.value)}
          className="blog-title"
          rows="5"
        />
        <DraftailEditor
          editorState={editorState}
          onChange={(newState) => setEditorState(newState)}
          placeholder="Start writing your blog..."
          plugins={plugins}
        />
        <InlineToolbar>
          {(externalProps) => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
            </div>
          )}
        </InlineToolbar>
        <SideToolbar>
          {(externalProps) => (
            <div>
              <HeadlineOneButton {...externalProps} />
              <HeadlineTwoButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
            </div>
          )}
        </SideToolbar>
      </div>
    </div>
  );
}

export default WriteBlog;

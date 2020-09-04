import React, { Component } from "react";
import ApiContext from "../ApiContext";
import Select from "react-select";
import ValidationError from "../ValidationError";

import "./AddNote.css";

export default class AddNote extends Component {
  state = {
    name: {
      value: "",
      touched: false,
    },
    content: {
      value: "",
      touched: false,
    },
    folder: {
      value: "",
      touched: false,
    },
  };

  static contextType = ApiContext;

  submitAddNoteForm = (event) => {
    event.preventDefault();
    const note = {
      name: event.target["noteName"].value,
      content: event.target["noteContent"].value,
      folderId: event.target["noteFolder"].value,
      modified: new Date(),
    };

    fetch("http://localhost:9090/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => Promise.reject(error));
        }
        return response.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folderId}`);
      })
      .catch((error) => {
        console.error("Error:", { error });
      });
  };

  updateNoteName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateNoteContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  updateNoteFolder(folder) {
    this.setState({ folder: { value: folder, touched: true } });
  }

  validateNoteName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "A name is required";
    }
  }

  validateNoteContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return "You must include a note description";
    }
  }

  validateNoteFolder() {
    const folder = this.state.folder.value;
    if (folder.length === 0) {
      return "You must choose a folder";
    }
  }

  render() {
    const nameError = this.validateNoteName();
    const contentError = this.validateNoteContent();
    const folderError = this.validateNoteFolder();

    const options = this.context.folders.map((folder) => {
      let folderList = {};
      folderList["value"] = folder.id;
      folderList["label"] = folder.name;
      return folderList;
    });
    return (
      <div className="addNote">
        <form className="addNote-form" onSubmit={this.submitAddNoteForm}>
          <fieldset>
            <legend>Add New Note</legend>
            <div className="add-note-input-set">
              <label className="add-note-title">Note Title</label>
              <br />
              <input
                type="text"
                id="noteName"
                name="noteName"
                onChange={(event) => this.updateNoteName(event.target.value)}
              />
              {this.state.name.touched && <ValidationError message={nameError} />}
            </div>
            <div className="add-note-input-set">
              <label className="add-note-description">Note Details</label>
              <textarea
                name="noteContent"
                className="noteContent"
                onChange={(event) => this.updateNoteContent(event.target.value)}
              />
              {this.state.content.touched && (
                <ValidationError message={contentError} />
              )}
            </div>
            <div className="add-note-input-set">
              <label>Choose a folder</label>
              <Select
                name="noteFolder"
                className="noteFolder"
                options={options}
                onChange={(event) => this.updateNoteFolder(event.label)}
              />
              {this.state.folder.touched && (
                <ValidationError message={folderError} />
              )}
            </div>
            <button
              type="submit"
              className="new-note-button"
              disabled={
                this.validateNoteName() ||
                this.validateNoteContent() ||
                this.validateNoteFolder()
              }
            >
              Add Folder
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}
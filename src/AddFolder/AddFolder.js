import React, { Component } from "react";
import ApiContext from "../ApiContext";
import ValidationError from "../ValidationError";
import config from "../config";

import "./AddFolder.css";

export default class AddFolder extends Component {
  state = {
    name: "",
    touched: false,
  };

  static contextType = ApiContext;

  submitAddFolderForm = (event) => {
    event.preventDefault();

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + config.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder_name: event.target["folderName"].value }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => Promise.reject(error));
        }
        return response.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.error("Error:", { error });
      });
  };

  updateName(name) {
    this.setState({ name: name, touched: true });
  }

  validateFolderName() {
    const name = this.state.name.trim();
    if (name.length === 0) {
      return "Name is required";
    }
  }

  render() {
    const nameError = this.validateFolderName();

    return (
      <div className="addFolder">
        <form className="addFolder-form" onSubmit={this.submitAddFolderForm}>
          <fieldset>
            <legend>Add New Folder</legend>
            <div className="new-folder-alignment">
              <input
                type="text"
                id="folderName"
                name="folderName"
                onChange={(event) => this.updateName(event.target.value)}
              />
              {this.state.touched && <ValidationError message={nameError} />}
              <button type="submit" className="new-note-button" disabled={this.validateFolderName()}>
                Add Folder
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
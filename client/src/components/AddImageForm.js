import React from 'react';
import { Button } from 'semantic-ui-react'

/**
* React component that generates a form where a user can upload images
* @class
*/
class AddImageForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  onImageSelect(e) {
    e.preventDefault();

    var file = e.target.files[0];

    this.props.onSelectImage(file);
  }


  handleClick(e){
    this.refs.fileUploader.click(e);
  }

  render() {
    return (
      <div className="AddImageForm">
        <input  //has to be non semantic-ui-react component to support the accept attribute
          id="file"
          type="file"
          accept='image/*'
          ref="fileUploader"
          style={{display: "none"}}
          onChange={(e) => this.onImageSelect(e)} />
        <Button
          type="submit"
          onClick={(e) => this.handleClick(e)}>submit ur own pupper</Button>
      </div>
    )
  }
}


export default AddImageForm;



  /**
  * Sends the user's image off to the server
  *
  * @param {file} name file
  * file to be uploaded
  * @method handleImageUpload
  */
/*  handleImageUpload(file) {
    var data = new FormData();
    data.append('file',file);

    fetch('/api/upload', {
      method: 'POST',
      body: data
    });

    this.setState({
      file: ''
    });
  }

  onUploadClick(e) {
    e.preventDefault();

    this.handleImageUpload(this.state.file);
  }
*/

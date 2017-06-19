import React, { Component } from 'react';
import AddImageForm from "./components/AddImageForm.js";
import CurrentImage from "./components/CurrentImage.js";
import VoteButtons from "./components/VoteButtons.js";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableVoting: true,
      user: props.user,
      newImage: ''
    }

    this.socket = props.socket;

  }

  onVoteChanged(voteKey) {
      this.socket.emit('userVote', voteKey);
      this.setState({ enableVoting: false })
    }

  componentDidMount(){
  }

  handleImage(image) {
     this.setState({newImage: image});
     //this.socket.emit("imageUpload", image)
     var data = new FormData();
     data.append('file',image);
     data.append('userId',this.state.user.id);

     fetch('/api/upload', {
       method: 'POST',
       body: data
     });
   }

  render() {
    return (
      <div className="App">
        <CurrentImage currentImageSrc={this.props.currentImageSrc} />
        <br />
        <VoteButtons
          callbackParent={(voteKey) => this.onVoteChanged(voteKey) }
          enableVoting={this.state.enableVoting} />
        <br /> <hr />
        <AddImageForm onSelectImage={(file) => this.handleImage(file)} />
      </div>
    );
  }
}

export default App;

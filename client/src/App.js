import React, { Component } from 'react';
import AddImageForm from "./components/AddImageForm.js";
import CurrentImage from "./components/CurrentImage.js";
import VoteButtons from "./components/VoteButtons.js";
import ScoreDisplay from "./components/ScoreDisplay.js";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableVoting: true,
      userId: props.user.id,
      score: props.user.score,
      currentImageSrc: ''
    }

    this.socket = props.socket;

  }

  onVoteChanged(voteKey) {
    this.socket.emit('userVote', voteKey);
    this.setState({ enableVoting: false })
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.currentImageSrc !== this.state.currentImageSrc) {
      this.setState({
        startTime: nextProps.currentImageSrc,
        enableVoting: true
      });
    }
  }

  componentDidMount(){
    this.socket.on('score', (data) => {
      this.setState({
        score: data
      });
    });
  }

  handleImage(image) {
     var data = new FormData();
     data.append('file',image);
     data.append('userId',this.state.userId);

     fetch('/api/upload', {
       method: 'POST',
       body: data
     });
   }

  render() {
    return (
      <div className="App">
        <ScoreDisplay currentScore={this.state.score} />
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

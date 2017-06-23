import React from 'react';

/**
* React component displays the current image
* @class
*/
class ScoreDisplay extends React.Component {

  render() {
    var currentScore = this.props.currentScore;
    var scoreClass = "score";

    if(currentScore === 0) {
      currentScore = "GOOSE EGG";
      scoreClass += " crap_score";
    } else if (currentScore > 50) {
      scoreClass += " amazing_score";
    }

    return (
      <div className={scoreClass}><span className="score_label">Score: </span><span className="score_data">{currentScore}</span></div>
    )
  }
}


export default ScoreDisplay;

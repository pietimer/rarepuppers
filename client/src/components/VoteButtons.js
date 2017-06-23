import React from 'react';
import { Button } from 'semantic-ui-react'

/**
* React component displays the current score
* @class
*/
class VoteButtons extends React.Component {
  //todo, probably need to toggle the buttons off before making the parent callback... not sure how to make that work
  on0Click(e) {
    this.props.callbackParent(0);
  }

  on1Click(e) {
    this.props.callbackParent(1);
  }

  on2Click(e) {
    this.props.callbackParent(2);
  }

  render() {
    var disabled = this.props.enableVoting ? '' : 'disabled';

    return (
      <div class="divVoteButtons">
        <Button disabled={disabled} key='0' content='not a pupper. :(' onClick={(e) => this.on0Click(e)} />
        <Button disabled={disabled} key='1' content='a pupper!' onClick={(e) => this.on1Click(e)} />
        <Button disabled={disabled} key='2' content='a RARE pupper! wOwOOOwOWOw' onClick={(e) => this.on2Click(e)} />
      </div>
    )
  }
}


export default VoteButtons;

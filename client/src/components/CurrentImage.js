import React from 'react';
import { Image   } from 'semantic-ui-react'


/**
* React component displays the current image
* @class
*/
class CurrentImage extends React.Component {
  render() {
    return (
      <div class="divCurrentImage">
        <Image class="imgCurrentImage" src={this.props.currentImageSrc} />
      </div>
    )
  }
}


export default CurrentImage;

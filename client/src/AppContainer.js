import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import io from 'socket.io-client';
import App from "./App";

class AppContainer extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const cookies = new Cookies();

    this.state = {
      user: '',
      currentImageSrc: ''
    }

    var userId = cookies.get('user_id');
    // Creating the socket-client instance will automatically connect to the server.
    this.socket = io('http://localhost:3000', {query: "user_id=" + userId});

  }

  componentDidMount() {
    const cookies = new Cookies();

    this.socket.on('user', (data) => {
      this.setState({
        user: data
      });

      cookies.set('user_id', data.id, { path: '/' });
    });

    this.socket.on('updateCurrentImage', (data) => {
      this.setState({
        currentImageSrc: data
      })
    })
  }

  render() {
    var userId = '';

    if(this.state.user) {
      userId = this.state.user.id;
    }


    if(userId && userId !== '' && userId !== 'undefined'){
      return(
        <CookiesProvider>
          <App user={this.state.user} socket={this.socket} currentImageSrc={this.state.currentImageSrc}/>
        </CookiesProvider>
      );
    } else {
      return (<span>Loading...
          <br/>
          user id: {userId}
        </span>);
    }
  }
}

export default withCookies(AppContainer);

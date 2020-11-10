import React from "react";
import AudioPlayer from 'react-modular-audio-player';
import './radio.css'

import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";



let iconStyle = { width: "fit-content" },
  rearrangedPlayer = [
    {
      className: "tier-top",
      style: { padding: "5px 0" },
      innerComponents: [
        {
          type: "play",
          style: iconStyle
        },
        {
          type: "volume"
        }
      ]
    },
    {
      className: "tier-bottom",
      innerComponents: [
        {
          type: "name",
          style: iconStyle
        }

      ]
    }
  ];


let audioFiles = [
  {
    src: "http://213.141.133.1:8000/stream",
    title: "The Top",
    artist: "PrioFM",
    hideTime:true
  },
  {
    src: "http://213.141.133.1:8000/stream",
    title: "prio",
    artist: "Topp",
    hideTime:true
  }
    ];

class CustomLayout extends React.Component {
 state = {
    error: null,
    loading: false,
    saving: false,
    success: false,
    userData: {},
    userVK: {},
  };
  componentDidMount() {
    this.props.fetchCart();
    this.props.handleFetchUserDetails();
  }
   handleFetchUserDetails = () => {
    this.setState({ loading: true });
    authAxios
      .get(userDetailsURL)
      .then(res => {
        this.setState({
          loading: false,
          userData: res.data.user,
          userVK: res.data.vk
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {

    const { authenticated, cart, loading,userData } = this.props;
    return (
      <div>
      {userData.last_name}
        <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>
            <Link to="/products">
              <Menu.Item header>Products</Menu.Item>
            </Link>
            <div >
             <AudioPlayer
                 audioFiles={audioFiles}
                 rearrange={rearrangedPlayer}
                 playerWidth="10rem"
                 iconSize="1.5rem"
                 fontSize="1rem"
                 sliderClass="invert-blue-grey"
                 fontColor="#bd7a00"

                              />
            </div>
            {authenticated ? (
              <React.Fragment>
                <Menu.Menu position="right">
                  <Link to="/profile">
                    <Menu.Item>Profile</Menu.Item>
                  </Link>
                  <Dropdown
                    icon="cart"
                    loading={loading}
                    text={`${cart !== null ? cart.order_items.length : 0}`}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {cart !== null ? (
                        <React.Fragment>
                          {cart.order_items.map(order_item => {
                            return (
                              <Dropdown.Item key={order_item.id}>
                                {order_item.quantity} x {order_item.item.title}
                              </Dropdown.Item>
                            );
                          })}
                          {cart.order_items.length < 1 ? (
                            <Dropdown.Item>No items in your cart</Dropdown.Item>
                          ) : null}
                          <Dropdown.Divider />

                          <Dropdown.Item
                            icon="arrow right"
                            text="Checkout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item>No items in your cart</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Menu>
              </React.Fragment>
            ) : (
              <Menu.Menu position="right">
                <Link to="/login">
                  <Menu.Item header>Login</Menu.Item>
                </Link>
                <Link to="/signup">
                  <Menu.Item header>Signup</Menu.Item>
                </Link>
              </Menu.Menu>
            )}
          </Container>
        </Menu>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 1" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 2" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 3" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Footer Header" />
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);

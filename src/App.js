import React, { Component } from 'react';
import Card from './components/Card';
import CardBody from './components/CardBody';
import CardFooter from './components/CardFooter';
import CardGroup from './components/CardGroup';
import CardHeader from './components/CardHeader';
import CardImage from './components/CardImage';
import CardText from './components/CardText';
import CardTitle from './components/CardTitle';
import Container from './components/Container';
import Row from './components/Row';
import Col from './components/Col';
import InputSwitch from './components/pro/InputSwitch';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radio: false,
      radio2: false,
      radio3: false,
      checkbox: true,
      switch: true,
      fileInput: ''
    }
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }

  handleSwitchChange() {
    this.setState({switch: !this.state.switch});
  }

  render() {
    return (
      <div className="App"> 
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Container>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Título 2 
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <CardText>
                    Texto
                  </CardText>
                  <InputSwitch checked={this.state.switch} onChange={this.handleSwitchChange} textoActivo="encendido" textoInactivo="apagado"></InputSwitch>
                </CardBody>
                <CardFooter>
                  Pie
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

      </div>
    );
  }
}

export default App;

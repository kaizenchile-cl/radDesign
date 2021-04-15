import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';

import ServicioGeneral from './ServicioGeneral';

class CardServicio extends React.Component {
  constructor(props) {
    super(props);
        
    this.irAModulo = this.irAModulo.bind(this);
  }
    
  irAModulo() {
    ReactDOM.render(<ServicioGeneral dataServicio={this.props} id="4" />, document.getElementById('servicios'));
  }

  render() {
    const color = this.props.tipo === "medicina" ? "yellow" : this.props.tipo === "industrial" ? "gray" : "pink";
    return (
      <div className="d-flex" style={{ margin:10 }}>
        <Card narrow className="fluid" style={{ width:165, backgroundColor: color }} >
          <CardImage cascade className="img-fluid" src={this.props.imagen} style={{ height:100 }}/>
          <CardBody className="align-bottom">
            <CardTitle></CardTitle>
            <CardText className="align-bottom">
              <Button block color="primary" onClick={this.irAModulo} className="align-text-middle p-1 m-15 align-bottom" style= {{ height:50 }}>{this.props.nombre}</Button>
            </CardText>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default CardServicio;
import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, Card, CardHeader, CardBody, CardImage, CardTitle, CardText , Faj, MDBBtn, MDBIcon} from 'mdbreact';
import DetalleModulo from './DetalleModulo';

class CardBarrera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activo : true
    }
    
    this.verDetalle = this.verDetalle.bind(this);
    this.eliminar = this.eliminar.bind(this);
  }  

  verDetalle(e) {
    const id = this.props.nombre;
    ReactDOM.render(<DetalleModulo base={this.props.base} id={id} dataServicio={this.props.dataServicio} infoBarreras={this.props.infoBarreras}/>, document.getElementById('servicios'));
  }

  eliminar(e) {
    this.setState({activo: false});
  }

  render() {
    let s;
    if (this.state.activo)
    {
        s =
        <div className="d-flex" style={{ margin:10 }}>
          <Card className="s-170">
            <CardHeader>
              <h4>Barrier {this.props.nombre}</h4> 
            </CardHeader>
            <CardBody className="brown lighten-2 pt-1 pb-1 white-text">
            <Input label="Type of Barrier" value={this.props.tipoBarrera}  type="text" readOnly className="white-text label-white-text"/>
              <Input label="Distance ISO-RPOI" value={this.props.distancia}  type="text" readOnly className="white-text"/>
              <Input label="Material" value={this.props.material}  type="text" readOnly className="white-text"/>
              <Input label="Thickness" value={this.props.espesor}  type="text" readOnly className="white-text"/>
              <div className="text-center mt-2 mb-2">
              <a id_barrera={this.props.id} onClick={this.eliminar}><MDBBtn tag="a" floating size="sm" className="mx-1 mb-0 btn-fb">
                <MDBIcon icon="trash" />
                </MDBBtn></a>
                <a onClick={this.verDetalle}><MDBBtn tag="a" floating size="sm" className="mx-1 mb-0 btn-fb">
                <MDBIcon icon="play" />
                </MDBBtn></a>
              </div>    
            </CardBody>
          </Card>
        </div>
      ;
    }
    else {
      s = <div></div>;
    }
    return s;
  }
}

export default CardBarrera;
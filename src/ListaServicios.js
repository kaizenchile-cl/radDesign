import React from 'react';
import CardServicio from './CardServicio';
import { Container, Row, Col} from 'mdbreact';

class ListaServicios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch('ms/servicios.json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            servicios: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, servicios } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } 
    else if (!isLoaded) {
      return <div>Cargando...</div>;
    } 
    else {
      const listaServicios = servicios.map((servicio) =>
        <CardServicio key={servicio.id} id={servicio.id} nombre={servicio.nombre} imagen={servicio.imagen} activo={servicio.activo} tipo={servicio.tipo}/>
      );
      return (
        <Container>
          <Row className="d-flex" >
            {listaServicios}
          </Row>
        </Container>
      );
    }
  }
}

export default ListaServicios;
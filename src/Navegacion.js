import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import ListaServicios from './ListaServicios';

class Navegacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      collapse: false,
      isWideEnough: false,
      dropdownOpen: false
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onClick(){
    this.setState({
      collapse: !this.state.collapse
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
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

  cargarServicios() {
    ReactDOM.render(
      <ListaServicios/>,
      document.getElementById('servicios')
    );
  }

  render() {
    const { error, isLoaded, servicios, collapse, isWideEnough, dropdownOpen } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } 
    else if (!isLoaded) {
      return <div>Cargando...</div>;
    } 
    else {
      const listaServiciosMedicina = servicios.map((servicio) => {
        var s;
        if (servicio.tipo === 'medicina') {
          s = <DropdownItem key={servicio.id} href="#">{servicio.nombre}</DropdownItem>;
        }
        return s;
      });
      const listaServiciosIndustrial = servicios.map((servicio) =>{
        var s;
        if (servicio.tipo === 'industrial') {
          s = <DropdownItem key={servicio.id} href="#">{servicio.nombre}</DropdownItem>;
        }
        return s;
      });
      return (
        <Container>                    
          <Navbar light expand="md" scrolling >
            <Container>
              <Row>
                <Col lg="3">
                </Col>
                <Col lg="4">
                  { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                  <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav left>
                      <NavItem>
                        <Dropdown toggle={this.toggle}>
                          <DropdownToggle nav caret>Medical Facilities</DropdownToggle>
                          <DropdownMenu>
                            {listaServiciosMedicina}
                          </DropdownMenu>
                        </Dropdown>
                      </NavItem>
                      <NavItem>
                        <Dropdown toggle={this.toggle}>
                          <DropdownToggle nav caret>Industrial Facilities</DropdownToggle>
                          <DropdownMenu>
                            {listaServiciosIndustrial}
                          </DropdownMenu>
                        </Dropdown>
                      </NavItem>
                    </NavbarNav>
                  </Collapse>
                </Col>
                <Col className="mw-100 text-align-left">
                  <h1></h1>
                </Col>
              </Row>
            </Container>
          </Navbar>
          <Row>
            <Col lg="10">
              <a onClick={this.cargarServicios}><i className="fa fa-home" aria-hidden="true"></i>&nbsp;</a>&nbsp;<i className="fa fa-angle-right" aria-hidden="true"></i>&nbsp;<span id="lblNombreModulo">Select your product</span>
            </Col>
            <Col lg="2">
              <a href="http://www.dosispir.cl/"><i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp;</a>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Navegacion;
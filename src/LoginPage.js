import React from 'react';
import ReactDOM from 'react-dom';
import { MDBContainer } from "mdbreact";
import Row from './components/Row';
import Col from './components/Col';
import Input from './components/Input';
import Button from './components/Button';
import Card from './components/Card';
import CardBody from './components/CardBody';
import CardHeader from './components/CardHeader';
import CardFooter from './components/CardFooter';

import Navegacion from './Navegacion';
import ListaServicios from './ListaServicios';

class LoginPage extends React.Component  {
  constructor(props) {
    super(props);
        this.state = {correo: '', clave: '', errmsg:''};

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.validarUsuario = this.validarUsuario.bind(this);
  }

  validarUsuario() {
    const validaUsuario = "http://www.dosispir.cl/srv_dosispir/public/api/validarUsuario/correo/" + this.state.correo + "/clave/" + this.state.clave;
    window.sesion = [{usuario: this.state.correo,  token: 'XXSDFFRDDSWERD223499FRFD344PFOIKF', idUsuario: 25}];
    ReactDOM.render(
      <Navegacion />,
      document.getElementById('encabezado')
    );
    ReactDOM.render(
      <ListaServicios/>,
      document.getElementById('servicios')
    );

    /*
    fetch(validaUsuario) 
      .then(res => res.json())
      .then( (resultado) => {
        if(resultado.estado) {
          window.sesion = [{usuario: this.state.correo,  token: resultado.token, idUsuario: resultado.idUsuario}];
          ReactDOM.render(
            <Navegacion />,
            document.getElementById('encabezado')
          );
          ReactDOM.render(
            <ListaServicios/>,
            document.getElementById('servicios')
          );
        }
        else {
          window.sesion = [{usuario: '',  token: ''}];
          alert('Usuario no válido');
        }
      });
  */
  }
  
  submitHandler (event) {
    event.preventDefault();
    event.target.className += ' was-validated';
    this.validarUsuario();
   }

  changeHandler (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return(
      <MDBContainer>
        <form className='needs-validation' onSubmit={this.submitHandler} noValidate>
          <section className="form-elegant">
            <Row>
              <Col md="5" className="mt-5">
                <Card>
                  <CardHeader>
                    <div className="text-center">
                      <h3 className="dark-grey-text mb-5"><strong>Login DosisPIR</strong></h3>
                      <p>Use usuario/clave: demo/demo</p>
                    </div>
                  </CardHeader>
                  <CardBody className="mx-4">
                    <Col xs="12">
                    <Input label="Email" icon="envelope" group value={this.state.correo}  onChange={this.changeHandler} type="email" name="correo" validate required />
                    <Input label="Password" icon="lock" group value={this.state.clave} onChange={this.changeHandler}  type="password" name="clave" validate required />
                    <div className="text-center mb-3">
                      <Button type="submit" gradient="blue" rounded className="btn-block z-depth-1a">Login</Button>
                    </div>
                    </Col>
                  </CardBody> 
                  <CardFooter>
                    <p className="font-small grey-text d-flex justify-content-end"><a href="#" className="blue-text ml-1"> Register here</a></p>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </section>
        </form>
     </MDBContainer>
    );
  }
};

export default LoginPage;
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { 
  MDBContainer
  , MDBIcon 
  , MDBRow
  , MDBCol
  , MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBBtn
} from "mdbreact";
import Container from './components/Container';
import Row from './components/Row';
import Col from './components/Col';
import Input from './components/Input';
import Button from './components/Button';
import Modal from './components/Modal';
import ModalHeader from './components/ModalHeader';
import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import Fa from './components/Fa';
import ListaBarreras from './ListaBarreras';
import Card from './components/Card';
import CardHeader from './components/CardHeader';
import CardBody from './components/CardBody';

class ServicioGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      datosGuardados: false,
      isLoaded: false,
      items: [],
      modal: true,
      datoProyecto: {},
      valoresCalculados: [],
      entradaValores: [],
      salidaValores: [],
      salidaValoresDinamicos: []
    };
    window.baseDato = {};
 
    this.manejadorData = this.manejadorData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.estadoProyecto = this.estadoProyecto.bind(this);
    this.guardarDatos = this.guardarDatos.bind(this);
    this.parseValor = this.parseValor.bind(this);
  }

  parseValor(expresion, origen) {
    let f = expresion, fFinal = expresion;
    let m, nombreVariable;
    let reBase = new RegExp('#{([^}?]+|([^?]+)\\?([^}]+))}','g');
    let datosSuperior = window.baseDato;
    let esta = true;

     while ((m = reBase.exec(fFinal)) !== null) {
      nombreVariable = typeof m[2] === 'undefined' ? m[1] : m[2];
      if(nombreVariable in origen ) {
        if (
          origen[nombreVariable] !== null 
          && typeof(origen[nombreVariable]) !== 'undefined' 
          && origen[nombreVariable] !== 'Faltan Datos' 
          && origen[nombreVariable].toString().trim() !== ''
        ) {
          f = f.replace(m[0], origen[nombreVariable]);
        }
        else if(m[3] != null ) {
          f = f.replace(m[0], m[3]);
        }
        else {
          esta = false;
          break;
        }
      }
      else if(
        datosSuperior !== null 
        && nombreVariable in datosSuperior 
        && datosSuperior[nombreVariable] !== null 
        && typeof(datosSuperior[nombreVariable]) !== 'undefined' 
        && datosSuperior[nombreVariable].toString().trim !== ''
      ) {
        f = f.replace(m[0], datosSuperior[nombreVariable]);
      }
      else if(m[3] != null ) {
        f = f.replace(m[0], m[3]);
      }
      else {
        esta = false;
        break;
      }
    }
    return esta ? f : null;
  }

  estadoProyecto(e) {
    const grupo = e.target.getAttribute('grupo');
    const datoProyecto = JSON.parse(JSON.stringify(this.state.datoProyecto));
    datoProyecto[grupo] = e.target.value;
    this.setState({datoProyecto: datoProyecto});
  }
  
  guardarDatos() {

  }

  toggleModal () {
    if(this.state.modal) {
      this.guardarDatos();
    }
    this.setState({
      modal: !this.state.modal
    });
  }

  manejadorData(event) {
    const {datos} = this.state;
    let grupo = event.target.getAttribute('grupo');
    let cambiarAsignacion = false;
    datos.forEach(function(dato) {
      if ( 
        dato.nombre === grupo 
        && dato.tipo === 'seleccionSimple' 
        && !('asignado' in dato)
        ) {
        cambiarAsignacion = true;
      }

      if(
        dato.nombre !== grupo 
        && ('asignado' in dato)
        && !('recalcula' in dato)
        && !dato['recalcula']
      ) {
        dato.asignado = false;
      }
    });

    let baseDato =  JSON.parse(JSON.stringify(window.baseDato));
    this.setState({[grupo]: event.target.value});
    baseDato[grupo] = event.target.value; 
    window.baseDato = baseDato;
  }
      
  componentDidMount() {
    if( 'estado' in this.props) {
      let key;
      let nombre, valor;
      for (key in this.props.estado.datos) {
        nombre = this.props.estado.datos[key].nombre;
        valor =  this.props.estado[this.props.estado.datos[key].nombre];
        this.setState({[nombre]: valor});
        window.baseDato[nombre] = valor;
      } 
      this.setState({modal: false});
    }

    const datosProyecto = "http://www.ingefisic.cl/srv_ingefisic/public/api/proyectos/" + this.props.id;
    fetch(datosProyecto) 
      .then(res => res.json())
      .then(
        (result) => {
          const datosProyecto = {
            nombreInstitucion: result.nombre_empresa,
            proyecto: result.nombre_proyecto,
            calculista: result.nombre_calculista,
            direccion: result.direccion
          };
          this.setState({datoProyecto: datosProyecto});
        }
      );

    const datosModulo = 'ms/datosModulo_' + this.props.dataServicio.id + '.json';
    fetch(datosModulo)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            datos: result
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
    const { error, isLoaded, datos } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } 
    else if (!isLoaded) {
      return <div>Cargando...</div>;
    } 
    else {
      const datosRequeridos = datos.map((dato) => {
        var s = null;

let rDep = true;
  
if ("dependencia" in dato) {
  const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
  const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
  const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));

  const dependencia = this.parseValor(
    dato.dependencia
    , { 
      ...datosEntrada
      , ...datosSalida
      , ...datosSalidaDinamicos
      , ...window.baseDato 
    }
  );
  rDep = eval(dependencia);
}

if (rDep) {
  if(dato.tipo === 'date') {
/*      s =
        <MuiThemeProvider>
          <div className="datepicker-wrapper">
            <DatePicker id="datepicker" hintText={dato.etiqueta} ></DatePicker>
          </div>
        </MuiThemeProvider>;
*/
    }
    else if (dato.tipo === 'numeric') {
      let valor = (dato.nombre in this.state) ? this.state[dato.nombre].toString() : null;
      if(
        "asignado" in dato && !dato.asignado || 
        (valor == null || valor != null && valor.trim() == "") 
        && "defecto" in dato && dato.defecto.trim() != ""
        && (!("asignado" in dato) || "asignado" in dato && !dato.asignado) 
      ) {
        const datosEntradaValor = JSON.parse(JSON.stringify(this.state.entradaValores));
        const datosSalidaValor = JSON.parse(JSON.stringify(this.state.salidaValores));
        const datosSalidaDinamicosValor = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));
      
        valor = this.parseValor(
          dato.defecto
          , {
            ...datosEntradaValor
            , ...datosSalidaValor
            , ...datosSalidaDinamicosValor
            , ...window.baseDato
          }
        );
        valor = eval(valor);
        window.baseDato[dato.nombre] = valor;
        dato['asignado'] = true;
        this.state[dato.nombre] = valor;
      }
    s = 
        <MDBContainer> 
          <MDBRow>
            <MDBCol size="12">
              <Input 
                label={dato.etiqueta} 
                className="valorObligatorio" 
                grupo={dato.nombre} type="number" 
                value={valor} 
                onChange={this.manejadorData} 
                min={dato.minimo} max={dato.maximo} 
                step={dato.paso} 
                error={dato.error} 
                success={dato.correcto}
                validate/>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    }
    else if (dato.tipo === 'file') {
      s =
        <div key={dato.nombre} className="file-field">
          <a className="btn-floating peach-gradient mt-0 float-left">
            <i className="fa fa-paperclip" aria-hidden="true"></i>
            <input type="file" nombreArchivo={dato.nombre} />
          </a>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder={dato.etiqueta} />
          </div>
        </div>;
    }
    else if (dato.tipo === 'seleccionSimple') {
      s = dato.origen.map ((registro) => {
        let elemento;
        let resultadoDependencia = true;

        if ("dependencia" in registro) {
          const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
          const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
          const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));

          const dependencia = this.parseValor(registro.dependencia, {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos});
          resultadoDependencia = eval(dependencia);
        }
        if(resultadoDependencia) {
          elemento =
            <Input 
              onChange={this.manejadorData} 
              checked={this.state[dato.nombre] === registro.id ? true : false} 
              label={registro.nombre} value={registro.id} 
              type="radio" id={dato.nombre + '_' + registro.id} 
              key={dato.nombre + '_' + registro.id}
              grupo={dato.nombre}
            />;
          return elemento;  
        }
    });
    s =
      <div>
        <h6 className="mb-4">{dato.etiqueta}</h6>
        {s}
      </div>;
  }
  else {
    s =
      <Input label={dato.etiqueta}  type={dato.tipo} validate error={dato.error} success={dato.correcto}/>;
  }
  s=
  <Col key={dato.nombre} xs="12" lg="2" className="d-fluid">
        <MDBPopover
          placement="top"
          popover
          clickable
          id="popper1"
        >
        <MDBBtn tag="a" size="sm" flat>
          <MDBIcon icon="question-circle" />
        </MDBBtn>
         <div>
            <MDBPopoverHeader>{dato.etiqueta}</MDBPopoverHeader>
            <MDBPopoverBody>
              {dato.ayuda}
            </MDBPopoverBody>
          </div>
        </MDBPopover>
    {s}
  </Col>;
}
return s;
});
      return (
        <Container>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Project</ModalHeader>
            <ModalBody>
              <Input grupo="nombreInstitucion" value={this.state.datoProyecto.nombreInstitucion} label="Organization" validate onChange={this.estadoProyecto} />
              <Input grupo="proyecto" value={this.state.datoProyecto.proyecto} label="Project" validate onChange={this.estadoProyecto} />
              <Input grupo="calculista" value={this.state.datoProyecto.calculista} label="Calculist" validate onChange={this.estadoProyecto} />
              <Input grupo="direccion" value={this.state.datoProyecto.direccion} label="Address" validate onChange={this.estadoProyecto} />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleModal}>Save</Button>
            </ModalFooter>
          </Modal>
          <form className="md-form">
            <Row>
                {datosRequeridos}
            </Row>
          </form>
          <Row>
            <Col xs="12">
              <ListaBarreras dataServicio={this.props.dataServicio} base={this} infoBarreras={this.props.infoBarreras}/>
            </Col>
          </Row>
          <Row>
            <Col>
            &nbsp;
            </Col>
          </Row>
          <Row>
            <Col xs="12" mt="5">
              <Card mt="3">
                <CardHeader>Project Information</CardHeader>
                <CardBody>
                  <Row>
                      <Col xs="12" sm="6">
                        <Input value={this.state.datoProyecto.nombreInstitucion} label="Organization" disabled/>{' '}
                      </Col>
                      <Col xs="12" sm="6">
                        <Input value={this.state.datoProyecto.calculista} label="Calculist" validate disabled/>
                      </Col>
                      <Col xs="12">
                        <Input value={this.state.datoProyecto.proyecto} label="Project" validate disabled/>{' '}
                      </Col>
                      <Col xs="11">
                        <Input value={this.state.datoProyecto.direccion} label="Address" validate disabled/>{' '}
                      </Col>
                     <Col xs="1">
                        <Button onClick={this.toggleModal} tag="a" floating gradient="blue"><Fa icon="edit" /></Button>
                      </Col>
                    </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
  } 
}

export default ServicioGeneral;
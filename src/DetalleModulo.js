import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Row, Col, Input, Button, Card, CardBody, View} from 'mdbreact';
import { 
  MDBContainer
  , MDBIcon 
  , MDBRow
  , MDBCol
  , MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBBtn
} from "mdbreact";
import Fa from './components/Fa';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import DatePicker from 'material-ui/DatePicker';
import ServicioGeneral from './ServicioGeneral';

class DetalleModulo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      isLoadedSalida: false,
      entradaDefinicion: [],
      salidaDefinicion: [],
      tablas: {},
      entradaValores: {},
      salidaValores: {},
      salidaValoresDinamicos: {}
    }; 

    this.manejadorEntrada = this.manejadorEntrada.bind(this);
    this.buscaTabla = this.buscaTabla.bind(this);
    this.parseValor = this.parseValor.bind(this);
    this.volver = this.volver.bind(this);
    this.guardar = this.guardar.bind(this);
    this.ejecutaTablaDinamica = this.ejecutaTablaDinamica.bind(this);
  }

  volver(e){
      const id = this.props.id;
      const barreras = this.props.infoBarreras;
      let barreraEncontrada = false;
      let idBarrera;

      for (idBarrera in barreras) 
      {
        if(barreras[idBarrera].nombre == id) 
        {
          barreraEncontrada = true;
          break;
        }
      }
      
      if (barreraEncontrada) {
        const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
        const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
        const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));
        const datosGenerales = JSON.parse(JSON.stringify(window.baseDato));
        const dataGeneral = {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos, ...datosGenerales}
        const tipoBarrera = this.parseValor("#{_nombreTipoBarrera}", dataGeneral);
        const materialBarrera = this.parseValor("#{_materialBarrera}", dataGeneral);
        const espesorBarrera = this.parseValor("#{_espesorBarrera}", dataGeneral);
        const distanciaBarrera = this.parseValor("#{_distanciaBarrera}", dataGeneral);
        barreras[idBarrera] = {
          ...barreras[idBarrera]
          , ...{
              "tipoBarrera" : tipoBarrera
              , "material" : materialBarrera
              , "espesor" : espesorBarrera
              , "distancia" : distanciaBarrera
              , "entrada" : this.state.entradaValores
              , "salida" : this.state.salidaValores
          }
        };
      }

      ReactDOM.render(<ServicioGeneral dataServicio={this.props.dataServicio} id="4" estado={this.props.base.state} infoBarreras={barreras}/>, document.getElementById('servicios'));
  }

  buscaTabla(dato, origen) {
    const tabla = dato.expresion.tabla;
    const valor = dato.expresion.valor;
    const filtro = dato.expresion.filtro;
    let registroEncontrado;

    const filtroActualizado = filtro.map((dato) => {
      const campo = dato.campo;
      const valor = this.parseValor(dato.valor, origen);
      const item = {'campo': campo, 'valor': valor};
      return(item);
    });

    this.state.tablas[tabla].map((registro) => {
      let encontrado = true;
      filtroActualizado.map((dato) => {
        encontrado = encontrado && (registro[dato.campo] == dato.valor);
        return dato;
      });
      if(encontrado) {
        registroEncontrado = registro;
      }
      return registro;
    });
    if(typeof registroEncontrado !== 'undefined' && registroEncontrado !== null) {
      return( registroEncontrado[valor] );
    }
    else {
      return null;
    }
  }
  
  guardar() {
    const id = this.props.base.props.id;
    let proyecto;
    const datosProyecto = "http://www.ingefisic.cl/srv_ingefisic/public/api/proyectos/" + id;
    let barreraEncontrada = [];
    const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
    const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));

    fetch(datosProyecto) 
      .then(res => res.json())
      .then(
        (result) => {
           proyecto = result;
           const valoresCalculados = JSON.parse(proyecto.valores_calculados);
           const barreras = valoresCalculados.barreras;
           let otrasBarreras = [];
           let idBarrera;
           let idBarreraEncontrada;

           for (idBarrera in barreras) {
             const barrera = barreras[idBarrera];
             if(barrera.nombre == this.props.id) {
              barreraEncontrada = barrera;
              idBarreraEncontrada = idBarrera;
            }
            else {
              otrasBarreras[idBarrera] = barrera;
            }
           }

           barreraEncontrada['entradas'] = datosEntrada;
           barreraEncontrada['salidas'] = datosSalida;

           otrasBarreras[idBarreraEncontrada] = barreraEncontrada;

           const data = {
             id: id
             , valores_calculados: JSON.stringify({
              'general' : window.baseDato
              , 'barreras' : otrasBarreras
             })
           };
       
           fetch('http://www.ingefisic.cl/srv_ingefisic/public/api/proyectos/' + id, {
             credentials: 'same-origin',
             method: 'PUT', 
             body: JSON.stringify(data),
             headers: new Headers({
               'Content-Type': 'application/json'
             }),
           })
             .then(res => res.json())
             .then(
               (result) => {
               }
               , (error) => {
               }
             );
       
          }
      );
  }

  manejadorEntrada(event) {
    let r, resultado, datoEncontrado;
    let registro;
    let grupo = event.target.getAttribute('grupo');
    let datosDinamicos = [];
    const salidas = this.state.salidaDefinicion;
    const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
    const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
    const datosGenerales = JSON.parse(JSON.stringify(window.baseDato));
    const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));
 
    datosEntrada[grupo] = event.target.value;

    datoEncontrado = null;
    salidas.map((dato) => {
      switch(dato.expresion.tipo) {
      case 'formula':
        resultado = this.parseValor(dato.expresion.texto, {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos, ...datosGenerales});
        if(resultado !== null) {
          r = eval(resultado);
        }
        else {
          r = 'Faltan Datos';
        }
        datosSalida[dato.nombre] = r;
        break;
      case 'tabla':
        datoEncontrado = this.buscaTabla(dato, {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos, ...datosGenerales});
        if(datoEncontrado !== null) {
          datosSalida[dato.nombre] = datoEncontrado;
        }
        break;
      case 'tablaDinamica':
        datosDinamicos.push(dato);
      }
      return dato;
    });
    this.setState(
      {entradaValores: datosEntrada, salidaValores: datosSalida}
      , function() {
        datosDinamicos.map((dato) => {
          this.ejecutaTablaDinamica(dato);
        });
      }
    );
  }

  ejecutaTablaDinamica(dato) {
    const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
    const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
    const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));
    const datosGenerales = JSON.parse(JSON.stringify(window.baseDato));

    const tabla = dato.expresion.tabla;
    const dataGeneral = {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos, ...datosGenerales}
    let nuevaTabla = this.parseValor(tabla, dataGeneral);
    if (nuevaTabla != null) {
      nuevaTabla = nuevaTabla.replace(',', '.');
      fetch(nuevaTabla)
      .then(res => res.json())
      .then(
        (resultado) => {
          const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));
          datosSalida[dato.nombre] = resultado[dato.expresion.valor];
          this.setState({salidaValoresDinamicos: datosSalida})          
        }
    );
    }
  }

  componentDidMount() {
    let tablas = [];
    const datosEntradaModulo = 'ms/datosEntradaModulo_' + this.props.dataServicio.id + '.json';
    const datosSalida = 'ms/datosSalidaModulo_' +  this.props.dataServicio.id + '.json';
    const datosProyecto = "http://www.ingefisic.cl/srv_ingefisic/public/api/proyectos/" + this.props.base.props.id;

    if("infoBarreras" in this.props) {
      const id = this.props.id;
      const barreras = this.props.infoBarreras;
      let barreraEncontrada = false;
      let idBarrera;

      for (idBarrera in barreras) 
      {
        if(barreras[idBarrera].nombre == id) 
        {
          barreraEncontrada = true;
          break;
        }
      }
      
      if (barreraEncontrada) {
        this.setState({
          entradaValores: {...this.props.infoBarreras[idBarrera].entrada}
          , salidaValores: {...this.props.infoBarreras[idBarrera].salida}
        });
      }
    }

    fetch(datosProyecto) 
      .then(res => res.json())
      .then(
        (result) => {
        }
      );
    fetch(datosEntradaModulo) 
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            estaCargadaEntrada: true,
            entradaDefinicion: result
          });
        },
        (error) => {
          this.setState({
            estaCargadaEntrada: true,
            error
          });
        }
      );

    fetch(datosSalida) 
      .then(res => res.json())
      .then(
        (rSalida) => {
          rSalida.map((datos) => {
            let tablaCompleta = '';
            if(datos.expresion.tipo === 'tabla') {
              const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
              if(re.test(datos.expresion.tabla)) {
                tablaCompleta = datos.expresion.tabla;
              }
              else {
                tablaCompleta = 'ms/' + datos.expresion.tabla + '.json';
              } 
              fetch(tablaCompleta)
                .then(res => res.json())
                .then(
                  (rTabla) => {
                    const tablas = JSON.parse(JSON.stringify(this.state.tablas));
                    tablas[datos.expresion.tabla] = rTabla;
                    this.setState({tablas: tablas});
                  },
                  (error) => {
                  }
                );
            }
          });

          this.setState({
            estaCargadaSalida: true,
            salidaDefinicion: rSalida
          });
        },
        (error) => {
          this.setState({
            estaCargadaSalida: true,
            error
          });
        }
      );
  }

  parseValor(expresion, origen) {
    let f = expresion, fFinal = expresion;
    let m, nombreVariable;
    let reBase = new RegExp('#{([^}?]+|([^?]+)\\?([^}]+))}','g');
    let datosSuperior = window.baseDato;
    let esta = true;
    let valorDefecto;

     while ((m = reBase.exec(fFinal)) !== null) {
      nombreVariable = typeof m[2] === 'undefined' ? m[1] : m[2];
      if(nombreVariable in origen)
      {
        if(origen[nombreVariable] !== null && origen[nombreVariable] !== 'Faltan Datos' && origen[nombreVariable].toString().trim() !== '') {
          f = f.replace(m[0], origen[nombreVariable]);
        }
        else if(datosSuperior !== null && nombreVariable in datosSuperior && datosSuperior[nombreVariable].toString().trim !== '') {
          f = f.replace(m[0], datosSuperior[nombreVariable]);
        }
        else if(typeof m[3] !== 'undefined' ) {
          f = f.replace(m[0], m[3]);
        }
        else {
          esta = false;
          break;
        }
      }
      else if(typeof m[3] !== 'undefined' ) {
        f = f.replace(m[0], m[3]);
      }
      else {
        esta = false;
        break;
      }
    }
    return esta ? f : null;
  }

  render() {
    const { error, estaCargadaEntrada, estaCargadaSalida, entradaDefinicion, salidaDefinicion } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } 
    else if (!estaCargadaEntrada && !estaCargadaSalida) {
      return <div>Cargando...</div>;
    }
    else {
      const datosRequeridos = entradaDefinicion.map((dato) => {
        var s = null;
        let rDep = true;
  
        if ("dependencia" in dato) {
          const datosEntrada = JSON.parse(JSON.stringify(this.state.entradaValores));
          const datosSalida = JSON.parse(JSON.stringify(this.state.salidaValores));
          const datosSalidaDinamicos = JSON.parse(JSON.stringify(this.state.salidaValoresDinamicos));

          const dependencia = this.parseValor(dato.dependencia, {...datosEntrada, ...datosSalida, ...datosSalidaDinamicos, ...window.baseDato});
          rDep = eval(dependencia);
        }

        if (rDep) {
          if(dato.tipo === 'date') {
/*
              s =
                <MuiThemeProvider>
                  <div className="datepicker-wrapper">
                    <DatePicker id="datepicker" hintText={dato.etiqueta} ></DatePicker>
                  </div>
                </MuiThemeProvider>;
          */
            }
            else if (dato.tipo === 'numeric') {
              let valor; 
              if (dato.nombre in this.state.entradaValores) 
              {
                valor = this.state.entradaValores[dato.nombre].toString();
              }
              if(
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
                  }
                );
                valor = eval(valor);
                this.state.entradaValores[dato.nombre] = valor;
                dato['asignado'] = true;
                this.state[dato.nombre] = valor;        
              }
              s =
                <Input label={dato.etiqueta} onChange={this.manejadorEntrada} value={valor} grupo={dato.nombre} type="number" min={dato.minimo} max={dato.maximo} step={dato.paso} validate error={dato.error} success={dato.correcto}/>;
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
                        onChange={this.manejadorEntrada} 
                        checked={this.state.entradaValores[dato.nombre] === registro.id ? true : false} 
                        label={registro.nombre} value={registro.id} 
                        type="radio" id={dato.nombre + '_' + registro.id} 
                        key={dato.nombre + '_' + registro.id}
                        grupo={dato.nombre}
                      />
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
                <Input label={dato.etiqueta}  type={dato.tipo} validate error={dato.error} success={dato.correcto}/>
          ;
            }
            s=
            <Col key={dato.nombre} xs="12" lg="3" className="d-fluid">
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

      const datosSalida = salidaDefinicion.map((dato) => {
        let r = '';
        let color = '';
        const cantidadCaracteres = 'cantidadCaracteres' in dato ? dato.cantidadCaracteres : 10;
        const salidaCompleta = {...this.state.salidaValores, ...this.state.salidaValoresDinamicos};
        if(dato.nombre in salidaCompleta){
          r = salidaCompleta[dato.nombre];
        }
        if(
          dato.visible
          && r !== undefined 
          && r !== null 
          && r !== '' 
          && r !== 'Faltan Datos'
        ) {
          if(dato.tipoSalida === 'resultado') {
            color = '#F7C906';
          }
            return(
              <Container key={dato.id} style={{ backgroundColor: color }}>
                <Row>
                  <Col xs="7"><small>{dato.etiqueta}:</small></Col>
                  <Col xs="5">{r.toString().substring(0, cantidadCaracteres)} <small>{dato.unidad}</small></Col>
                </Row>
              </Container>
            );
        }
      });

      return (
        <Container>
          <form className="md-form">
            <Row>
              <Col lg="8" md="7" sm="12" className="mb-4">
                <Card  narrow xs="6" className="p-3 panel-cascade">
                  <View cascade className="py-3 primary-color-dark text-white unique-color-dark justify-content-center">
                    <h5 className="mb-0">Input Data</h5>
                  </View>
                  <CardBody>
                    <Row>
                      {datosRequeridos}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" md="5" sm="12" className="mb-4 justify-content-center">
                <Card narrow xs="6" className="p-3 panel-cascade">
                  <View cascade className="py-3 primary-color-dark text-white elegant-color-dark justify-content-center">
                    <h5 className="mb-0">Results</h5>
                  </View>
                  <CardBody className="p-3">
                    <Row>
                      {datosSalida}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col className="justify-content-center">
                <Button onClick={this.volver} >Back</Button>
                <Button onClick={this.guardar} color="primary">Save</Button>
              </Col>
            </Row>
          </form>
        </Container>
      );
    }
  } 
}

export default DetalleModulo;
import React from 'react';
import Fa from './components/Fa';
import Button from './components/Button';
import ButtonFixed from './components/pro/ButtonFixed';
import Card from './components/Card';
import CardHeader from './components/CardHeader';
import CardBody from './components/CardBody';
import Modal from './components/Modal';
import ModalHeader from './components/ModalHeader';
import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import Input from './components/Input';
import Container from './components/Container';
import Row from './components/Row';
import Col from './components/Col';
import CardBarrera from './CardBarrera';

class ListaBarreras extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      modal: false,
      nombreBarrera: '',
      idBarrera: 2,
      barreras: [
      ],
      imagen: null
    };

    this.nuevaBarrera = this.nuevaBarrera.bind(this); 
    this.toggle = this.toggle.bind(this);
    this.admTipoBarrera = this.admTipoBarrera.bind(this);
    this.admNombreBarrera = this.admNombreBarrera.bind(this);
    this.admArchivoBarrera = this.admArchivoBarrera.bind(this); 
    this.guardarDatos = this.guardarDatos.bind(this);
   }

   componentDidMount() {
    if( 'infoBarreras' in this.props) {
      let key;
      let items = this.state.barreras;
      for( key in this.props.infoBarreras) {
        this.setState({idBarrera: this.state.idBarrera + 1});
        let nueva = [
          {
            id:this.state.idBarrera,
            ...this.props.infoBarreras[key]
          }
        ];
    
        items = items.concat(nueva);
      }
      this.setState({barreras: items});        
    }
   }

  admTipoBarrera(e) {
    this.setState({tipoBarrera: e});
  } 
 
  admNombreBarrera(e) {
    this.setState({nombreBarrera: e.target.value});
  }

  admArchivoBarrera(e) {
    this.setState({
      imagen: e.target.files[0]
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  nuevaBarrera(event) {
    let items;
    this.setState({idBarrera: this.state.idBarrera + 1});
    let nueva = [
      {
        id:this.state.idBarrera,
        nombre: this.state.nombreBarrera,
        tipoBarrera: this.state.tipoBarrera,
      }
    ];
    this.guardarDatos(this.state.barreras.concat(nueva));

    nueva['material'] = 'No asignado';
    nueva['espesor'] = 'No calculado';
    nueva['distancia'] = 'No asignada';

    items = this.state.barreras.concat(nueva);
    this.setState({barreras: items}); 
  }

  guardarDatos(barreras) {
    const id = this.props.base.props.id;
    let valoresCalculados = {barreras: barreras};
    valoresCalculados = JSON.stringify(valoresCalculados);
    const data = {
      id: id
      , valores_calculados: valoresCalculados
    };
    let barreraEncontrada;

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
          console.log(error);
        }
      );
  }


  render() {
    let s
    if("barreras" in this.state && this.state.barreras != null){
      s= this.state.barreras.map((barrera, idx)=>{
        return(
          <CardBarrera key={idx} datosPropios={barrera} base={this.props.base} dataServicio={this.props.dataServicio} id={barrera.id} nombre={barrera.nombre} tipoBarrera={barrera.tipoBarrera} material={barrera.material} espesor={barrera.espesor} distancia={barrera.distancia} infoBarreras={this.state.barreras} />
        );
     });
    }
    return (
      <Card>
        <CardHeader><Container><Row className="justify-content-between"><Col xs="10" className="justify-content-center"><h4>Facility Layout</h4></Col><Col xs="2" align="right"><a href={"/srv_ingefisic/public/generatedocx/" + this.props.dataServicio.id + "/" + window.sesion[0].idUsuario} target="_blank"><Fa icon="print" size="lg"/></a></Col></Row></Container> </CardHeader>
        <CardBody>
          <div className="row d-flex" >
            {s}
          </div>
          <ButtonFixed onClick={this.toggle} floating size="lg" color="red" icon="plus" style={{bottom: '45px', right: '24px'}} />
        </CardBody>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Enter Data for New Barrier</ModalHeader>
          <ModalBody>
            <form className="md-form">
              <Input label="Name" type="text" value={this.state.nombreBarrera} onChange={this.admNombreBarrera} />
              <div className="file-field">
                <a className="btn-floating peach-gradient mt-0 float-left">
                  <i className="fa fa-paperclip" aria-hidden="true"></i>
                  <input type="file" onChange={this.admArchivoBarrera} />
                </a>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" placeholder="Load Barrier Image File" />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
            <Button color="primary" onClick={this.nuevaBarrera} >Save</Button>
          </ModalFooter>
        </Modal>
      </Card>
    );
  }
}

export default ListaBarreras;
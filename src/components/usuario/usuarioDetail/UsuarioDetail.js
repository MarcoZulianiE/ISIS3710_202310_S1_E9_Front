import { Col, Container, Row, Image, Button } from "react-bootstrap";
import "./UsuarioDetail.css"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsuarioById } from "../../../helpers/backend/usuarioBackend";

function UsuarioDetail() {
    const navigate = useNavigate();

    const params = useParams();
    const token = localStorage.getItem("sessionToken");
    const [usuario, setUsuario] = useState();
    const [titulo, setTitulo] = useState();
    const [experiencia, setExperiencia] = useState();
    const [habilidades, setHabilidades] = useState();
    const [antecedentes, setAntecedentes] = useState();
    const [isCanguro, setIsCanguro] = useState(null);
    const [btnStatus, setBtnStatus] = useState(false);

    const usuarioId = params.usuarioId;
    
    useEffect(
        () =>
        async function () {
            // Get of the user with the given id
            const newUsuario = await getUsuarioById(usuarioId);
            // If inexistent user, redirect to error page        
            setUsuario(newUsuario);
            if(isCanguro === null) {
                setIsCanguro(newUsuario.tipoUsuario.toLowerCase() !== "canguro");
                console.log(isCanguro)
            }
            if(newUsuario.antecedentes.length === 0) {
                setAntecedentes(<li>El usuario no tiene antecedentes</li>)
            } else {
                setAntecedentes(newUsuario.antecedentes.map((ant) => <li>{ant.tipo}</li>))
            }
            if(isCanguro) {
                setTitulo(<h2>Especialidades:</h2>)
                setExperiencia(newUsuario.aniosExperiencia + " años de experiencia")
                if (newUsuario.especialidades.length === 0) {
                    setHabilidades(<li>El canguro no tiene especialidades</li>)
                } else {
                    setHabilidades(newUsuario.especialidades.map((nec) => <li>{nec.tipo}</li>))
                }
                setTitulo(<h2>Especialidades:</h2>)
            } else {
                setTitulo(<h2>Necesidades:</h2>)
                setExperiencia("")
                if (newUsuario.necesidades.length === 0) {
                    setHabilidades(<li>El acudiente no tiene necesidades</li>)
                } else {
                    setHabilidades(newUsuario.necesidades.map((nec) => <li>{nec.tipo}</li>))
                }
            }
            if(newUsuario.tipoUsuario.toLowerCase() !== "ambos") {
                setBtnStatus(true)
            }
        },
        [usuarioId, isCanguro]
    );

    if (!token) {
        // return <Navigate to="/error"></Navigate>;
    }

    const changeBtnStatus = (tipo) => {
        console.log(tipo, isCanguro)
        if(tipo === isCanguro) {
            setIsCanguro(!isCanguro);
        }
    };

    const seeOfertas = () => {
        console.log('Button 3 clicked');
    };
    
    const seeResenias = () => {
        navigate('/resenias/user', { state: { usuarioId } });
    };

    const addResenia = () => {
        navigate('/resenias/new', { state: { usuarioId } });
    };

    if (usuario) {
        return (
            <Container className="usuario--detalle">
                <Row className="center">
                    <Button className="btn-t2 small" type="button" disabled={btnStatus} onClick={() => changeBtnStatus(true)}>Canguro</Button>
                    <Button className="btn-t2 small" type="button" disabled={btnStatus} onClick={() => changeBtnStatus(false)}>Acudiente</Button>
                </Row>
                <Row className="lr-margin">
                    <Col className="info">
                        <Row>
                            <h1 className="usuario--nombre">{usuario.nombre}</h1>
                        </Row>
                        <Row>
                            <Col className="usuario--tipo" xs={2}>
                                {usuario.tipoUsuario}
                            </Col>
                            <Col className="usuario--exp">
                                {experiencia}
                            </Col>
                        </Row>
                        {titulo}
                        <ul>
                            {habilidades}
                        </ul>
                        <h2>Métodos de Contacto:</h2>
                        <ul>
                            <li> Correo: {usuario.correoElectronico} </li>
                            <li> Celular: {usuario.celular} </li>
                        </ul>
                        <h2>Antecedentes:</h2>
                        <ul>
                            {antecedentes}
                        </ul>
                    </Col>
                    <Col>
                        <Row className="add-foto">
                            <Image className="foto" src={usuario.foto} />
                        </Row>
                    </Col>
                </Row>
                <Row className="center">
                    <Button className="btn-t1 big" type="button" onClick={seeOfertas}>Ver Ofertas</Button>
                    <Button className="btn-t2 big" type="button" onClick={addResenia}>Añadir Reseña</Button>
                    <Button className="btn-t1 big" type="button" onClick={seeResenias}>Ver Reseñas</Button>
                </Row>
            </Container> 
        );
    }   
}

export default UsuarioDetail;

import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer" //WebRTC api
import io from "socket.io-client"
import {Button, Col, Container, FloatingLabel, Row,Form} from "react-bootstrap";
const socket = io.connect('http://localhost:5001')
const MeetComponent=()=>{

    const [ me, setMe ] = useState("")
    const [ stream, setStream ] = useState()
    const [ receivingCall, setReceivingCall ] = useState(false)
    const [ caller, setCaller ] = useState("")
    const [ callerSignal, setCallerSignal ] = useState()
    const [ callAccepted, setCallAccepted ] = useState(false)
    const [ idToCall, setIdToCall ] = useState("")
    const [ callEnded, setCallEnded] = useState(false)
    const [ name, setName ] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef= useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)
        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall =() =>  {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return(<>
        <Container>
            <Row>
                <Col>
                    <div className="video">
                        {stream &&  <video playsInline muted ref={myVideo} autoPlay  />}
                    </div>
                </Col>
                <Col>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay />:
                            null}
                    </div>
                </Col>
            </Row>
            <Row className="d-inline text-center">
                <Col>
                    <FloatingLabel controlId="floatingPassword" label="Enter Name">
                        <Form.Control type="text"  value={name}
                                      onChange={(e) => setName(e.target.value)} />
                    </FloatingLabel>
                </Col>
                <Col>
                    <CopyToClipboard text={me}>
                        <Button variant="dark" >
                            Copy ID
                        </Button>
                    </CopyToClipboard>
                </Col>
                <Col>
                    <FloatingLabel controlId="floatingPassword" label="Enter id to call">
                        <Form.Control type="text"   value={idToCall}
                                      onChange={(e) => setIdToCall(e.target.value)} />
                    </FloatingLabel>
                </Col>
                <Col>
                    {callAccepted && !callEnded ? (
                        <Button variant="dark" color="secondary" onClick={leaveCall}>
                            End Call
                        </Button>
                    ) : (
                        <Button variant="dark" onClick={() => callUser(idToCall)}>
                            Dial
                        </Button>
                    )}
                    {idToCall}

                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1 >{name} is calling...</h1>
                            <Button variant="dark"  onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}

                </Col>
            </Row>
        </Container>

    </>)
}
export default MeetComponent;

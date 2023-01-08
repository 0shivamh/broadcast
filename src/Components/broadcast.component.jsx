import {Button, Container, Ratio, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import {CopyToClipboard} from "react-copy-to-clipboard";
const socket = io.connect('http://localhost:5001')

const BroadcastComponent=()=>{

    const [ stream, setStream ] = useState()
    const [ me, setMe ] = useState("")

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
            // setReceivingCall(true)
            // setCaller(data.from)
            // setName(data.name)
            // setCallerSignal(data.signal)
        })
    }, [])

    return(<>



        <Container>

            <Row>
                {stream &&  <video playsInline muted ref={myVideo} autoPlay  />}

                <CopyToClipboard text={me}>
                    <Button variant="dark" >
                        Copy ID
                    </Button>
                </CopyToClipboard>
            </Row>

        </Container>

        </>)
}
export default BroadcastComponent;

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './VideoCall.css';

function VideoCall({ user }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('user-join', user._id);
    });

    newSocket.on('incoming-call', handleIncomingCall);
    newSocket.on('call-answered', handleCallAnswered);
    newSocket.on('ice-candidate', handleIceCandidate);
    newSocket.on('call-declined', handleCallDeclined);

    return () => newSocket.close();
  }, [user._id]);

  useEffect(() => {
    if (!callActive) return;

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callActive]);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            targetUserId: userId,
            candidate: event.candidate
          });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('call-initiate', {
        callerId: user._id,
        receiverId: userId,
        offer: offer
      });

      setCallActive(true);
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
    }
  };

  const handleIncomingCall = (data) => {
    const answer = window.confirm('Incoming call from user. Accept?');
    if (answer) {
      socket.emit('call-answer', {
        callerId: data.callerId,
        answer: data.offer
      });
    } else {
      socket.emit('call-decline', { targetUserId: data.callerId });
    }
  };

  const handleCallAnswered = () => {
    setCallActive(true);
  };

  const handleIceCandidate = (data) => {
    if (peerConnection.current) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleCallDeclined = () => {
    alert('Call was declined');
    navigate('/');
  };

  const endCall = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
      await fetch('/api/calls/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: userId,
          duration: callDuration
        })
      });
    } catch (error) {
      console.error('Error saving call session:', error);
    }

    navigate('/');
  };

  return (
    <div className="video-call">
      <div className="video-container">
        <div className="video-wrapper">
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video"></video>
          <div className="local-video-wrapper">
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video"></video>
          </div>
        </div>

        <div className="call-controls">
          {!callActive ? (
            <button onClick={initializeWebRTC} className="btn btn-call">Start Call</button>
          ) : (
            <>
              <div className="call-timer">{Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, '0')}</div>
              <button onClick={endCall} className="btn btn-hang-up">End Call</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;

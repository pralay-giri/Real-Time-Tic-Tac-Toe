import io, { Socket } from 'socket.io-client';
const endPoint: string = import.meta.env.VITE_BACK_END_API;

const socket: Socket = io(endPoint, {
    withCredentials: true,
});

export default socket;

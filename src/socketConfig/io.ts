import io, { Socket } from 'socket.io-client';
import { BACK_END_API } from '../utils/constants';

const socket: Socket = io(BACK_END_API, {
    withCredentials: true,
});

export default socket;

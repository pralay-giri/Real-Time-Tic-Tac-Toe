import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateId } from '../utils/generateRoomId';
import socket from '../socketConfig/io';

const JoinGame = () => {
    const { roomId, confirmationId } = useParams();
    const navigator = useNavigate();

    useEffect(() => {
        const userName: string | null = localStorage.getItem('userName');
        if (!userName) {
            localStorage.setItem('userName', generateId(15));
        }
    }, []);

    useEffect(() => {
        const isInAGame = localStorage.getItem('gameData');
        const playerName = localStorage.getItem('userName');
        if (!isInAGame) {
            const payload = {
                roomId,
                confirmationId,
                playerName,
            };
            console.log(payload);
            socket.emit('join-game', { payload });
        } else {
            navigator('/gameBord');
        }
    }, []);

    useEffect(() => {
        socket.on('start-game', (data) => {
            localStorage.setItem('gameData', JSON.stringify(data));
            navigator('/gameBord');
        });

        return () => {
            socket.removeListener('start-game');
        };
    }, []);

    // handaling the error
    useEffect(() => {
        socket.on('error-join-game', () => {
            confirm('error in joinning game');
            navigator('/');
        });

        return () => {
            socket.removeListener('error-join-game');
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            joining game with:
            {` roomId: ${roomId}, confirmationId: ${confirmationId}`}
        </div>
    );
};

export default JoinGame;

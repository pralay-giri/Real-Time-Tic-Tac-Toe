import { useNavigate, useParams } from 'react-router-dom';
import { IoCopy } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import socket from '../socketConfig/io';

const InitGamePage = () => {
    const { roomId } = useParams();
    const navigator = useNavigate();
    const { href } = window.location;
    const [isLoadingQrCode, setIsLoadingQrCode] = useState<boolean>(true);
    const [isGameCreated, setIsGameCreated] = useState<boolean>(false);
    const [confirmationId, setConfirmationId] = useState<string>('');

    // creating a game
    useEffect(() => {
        const playerName: string | null = localStorage.getItem('userName');
        const gameData = localStorage.getItem('gameData');
        // init game

        const payload = {
            roomId,
            playerName,
        };

        // ctrate a new game event
        if (!gameData) {
            socket.emit('create-game', { payload });
            setIsGameCreated(true);
        } else {
            setIsGameCreated(true);
            navigator('/gameBord');
        }
    }, []);

    // confarmation for creating game
    useEffect(() => {
        socket.on('game-created', (data: any) => {
            localStorage.setItem('isGameCreated', JSON.stringify(data));
            setIsGameCreated(true);
            setConfirmationId(data.confirmationId);
        });

        return () => {
            socket.removeListener('game-created');
        };
    }, []);

    // handleing the error
    useEffect(() => {
        socket.on('game-creation-error', () => {
            navigator('/');
        });

        return () => {
            socket.removeListener('game-creation-error');
        };
    }, []);

    // handle the start game event
    useEffect(() => {
        socket.on('start-game', (data) => {
            localStorage.setItem('gameData', JSON.stringify(data));
            navigator('/gameBord');
        });
        return () => {
            socket.removeListener('start-game');
        };
    }, []);

    if (!isGameCreated) {
        return (
            <div className="mt-10 flex flex-col gap-5 items-center justify-center">
                <h1 className="animate-pulse text-xl text-blue-400">
                    creating room for game...
                </h1>
            </div>
        );
    }

    const handleCopy = () => {
        if (window.navigator.clipboard) {
            window.navigator.clipboard.writeText(href + `/${confirmationId}`);
        }
    };

    return (
        <div className="mt-10 flex flex-col gap-5 items-center justify-center">
            <button
                className="w-auto flex items-center justify-between py-3 px-5 rounded-lg text-black border-none text-xl bg-blue-400  hover:bg-opacity-85 focus-visible:bg-opacity-85 transition-all gap-2"
                onClick={handleCopy}
            >
                <span>{href + `/${confirmationId}`}</span>
                <IoCopy />
            </button>
            <div className="qr w-2/12">
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${href + `/${confirmationId}`}`}
                    alt="QR"
                    className="w-full aspect-square"
                    onLoad={() => {
                        setIsLoadingQrCode(false);
                    }}
                />
                {isLoadingQrCode && (
                    <p className="animate-pulse">loadding qr...</p>
                )}
            </div>
            <h1 className="w-4/12 py-3 px-5 rounded-lg text-black border-none text-xl bg-blue-400  transition-all cursor-pointer">
                share this link to your friend or scan this QR code
            </h1>
            {isGameCreated && (
                <p className="animate-pulse">waiting for your oponent...</p>
            )}
        </div>
    );
};

export default InitGamePage;

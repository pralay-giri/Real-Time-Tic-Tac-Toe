import { useNavigate, useParams } from 'react-router-dom';
import { IoCopy } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import socket from '../socketConfig/io';
import { LiaCheckDoubleSolid } from 'react-icons/lia';

const InitGamePage = () => {
    const { roomId } = useParams();
    const navigator = useNavigate();
    const { href } = window.location;
    const [isLoadingQrCode, setIsLoadingQrCode] = useState<boolean>(true);
    const [isCopyed, setIsCopyed] = useState<boolean>(false);
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

    if (!confirmationId) {
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.documentElement.style.overflow = 'auto';
    }

    const handleCopy = () => {
        setIsCopyed(true);
        if (window.navigator.clipboard) {
            window.navigator.clipboard.writeText(href + `/${confirmationId}`);
        }
    };

    return (
        <div className="mt-10 flex flex-col gap-5 items-center justify-center">
            <button
                className="w-auto max-md:w-10/12 flex items-center justify-between py-3 px-5 rounded-lg text-black border-none text-xl bg-blue-400  hover:bg-opacity-85 focus-visible:bg-opacity-85 transition-all gap-2 max-sm:text-sm"
                onClick={handleCopy}
            >
                <span className="w-10/12 overflow-hidden text-ellipsis">
                    {href + `/${confirmationId}`}
                </span>
                {isCopyed ? <LiaCheckDoubleSolid /> : <IoCopy />}
            </button>
            <div className="qr w-60">
                {confirmationId && (
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${href + `/${confirmationId}`}`}
                        alt="QR"
                        className="w-full"
                        onLoad={() => {
                            setIsLoadingQrCode(false);
                        }}
                    />
                )}
                {isLoadingQrCode && (
                    <p className="animate-pulse">loadding qr...</p>
                )}
            </div>
            <h1 className="w-auto max-md:w-10/12 flex items-center justify-between py-3 px-5 rounded-lg text-black border-none text-xl bg-blue-400  hover:bg-opacity-85 focus-visible:bg-opacity-85 transition-all gap-2 max-sm:text-sm">
                scann the QR code to play or shear the link
            </h1>
            {isGameCreated && (
                <p className="animate-pulse">waiting for your oponent...</p>
            )}
            {!confirmationId && (
                <div className="absolute inset-0 bg-[rgba(255, 255, 255, 0.6)] backdrop-blur-lg">
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xl">loadding...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InitGamePage;

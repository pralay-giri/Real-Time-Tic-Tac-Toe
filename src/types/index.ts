export type GameStatus = 'X' | 'O' | 'INCOMPLETE' | 'DRAW';

export interface PlayerInfer {
    playerName: string;
    turn: 'X' | 'O';
    _id: any;
}

export interface GameInfer {
    _id: any;
    roomId: string;
    gameBord: Array<number>;
    players: Array<PlayerInfer>;
    __v: number;
    lastTurn: 'X' | 'O';
    winner: GameStatus;
}

export interface initGameConfig {
    roomId: string;
    playerId: string;
    playerName: string;
}

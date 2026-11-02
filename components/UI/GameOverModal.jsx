"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ReplayIcon from "@mui/icons-material/Replay";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import TimerIcon from "@mui/icons-material/Timer";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import ArticlesButton from "./Button";
import Stack from "@mui/material/Stack";
import { useSearchParams } from "next/navigation";
import { useSocketStore } from "@/hooks/useSocketStore";
import useGameHelpers from "@/hooks/useGameHelpers";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ScoreDate({ playedAt, compact = false }) {
    const timestamp = Date.parse(playedAt);
    if (!Number.isFinite(timestamp)) return "Unknown";
    return (
        <time
            dateTime={playedAt}
            suppressHydrationWarning
        >
            {compact
                ? format(new Date(timestamp), "yyyy-MM-dd h:mm a")
                : new Date(timestamp).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                  })}
        </time>
    );
}

export function SinglePlayerScoreboard({
    highlightedResultId,
    onClose,
    onPlayAgain,
} = {}) {
    const bestScores = useScoreStore((state) => state.bestScores);
    const recentScores = useScoreStore((state) => state.recentScores);
    const lifetimeHits = useScoreStore((state) => state.obstacles_hit);
    const mounted = useSyncExternalStore(
        subscribe,
        clientSnapshot,
        serverSnapshot,
    );
    const [view, setView] = useState("best");
    const [sortBy, setSortBy] = useState("score");
    const [direction, setDirection] = useState("desc");
    const rows = useMemo(() => {
        if (!mounted) return [];
        return (view === "best" ? bestScores : recentScores)
            .slice()
            .sort((a, b) => {
                const difference =
                    sortBy === "playedAt"
                        ? Date.parse(a.playedAt) - Date.parse(b.playedAt)
                        : a.score - b.score;
                return direction === "asc" ? difference : -difference;
            });
    }, [mounted, view, bestScores, recentScores, sortBy, direction]);

    const sort = (column) => {
        setDirection(
            sortBy === column && direction === "desc" ? "asc" : "desc",
        );
        setSortBy(column);
    };

    return (
        <Box>
            <ToggleButtonGroup
                exclusive
                value={view}
                fullWidth
                size="small"
                aria-label="Score history"
                onChange={(_, next) => {
                    if (!next) return;
                    setView(next);
                    setSortBy(next === "best" ? "score" : "playedAt");
                    setDirection("desc");
                }}
                sx={{ mb: 1 }}
            >
                <ToggleButton value="best" sx={{ gap: 1 }}>
                    <EmojiEventsIcon fontSize="small" />
                    Best Scores
                </ToggleButton>
                <ToggleButton value="recent" sx={{ gap: 1 }}>
                    <HistoryIcon fontSize="small" />
                    Recent Scores
                </ToggleButton>
            </ToggleButtonGroup>
            <TableContainer>
                <Table
                    size="small"
                    aria-label="Saved treasure dive results"
                    sx={{ minWidth: 280 }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "60%", minWidth: 180 }}>
                                Nickname
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === "score"}
                                    direction={
                                        sortBy === "score" ? direction : "desc"
                                    }
                                    onClick={() => sort("score")}
                                >
                                    Score
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Obstacles hit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((result) => (
                            <TableRow
                                key={result.id}
                                selected={result.id === highlightedResultId}
                            >
                                <TableCell
                                    sx={{
                                        width: "60%",
                                        minWidth: 180,
                                        overflowWrap: "anywhere",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {result.nickname}
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "block",
                                            fontSize: "0.65rem",
                                            color: "text.secondary",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        <ScoreDate
                                            playedAt={result.playedAt}
                                            compact
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>{result.score}</TableCell>
                                <TableCell>{result.obstacles_hit}</TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    No completed games yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
            >
                Lifetime obstacles hit: {mounted ? lifetimeHits : 0}
            </Typography>
            {(onClose || onPlayAgain) && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        mt: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flex: 1, justifyContent: "flex-start" }}
                    >
                        {onClose && (
                            <ArticlesButton onClick={onClose} startIcon={<CloseIcon />}>
                                Close
                            </ArticlesButton>
                        )}
                        <ArticlesButton
                            component={Link}
                            href="/"
                            onClick={onClose}
                            startIcon={<HomeIcon />}
                            sx={{ mt: 1 }}
                        >
                            Back to Landing
                        </ArticlesButton>
                    </Stack>
                    {onPlayAgain && (
                        <ArticlesButton onClick={onPlayAgain} startIcon={<ReplayIcon />}>
                            Play Again
                        </ArticlesButton>
                    )}
                </Box>
            )}
        </Box>
    );
}

export function MultiplayerScoreboard({
    rankings = [],
    onClose,
    onPlayAgain,
    canReturnToLobby,
}) {
    const socketId = useSocketStore((state) => state.socket?.id);
    const rows = [...rankings].sort((a, b) => (b.score || 0) - (a.score || 0));
    const winners = rows.filter(
        (player) => (player.score || 0) === (rows[0]?.score || 0),
    );

    return (
        <Box>
            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                {winners.length > 1 ? "Tied for first: " : "Winner: "}
                {winners
                    .map((player) => player.nickname || "Unknown")
                    .join(", ")}
            </Typography>
            <TableContainer>
                <Table
                    size="small"
                    aria-label="Multiplayer treasure dive results"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Nickname</TableCell>
                            <TableCell align="right">
                                Treasures collected
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((player) => (
                            <TableRow
                                key={player.id}
                                selected={player.id === socketId}
                            >
                                <TableCell>
                                    {rows.findIndex(
                                        (row) =>
                                            (row.score || 0) ===
                                            (player.score || 0),
                                    ) + 1}
                                </TableCell>
                                <TableCell sx={{ overflowWrap: "anywhere" }}>
                                    {player.nickname || "Unknown"}
                                </TableCell>
                                <TableCell align="right">
                                    {player.score || 0}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, justifyContent: "space-between" }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                >
                    <ArticlesButton onClick={onClose} startIcon={<CloseIcon />}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton
                        component={Link}
                        href="/"
                        onClick={onClose}
                        startIcon={<HomeIcon />}
                    >
                        Back to Landing
                    </ArticlesButton>
                </Stack>
                <ArticlesButton
                    onClick={onPlayAgain}
                    startIcon={<ReplayIcon />}
                    disabled={!canReturnToLobby}
                >
                    Play Again
                </ArticlesButton>
            </Stack>
            {!canReturnToLobby && (
                <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Reconnect to the server to return to the lobby.
                </Typography>
            )}
        </Box>
    );
}

export default function GameOverModal() {
    const server = useSearchParams().get("server");
    const result = useGameStore((state) => state.gameState.result);
    const open = useGameStore((state) => state.gameState.resultDialogOpen);
    const closeResultDialog = useGameStore((state) => state.closeResultDialog);
    const multiplayerResult = useGameStore((state) => state.showGameOverModal);
    const setShowGameOverModal = useGameStore(
        (state) => state.setShowGameOverModal,
    );
    const connected = useSocketStore((state) => state.connected);
    const socketId = useSocketStore((state) => state.socket?.id);
    const isRoomMember = useGameStore((state) =>
        state.gameState.players?.some((player) => player.id === socketId),
    );
    const { handleReturnToLobby } = useGameHelpers();
    const canReturnToLobby = connected && isRoomMember;
    const close = () =>
        server ? setShowGameOverModal(false) : closeResultDialog();

    return (
        <Dialog
            open={Boolean(server ? multiplayerResult : open && result)}
            onClose={close}
            fullWidth
            maxWidth="sm"
            aria-labelledby="game-over-title"
        >
            <DialogTitle
                id="game-over-title"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
                <TimerIcon />
                Game Over — Time’s up!
            </DialogTitle>
            <DialogContent>
                {server ? (
                    <MultiplayerScoreboard
                        rankings={multiplayerResult?.rankings}
                        onClose={close}
                        onPlayAgain={handleReturnToLobby}
                        canReturnToLobby={canReturnToLobby}
                    />
                ) : (
                    <>
                        <Typography variant="h6">{result?.nickname}</Typography>
                        <Typography
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            <ScoreDate playedAt={result?.playedAt} />
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            {[
                                ["Treasures collected", result?.score],
                                [
                                    "Obstacles hit this game",
                                    result?.obstacles_hit,
                                ],
                            ].map(([label, value]) => (
                                <Box
                                    key={label}
                                    sx={{
                                        flex: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        {label}
                                    </Typography>
                                    <Typography variant="h4">
                                        {value ?? 0}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <SinglePlayerScoreboard
                            highlightedResultId={result?.id}
                            onClose={close}
                            onPlayAgain={() => {
                                useGameStore.getState().startSinglePlayerGame();
                            }}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

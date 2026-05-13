import * as React from "react";
import Draggable from "react-draggable";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

let zTop = 1000;

export interface FloatingPanelProps {
    title: string;
    open: boolean;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    children: React.ReactNode;
}

export function FloatingPanel({
    title,
    open,
    onClose,
    defaultPosition = { x: 60, y: 60 },
    children,
}: FloatingPanelProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [zIndex, setZIndex] = React.useState(zTop);
    const nodeRef = React.useRef<HTMLDivElement>(null);

    const bringToFront = React.useCallback(() => {
        zTop += 1;
        setZIndex(zTop);
    }, []);

    // Bring this panel to front whenever it mounts (open→true causes remount).
    // bringToFront has a stable identity (useCallback []), so this fires exactly once per mount.
    React.useEffect(() => {
        bringToFront();
    }, [bringToFront]);

    if (!open) return null;

    if (isMobile) {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={() => {}} // required by SwipeableDrawer API; swipe-to-open is disabled
                disableSwipeToOpen
            >
                <div style={{ padding: 16, paddingBottom: 24 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                        }}
                    >
                        <Typography variant="subtitle2" style={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <Divider style={{ marginBottom: 12 }} />
                    {children}
                </div>
            </SwipeableDrawer>
        );
    }

    return (
        <Draggable handle=".fp-handle" nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="body">
            <div
                ref={nodeRef}
                style={{ position: "fixed", zIndex, minWidth: 260, top: 0, left: 0 }}
                onMouseDown={bringToFront}
            >
                <Paper elevation={8} style={{ overflow: "hidden" }}>
                    <div
                        className="fp-handle"
                        style={{
                            padding: "6px 8px",
                            cursor: "move",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: theme.palette.action.hover,
                            userSelect: "none",
                        }}
                    >
                        <Typography variant="caption" style={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                        <IconButton size="small" onClick={onClose} style={{ padding: 2 }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <div style={{ padding: 8 }}>{children}</div>
                </Paper>
            </div>
        </Draggable>
    );
}

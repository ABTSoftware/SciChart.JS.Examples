import { Typography } from "@mui/material";
import {
  buildSignalMeterGradientStops,
  toCssLinearGradient,
} from "./signalPalette";

type SignalMeterProps = {
  signalPeakDb: number;
  minDb: number;
  maxDb: number;
};

export function SignalMeter({ signalPeakDb, minDb, maxDb }: SignalMeterProps) {
  const clampedDb = Math.min(maxDb, Math.max(minDb, signalPeakDb));
  const range = Math.max(1, maxDb - minDb);
  const fillPct = ((clampedDb - minDb) / range) * 100;
  const gradient = toCssLinearGradient(
    buildSignalMeterGradientStops(minDb, maxDb)
  );
  const clipRight = `${Math.max(0, 100 - fillPct).toFixed(2)}%`;

  return (
    <div className="smeter-wrap">
      <Typography className="control-caption">Sig</Typography>
      <div
        className="smeter-track"
        role="meter"
        aria-valuemin={minDb}
        aria-valuemax={maxDb}
        aria-valuenow={Math.round(clampedDb)}
        aria-label="Signal strength"
      >
        <div className="smeter-scale" style={{ backgroundImage: gradient }} />
        <div
          className="smeter-fill"
          style={{
            backgroundImage: gradient,
            clipPath: `inset(0 ${clipRight} 0 0)`,
          }}
        />
      </div>
      <Typography className="smeter-value">
        {signalPeakDb.toFixed(0)} dB
      </Typography>
    </div>
  );
}

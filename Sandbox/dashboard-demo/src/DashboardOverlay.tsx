import { appTheme } from 'scichart-example-dependencies';

const DashboardOverlay = () => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                backgroundColor: '#242529',
                top: 0,
                left: 0,
                zIndex: 12, // overlap the default fallback loaders
                width: '100%',
                height: '100%',
                fontSize: 50,
                color: appTheme.ForegroundColor,
                textAlign: 'center',
                verticalAlign: 'middle',
                justifyContent: 'stretch',
            }}
        >
            <div style={{ flex: 'auto' }}> Loading...</div>
        </div>
    );
};

export default DashboardOverlay;

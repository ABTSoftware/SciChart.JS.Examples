export interface TDataEntry {
    timestamp: number;
    page: string;
    server: string;
    location: string;
    duration: number;
}

export const availablePages = ["Signup", "Login", "Signout", "Content"];
export const availableLocations = ["CN", "IN", "US", "JP", "DE", "GB", "FR", "BR", "CA", "AU"];
export const availableServers = ["server0", "server1", "server2", "server3"];

function generateTimestampRange(daysAgo: number, numberOfDays: number) {
    const timestamps = [];

    for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - (daysAgo + i)); // Calculate date by subtracting days
        timestamps.push(currentDate.getTime()); // Push timestamp to the array
    }

    return timestamps;
}

const sortArrayByTimestampAscending = (array: TDataEntry[]): TDataEntry[] =>
    array.slice().sort((a, b) => a.timestamp - b.timestamp);

const generateData = () => {
    const size = 10000;
    const timestampRange = generateTimestampRange(100, 100);
    const data: TDataEntry[] = [];
    for (let index = 0; index < size; ++index) {
        const timestamp = Math.round(timestampRange[Math.round(Math.random() * 1000) % timestampRange.length] / 1000);
        const page = availablePages[Math.round(Math.random() * 1000) % availablePages.length];
        const server = `server${Math.floor(Math.random() * 109) % availableServers.length}`;
        const location = availableLocations[Math.floor(Math.random() * 109) % availableLocations.length];
        const duration = Math.floor(Math.random() * 3000);

        if (duration > 2000) {
        }

        const entry: TDataEntry = {
            timestamp,
            page,
            server,
            location,
            duration,
        };

        data.push(entry);
    }

    return sortArrayByTimestampAscending(data);
};

let cachedData: TDataEntry[];
export const getData = () => {
    if (!cachedData) {
        cachedData = generateData();
    }

    return cachedData;
};

const groupItemsByProperty = (array: TDataEntry[], propertyName: string) => {
    return array.reduce((acc: Map<TDataEntry[keyof TDataEntry], TDataEntry[]>, item: TDataEntry) => {
        const value = item[propertyName as keyof TDataEntry];
        acc.set(value, acc.get(value) || []);
        acc.get(value).push(item);
        return acc;
    }, new Map<TDataEntry[keyof TDataEntry], TDataEntry[]>());
};
const distinctValues = (array: any[]): any[] => [...new Set(array)];

const groupItemsByTimestamp = (array: TDataEntry[]) => groupItemsByProperty(array, "timestamp");
const groupItemsByLocation = (array: TDataEntry[]) => groupItemsByProperty(array, "location");

export const getRequestsNumberPerTimestamp = (data: TDataEntry[]) => {
    const xValues = distinctValues(
        data.map((entry) => {
            return entry.timestamp;
        })
    );

    const dataGroupedByTimestamp = groupItemsByTimestamp(data) as Map<number, TDataEntry[]>;

    const yValues: number[] = [];
    const groupedEntries: TDataEntry[][] = [];

    const sortedEntries = [...dataGroupedByTimestamp].sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < sortedEntries.length; ++i) {
        const [key, dataEntries] = sortedEntries[i];
        yValues.push(dataEntries.filter((entry) => entry.page).length);
        groupedEntries.push(dataEntries);
    }

    return {
        xValues,
        yValues,
        groupedEntries,
    };
};

const getLocationIndex = (location: string) => {
    const locationIndex = distinctValues(availableLocations).findIndex((val: string) => val === location);
    return locationIndex;
};

const locationIndexes = availableLocations.map((v, i) => i);
export const getRequestsNumberPerLocation = (data: TDataEntry[]) => {
    const xValues = locationIndexes;

    const groupedData = groupItemsByLocation(data) as Map<string, TDataEntry[]>;

    const yValues: number[] = Array.from(new Array(xValues.length), () => 0);
    const groupedEntries: TDataEntry[][] = [];

    const entries = [...groupedData];
    for (let i = 0; i < entries.length; ++i) {
        const [key, dataEntries] = entries[i];
        yValues[getLocationIndex(key)] = dataEntries.length;
        // groupedEntries.push(dataEntries);
    }
    return {
        xValues,
        yValues,
    };
};

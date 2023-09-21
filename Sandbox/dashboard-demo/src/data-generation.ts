export interface TDataEntry {
    timestamp: number;
    page: string;
    server: string;
    location: string;
    duration: number;
}

export const availablePages = ['Signup', 'Login', 'Signout', 'Content'];
export const availableLocations = ['NA', 'EU', 'Asia', 'Africa'];
export const availableServers = ['server0', 'server1', 'server2', 'server3'];

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
        const server = `server${Math.floor(Math.random() * 10) % 4}`;
        const location = availableLocations[Math.floor(Math.random() * 10) % availableLocations.length];
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
    return array.reduce((acc: Record<any, TDataEntry[]>, item: TDataEntry) => {
        const value = item[propertyName as keyof TDataEntry];
        acc[value] = acc[value] || [];
        acc[value].push(item);
        return acc;
    }, {});
};
const distinctValues = (array: any[]): any[] => [...new Set(array)];

const getGroupedItemsSize = (groupedResult: Record<number, TDataEntry[]>): Record<number, number> => {
    const totalCounts: Record<number, number> = {};

    for (const item in groupedResult) {
        totalCounts[item] = groupedResult[item].length;
    }

    return totalCounts;
};

const groupItemsByTimestamp = (array: TDataEntry[]) => groupItemsByProperty(array, 'timestamp');
const groupItemsByLocation = (array: TDataEntry[]) => groupItemsByProperty(array, 'location');

export const getRequestsNumberPerTimestamp = (data: TDataEntry[]) => {
    const xValues = distinctValues(
        data.map((entry) => {
            return entry.timestamp;
        })
    );

    const dataGroupedByTimestamp = groupItemsByTimestamp(data);
    const requestsPerPeriods = getGroupedItemsSize(dataGroupedByTimestamp);
    const yValues = Object.entries(requestsPerPeriods)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([timestamp, count]) => count);

    const groupedEntries = Object.entries(dataGroupedByTimestamp)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([timestamp, dataEntries]) => dataEntries);

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

export const getRequestsNumberPerLocation = (data: TDataEntry[]) => {
    const xValues = distinctValues(availableLocations).map((v, i) => i);

    const groupedData = groupItemsByLocation(data);

    const groupedDataSizes = getGroupedItemsSize(groupedData);

    const yValues = Object.entries(groupedDataSizes)
        .sort((a, b) => getLocationIndex(a[0]) - getLocationIndex(b[0]))
        .map(([timestamp, count]) => count);

    return {
        xValues,
        yValues,
    };
};

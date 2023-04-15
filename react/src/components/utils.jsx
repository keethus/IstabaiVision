export const signalStrengthClasses = [
    { range: [0.9, 1], class: "fill-green-500" },
    { range: [0.8, 0.9], class: "fill-green-400" },
    { range: [0.7, 0.8], class: "fill-lime-400" },
    { range: [0.6, 0.7], class: "fill-lime-300" },
    { range: [0.5, 0.6], class: "fill-yellow-400" },
    { range: [0.4, 0.5], class: "fill-amber-500" },
    { range: [0.3, 0.4], class: "fill-orange-400" },
    { range: [0.2, 0.3], class: "fill-orange-600" },
    { range: [0.1, 0.2], class: "fill-red-400" },
];

export const getSignalStrengthClass = (signalStrength) => {
    const item = signalStrengthClasses.find((item) =>
        signalStrength >= item.range[0] && signalStrength <= item.range[1]
    );
    return item ? item.class : "";
};
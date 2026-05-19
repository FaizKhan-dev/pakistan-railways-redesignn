const Train = require('../models/Train');

const seedTrains = async () => {
    try {
        const trains = [
            {
                trainNumber: '15-Up',
                trainName: 'Green Line Express',
                fromStation: 'KHI',
                toStation: 'ISB',
                departureTime: '08:00',
                arrivalTime: '28:00',
                status: 'On Time',
                delay: 0,
                classes: [
                    { className: 'AC Parlor', fare: 5500, availableSeats: 20 },
                    { className: 'AC Sleeper', fare: 3800, availableSeats: 35 },
                    { className: 'Economy', fare: 1500, availableSeats: 80 }
                ]
            },
            {
                trainNumber: '37-Up',
                trainName: 'Karakoram Express',
                fromStation: 'KHI',
                toStation: 'LHE',
                departureTime: '13:00',
                arrivalTime: '35:00',
                status: 'Delayed',
                delay: 45,
                classes: [
                    { className: 'AC Business', fare: 4200, availableSeats: 12 },
                    { className: 'AC Sleeper', fare: 3200, availableSeats: 28 },
                    { className: 'Economy', fare: 1200, availableSeats: 60 }
                ]
            },
            {
                trainNumber: '146-Up',
                trainName: 'Awam Express',
                fromStation: 'KHI',
                toStation: 'PWR',
                departureTime: '16:30',
                arrivalTime: '44:30',
                status: 'On Time',
                delay: 0,
                classes: [
                    { className: 'AC Business', fare: 5000, availableSeats: 18 },
                    { className: 'AC Sleeper', fare: 3500, availableSeats: 32 },
                    { className: 'Economy', fare: 1300, availableSeats: 75 }
                ]
            },
            {
                trainNumber: '9-Up',
                trainName: 'Allama Iqbal Express',
                fromStation: 'KHI',
                toStation: 'SKT',
                departureTime: '17:15',
                arrivalTime: '40:15',
                status: 'Early',
                delay: -15,
                classes: [
                    { className: 'AC Parlor', fare: 4800, availableSeats: 22 },
                    { className: 'AC Sleeper', fare: 3400, availableSeats: 40 },
                    { className: 'Economy', fare: 1100, availableSeats: 90 }
                ]
            }
        ];

        const count = await Train.countDocuments();
        if (count === 0) {
            await Train.insertMany(trains);
            console.log('✅ Sample train data inserted');
        }
    } catch (error) {
        console.error('❌ Error seeding trains:', error.message);
    }
};

module.exports = { seedTrains };

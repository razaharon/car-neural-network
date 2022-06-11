const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const carCtx = carCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const cars = generateCars(100)
let bestCar = cars[0];
if (localStorage.getItem('bestBrain')) {
    for(let i = 0; i<cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1)
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -300, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -500, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -500, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -700, 30,50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -700, 30,50, 'DUMMY', 2),
]
animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain')
}

function generateCars(N) {
    const cars = [];
    for(let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
    }
    return cars;
}

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    carCanvas.height = window.innerHeight;

    cars.forEach(car => car.update(road.borders, traffic))
    bestCar = cars.find(car => car.y === Math.min(...cars.map(c => c.y)));
    save(bestCar);
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }
    carCtx.globalAlpha = 0.2;
    cars.forEach(car => car.draw(carCtx, 'blue'));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);
    carCtx.restore();
    requestAnimationFrame(animate);
}

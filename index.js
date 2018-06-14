const a = 3;
a

const counter = timeout => (type, sink) => {
    let handle;
    let i = 0;
    const talkBack = (tbType, tbSink) => {
        if (tbType === 2 && handle) {
            clearInterval(handle);
        }
    };
    sink(0, talkBack);
    if (type === 0) {
        handle = setInterval(() => sink(1, i++), timeout);
    }
};

const makePrinter = id => {
    let talkBack;
    let count = 0;
    return (type, data) => {
        if(type === 0) {
            talkBack = data;
            console.log(id, 'Starting... Talkback: ', data);
        }
        if(type === 1) {
            console.log(id, 'Received', count, data);
            if (count === 10) {
                console.log(id, 'Reached 10. Terminating.');
                talkBack(2); // terminate at 10
            }
            ++count;
        }
        if(type === 2) {
            console.log(id, 'End', data);
            talkBack = undefined;
        }
    };
};

const map = transform => source => (_, sink) =>
    source(0, (t, d) => t === 1
        ? sink(1, transform(d))
        : sink(t, d));



map(i => i + 100)(counter(100))(0, makePrinter(1));
map(i => 'Say it ' + i + ' times')(counter(200))(0, makePrinter(2));

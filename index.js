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
    return (type, data) => {
        if(type === 0) {
            talkBack = data;
            console.log(id, 'Starting... Talkback: ', data);
        }
        if(type === 1) {
            console.log(id, 'Received', data);
            if (data === 10) {
                console.log(id, 'Reached 10. Terminating.');
                talkBack(2); // terminate at 10
            }
        }
        if(type === 2) {
            console.log(id, 'End', data);
            talkBack = undefined;
        }
    };
};

counter(100)(0, makePrinter(1));
counter(200)(0, makePrinter(2));
const a = 3;
a

const counter = timeout => (type, sink) => {
    if (type !== 0) return; // Not start. Ignore it.
    let handle;
    let i = 0;
    const talkBack = (tbType, tbSink) => {
        if (tbType === 2 && handle) {
            clearInterval(handle);
        }
    };
    handle = setInterval(() => sink(1, i++), timeout);
    sink(0, talkBack);
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

const take = nr => source => (_, sink) => {
    let talkBack;
    return source(0, (t, d) => {
        sink(t, d);
        if (t === 0) {
            talkBack = d;
        } else if (t === 1) {
            --nr;
        }
        if (nr <= 0) {
            talkBack(2);
            sink(2);
        }
    });
};

function pipe(source, operator, ...rest) {
    if (!operator) {
        return source;
    }
    return pipe(operator(source), ...rest);
}


pipe(
    counter(100),
    map(i => i + 100),
    map(i => i * 2),
    map(i => 'Say it ' + i + ' times'),
    take(0)
)(0, makePrinter(1));

pipe(
    counter(200),
    map(i => 'Say it again ' + i + ' times')
);//(0, makePrinter(2));

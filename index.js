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

const tap = f => source => (_, sink) =>
    source(0, (t, d) => {
        if (t === 1) f(d);
        sink(t, d);
    });


const makePrinter = id => {
    let count = 0;
    return (type, data) => {
        if(type === 0) {
            console.log(id, 'Starting... Talkback: ', data);
        }
        if(type === 1) {
            console.log(id, 'Next', ++count, data);
        }
        if(type === 2) {
            console.log(id, 'End', data);
        }
    };
};

const peek = id => x => console.log('Peeking: ', id, x);

pipe(
    counter(100),
    tap(peek(1)),
    map(i => i + 100),
    tap(peek(2)),
    map(i => i * 2),
    tap(peek(3)),
    map(i => 'Say it ' + i + ' times'),
    tap(peek(4)),
    take(3),
    tap(peek(5))
)(0, makePrinter(1));

pipe(
    counter(200),
    map(i => 'Say it again ' + i + ' times')
);//(0, makePrinter(2));

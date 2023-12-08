const throttle = (fn: Function, delay: number) => {
    let flag = true;
    return function (this: any, ...args: any[]) {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, args);
            flag = true;
        }, delay);
    };
};
export default throttle;
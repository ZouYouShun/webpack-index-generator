export function bindDebonce(instance: any, time = 500) {
  return (cb: () => any, nowDebonce = time) => {
    clearTimeout(instance.changeTimeout);

    const toTime = (typeof nowDebonce === 'number') ? nowDebonce : time;

    if (toTime === 0) {
      return cb();
    }

    instance.changeTimeout = setTimeout(() => {
      cb();
    }, toTime);
  };
}
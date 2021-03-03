export{

}

declare global{
    interface Array<T>{
        shuffle() : Array<T>
        sum(key : keyof T): number
        mapToKey<E>(key : keyof T): Array<E>
    }

}


/**
 * Fisher–Yates shuffle
 * O(n) complexity = good shit
 *
 * https://bost.ocks.org/mike/shuffle/
 *
 * @param array
 */
Array.prototype.shuffle = function <T> (this: T[]) : Array<T>{
    let m = this.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }

    return this;
}

/**
 * Maps to a key of T
 * @param key
 */
Array.prototype.mapToKey = function <T extends {[key : string] : any}, E> (this: T[], key : keyof T ) : E[]{
    return (this.map(value => value[key]))
}

Array.prototype.sum = function <T extends {[key : string] : number}, E> (this: T[], key : keyof T) : number{
    return this.reduce<number>((previousValue, currentValue) => previousValue + currentValue[key], 0);
}




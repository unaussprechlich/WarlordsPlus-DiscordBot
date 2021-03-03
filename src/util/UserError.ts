export default class UserError extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'UserError';
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

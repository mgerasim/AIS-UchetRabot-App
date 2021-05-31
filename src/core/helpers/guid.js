const Guid = {
    _s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    generate() {
        var guid = (this._s4() + this._s4() + "-" + this._s4() + "-4" + this._s4().substr(0, 3) + "-" + this._s4() + "-" + this._s4() + this._s4() + this._s4()).toLowerCase();
        return guid;
    },
};

export default Guid;
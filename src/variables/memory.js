
class Memory {
    static setValue(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    static getValue(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
}

export default Memory;
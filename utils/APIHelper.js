
class APIHelper {
    constructor(request) {
        this.request = request;
        this.baseURL = process.env.API_BASE_URL;
    }

    // GET - Retrieve an object
    async getObject(id) {
        return await this.request.get(`${this.baseURL}/objects/${id}`);
    }

    // POST - Create a new object
    async createObject(data) {
        return await this.request.post(`${this.baseURL}/objects`, {
            data: data
        });
    }

    // PUT - Update an existing object
    async updateObject(id, data) {
        return await this.request.put(`${this.baseURL}/objects/${id}`, {
            data: data
        });
    }

    // DELETE - Delete an object
    async deleteObject(id) {
        return await this.request.delete(`${this.baseURL}/objects/${id}`);
    }
}

module.exports = { APIHelper };

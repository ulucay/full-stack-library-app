const API_URL = 'http://localhost:5000/api';

export class Data{

    api(path, method = 'GET', body = null, requiresAuth = null, credentials = null){

        const url = API_URL + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        };

        if (body !== null){
            options.body = JSON.stringify(body);
        }

        if(requiresAuth){
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(url, options);
    }

    async getUser(credentials){
        const response = await this.api('/users', 'GET', null, true, credentials);

        if(response.status === 200){
            return response.json().then(data => data);
        }
        else if(response.status === 401){
            return null;
        }
        else{
            throw new Error();
        }
    }

    async createUser(user){
        const response = await this.api('/users', 'POST', user);

        if(response.status === 201) {
            return [];
        }
        else if(response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            });
        }
        else{
            throw new Error();
        }
    }

    async getCourses() {
        const response = await this.api('/courses', 'GET');

        if(response.status === 200) {
            return response.json();
        }
        else{
            throw new Error();
        }
    }

    async getCourse(id) {
        const response = await this.api(`/courses/${id}`, 'GET');

        if(response.status === 200) {
            return response.json();
        }else if (response.status === 404) {
            return response.status;
        }else{
            throw new Error();
        }
    }

    async createCourse(course, credentials) {
        const response = await this.api('/courses', 'POST', course, true, credentials);
        if(response.status === 201) {
            return [];
        }
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors
            });
        }
        else{
            throw new Error();
        }
    }

    async updateCourse(id, course, credentials) {
        const response = await this.api(`/courses/${id}`, 'PUT', course, true, credentials);
        if(response.status === 204) {
            return [];
        }
        else if(response.status === 400){
            return response.json().then(data => {
                return data.errors
            });
        }
        else{
            throw new Error();
        }
    }

    async deleteCourse(id, credentials) {
        const response = await this.api(`/courses/${id}`, 'DELETE', null, true, credentials);
        if(response.status === 204){
            return [];
        }
        else if(response.status === 400) {
            return response.json().then(data => {
                return data.errors
            });
        }
        else{
            throw new Error();
        }
    }

}

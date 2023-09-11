export class API {
    FETCH_URL = 'https://skilled-marmot-38812.upstash.io/';
    FETCH_OPTIONS = {
        headers: {
            Authorization: 'AZecACQgYjQ0YjhhNjYtYmFmMy00YzgxLTk5NmEtMTdmYmE0NGZmYmRjMjg2YTcyMTYxMzkwNDUwMjhiZTM1ODlmN2U5NWEwM2U=',
        }
    }
    constructor(user){
        this.SET_NAME = `users.${user}.learntQuestionIds`;
    }
    async get(){
        const res = await fetch(`${this.FETCH_URL}smembers/${this.SET_NAME}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return obj.result;
    }
    async add(id){
        const res = await fetch(`${this.FETCH_URL}sadd/${this.SET_NAME}/${id}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
    async delete(id){
        const res = await fetch(`${this.FETCH_URL}srem/${this.SET_NAME}/${id}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
}

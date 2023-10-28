export class API {
    FETCH_URL = 'https://skilled-marmot-38812.upstash.io/';
    FETCH_OPTIONS = {
        headers: {
            Authorization: 'AZecACQgYjQ0YjhhNjYtYmFmMy00YzgxLTk5NmEtMTdmYmE0NGZmYmRjMjg2YTcyMTYxMzkwNDUwMjhiZTM1ODlmN2U5NWEwM2U=',
        }
    }
    constructor(user){
        /** redis set (list) of ids of questions marked by user as learnt */
        this.LEARNT_QUESTIONS_SET_NAME = `users.${user}.learntQuestionIds`;
        /** 
         * redis hash (a list where keys and values just go like key1, val1, key2, val2, ...) of questions marked by user as confirmed (manually checked) where key is question id and value is confirmation date js timestamp e.g. [123-123-123]: "123234345" 
         * note this data is global (not user specific)
         */
        this.CONFIRMED_QUESTIONS_HASH_NAME = `confirmedQuestions`;
    }
    async getAllLearnt(){
        const res = await fetch(`${this.FETCH_URL}smembers/${this.LEARNT_QUESTIONS_SET_NAME}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return obj.result;
    }
    async addLearnt(id){
        const res = await fetch(`${this.FETCH_URL}sadd/${this.LEARNT_QUESTIONS_SET_NAME}/${id}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
    async deleteLearnt(id){
        const res = await fetch(`${this.FETCH_URL}srem/${this.LEARNT_QUESTIONS_SET_NAME}/${id}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
    async getAllConfirmed(){
        const res = await fetch(`${this.FETCH_URL}hgetall/${this.CONFIRMED_QUESTIONS_HASH_NAME}`, this.FETCH_OPTIONS);
        const json = await res.json();
        const hash = json.result;
        const obj = {};
        for(let i = 0; i < hash.length; i++){
            if(i%2){
                obj[hash[i-1]] = hash[i];
            } else continue;
        }
        return obj;
    }
    async confirm(id){
        const res = await fetch(`${this.FETCH_URL}hset/${this.CONFIRMED_QUESTIONS_HASH_NAME}/${id}/${Date.now()}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
    async unconfirm(id){
        const res = await fetch(`${this.FETCH_URL}hdel/${this.CONFIRMED_QUESTIONS_HASH_NAME}/${id}`, this.FETCH_OPTIONS);
        const obj = await res.json();
        return 'result' in obj;
    }
}
export class HashMap{
    #capacity
    #loadFactor;
    constructor(){
        this.#capacity = 16;
        this.#loadFactor = 0.75;
        this.buckets = new Array(this.#capacity);
    }

    hash(key){
        let hashCode = 0;
      
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
          hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;
        }
     
        return hashCode;
    }

    set(key, value){

        let index = this.hash(key);
        const maxCapacity = this.#capacity * this.#loadFactor;
        const currentSize = this.length();

        if(!(currentSize > maxCapacity)){

            if (index < 0 || index >= this.buckets.length) {
                throw new Error("Trying to access index out of bounds");
            }
            if(!this.buckets[index]){
                this.buckets[index] = new LinkedList();
                this.buckets[index].append(key, value);
                return;
            }
            const repeatedKey = this.buckets[index].contains(key);
            if(repeatedKey){
                repeatedKey.value = value;
            }else{
                this.buckets[index].append(key, value);
            }
        }else{
            const tempArray = this.entries();
            tempArray.push([key, value]);
            this.#capacity = this.#capacity * 2;
            this.buckets = new Array(this.#capacity);

            for(let i =0; i < tempArray.length; i++){
                index = this.hash(tempArray[i][0]);
                
                if(!this.buckets[index]){
                    this.buckets[index] = new LinkedList();
                    this.buckets[index].append(tempArray[i][0], tempArray[i][1]);
                }else{
                    const repeatedKey = this.buckets[index].contains(tempArray[i][0]);
                    if(repeatedKey){
                        repeatedKey.value = tempArray[i][1];
                    }else{
                        this.buckets[index].append(tempArray[i][0], tempArray[i][1]);
                    }
                }
            }
        }
    }

    get(key){
        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }

        if(!this.buckets[index]) return null;

        const node = this.buckets[index].contains(key);

        return node ? node.value : null;
    }

    has(key){
        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }

        if(!this.buckets[index]) return false;

        const node = this.buckets[index].contains(key);

        return node ? true : false;
    }

    remove(key){
        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }

        if(!this.buckets[index]) return false;

        const nodeIndex = this.buckets[index].at(key);

        if(typeof nodeIndex === 'number'){
            this.buckets[index].removeAt(nodeIndex);
            return true;
        }else{
            return false;
        }
    }

    length(){
        let count = 0;

        for(const bucket of this.buckets){
            if(!bucket){
                continue;
            }else{
                bucket.iterate( node => count++);
            }
        }

        return count;
    }

    clear(){
        this.buckets = new Array(this.#capacity);
    }

    keys(){
        let keysArray = [];

        for(const bucket of this.buckets){
            if(!bucket){
                continue;
            }else{
                bucket.iterate( node => keysArray.push(node.key));
            }
        }

        return keysArray;
    }

    values(){
        let valuesArray = [];

        for(const bucket of this.buckets){
            if(!bucket){
                continue;
            }else{
                bucket.iterate( node => valuesArray.push(node.value));
            }
        }

        return valuesArray;
    }

    entries(){
        let entriesArray = [];

        for(const bucket of this.buckets){
            if(!bucket){
                continue;
            }else{
                bucket.iterate( node => entriesArray.push([node.key, node.value]));
            }
        }

        return entriesArray;
    }

}

class LinkedList{
    #head;
    constructor(){
        this.#head = null;
    }

    append(key, value){
        const newNode = new Node(key, value, null);

        if(this.#head === null){
            this.#head = newNode;
        }else{
            let tmp = this.#head;
            while(tmp.nextNode != null){
                tmp = tmp.nextNode;
            }
            tmp.nextNode = newNode;
        }
    }

    contains(key){
        if(this.#head === null) return false;
        let tmp = this.#head;

        while(tmp){
            if(tmp.key === key){
                return tmp;
            }else{
                tmp = tmp.nextNode;
            }
        }
        return false;
    }

    at(key){
        if(this.#head === null) return;
        let index = 0;
        let tmp = this.#head;
        while(tmp){
            if(tmp.key === key){
                return index;
            }else{
                tmp = tmp.nextNode;
                index++;
            }
        }
        return null;
    }

    removeAt(index){
        let i = 0;
        let prev = null;
        let current = this.#head;

        if(index === 0){
            this.#head = current.nextNode;
            return;
        }

        while(i < index){
            prev = current;
            current = current.nextNode;
            i++;
        }
        prev.nextNode = current.nextNode;
    }

    iterate(callback){
        let tmp = this.#head;
        while(tmp){
            callback(tmp);
            tmp = tmp.nextNode;
        }
    }
}

class Node{
    constructor(key, value, nextNode){
        this.key = key;
        this.value = value;
        this.nextNode = nextNode
    }
}
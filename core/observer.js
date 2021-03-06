class BaseObserver {
	/**
	 * @description Simple Observer class
	 * @param {Boolean} cache 
	 * 
	 */	
	constructor(cache = true) {
		/**
		 * @description Is used to store all subscribers
		 * @param { Object[]{ name:string, receive: Function }[] }
		 */
		this.__observers = [];
		/**
		 * @description Used to store last broadcasted value of the Observed
		 */
		this.temp = null;
		/**
		 * @description Flag used to determine if caching should occur
		 */
		this.cache = cache;
	}
}

export class SimpleObserver extends BaseObserver {
    /**
	 * @description Simple Observer class
	 * @param {Boolean} cache 
	 * 
	 */	
	constructor(cache = true) {
		super(cache);
	}
	
	/**
     * @description Method to subscribe for changes
     * @param {String} name 
     * @param {Function} subscriber 
     */
	subscribe(name/** String */, subscriber/**Function */) {
		this.__observers.push({name: name, receive: subscriber});
		if(this.temp) {
			this.__observers[ this.__observers.length - 1 ].receive(this.temp);
		}
	}
	
	/**
	 * @description Method to stop receiving changes
	 * @param {String} name 
	 */
	unsubscribe(name/**String */) {
        this.__observers = 
        this.__observers.filter(observer => observer.name !== name );
	}
	
	/**
	 * @description Method to send data to all subscribers
	 * @param {Any} data 
	 */
	send(data/**any */) {
		this.__observers.forEach(subscriber => subscriber.receive(data));
		this.temp = this.cache ? data : null;
	}


}

export class DictionaryObserver extends BaseObserver {
    /**
	 * @description Simple Observer class
	 * @param {Boolean} cache 
	 * 
	 */	
	constructor(cache = true) {
		super(cache);
		this.__observers = {};
		this.temp = {};
	}
	
	/**
     * @description Method to subscribe for changes
     * @param {String} name 
     * @param {Function} subscriber 
     */
	subscribe(name/** String */, subscriber/**Function */) {
		console.log(name)
		this.__observers[name] = subscriber;
		if(this.temp[name]) {
			this.__observers[ name ](this.temp[name]);
		}
	}
	
	/**
	 * @description Method to stop receiving changes
	 * @param {String} name 
	 */
	unsubscribe(name/**String */) {
		this.__observers[name] = undefined;
	}
	
	/**
	 * @description Method to send data to all subscribers
	 * @param {Any} data 
	 */
	broadcast( data/**any */) {
		
		Object.keys(this.__observers).forEach(key => {
			this.__observers[key](data)
			if(this.cache) {
				this.temp[key] = data
			}
		});
	}
	
	sendTo(name/**string */, data/**any */) {
		this.__observers[name] ? this.__observers[name](data): null;		
		this.temp[name] = this.cache ? data : null;
	}
}
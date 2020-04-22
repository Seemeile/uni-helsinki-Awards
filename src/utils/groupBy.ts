export const groupBy = (data: Array<any>, key: any) => {
    return data.reduce((storage, item) => {
        // get the first instance of the key by which we're grouping
        const group = item[key];
        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[group] = storage[group] || [];
        // add this item to its group within `storage`
        storage[group].push(item);
        // return the updated storage to the reduce function, which will then loop through the next 
        return storage; 
    }, {})
}
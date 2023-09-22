
// a class to perform various operation/action on query
// sample bigQuery -> //search=coder&page=2&category=shortsleeves&rating[gte]=4
//                      &price[lte]=999&limit=5

class WhereClause{
    
    // constructor assign values
    // base = model.action { ex: Product.find() } 
    // bigQuery = query inside the url
    constructor(base,bigQuery){
        this.base = base;
        this.bigQuery = bigQuery;
    }


    // search function to get values of searched product from query
    search(){
        // getting the value to be searched from query
        const searchWord = this.bigQuery.search ?
            {
                // find the object/product by name
                // store the value for name
                name:{
                    $regex: this.bigQuery.search,
                    // for case-senstivity
                    $options:'i'
                }
            }
            :
            // if no search value is given then do nothing
            {}

            // update the base by finding data base on serachWord
            this.base = this.base.find({...searchWord});
            // return both base and query
            return this;
    }


    // to filter the products on the basis of some criteria
    // aggregation
    filter(){

        // creating an copy of query to perform operation on query
        // preventing the original query from change
        const copyBigQ = {...this.bigQuery};

        // remove the value of search, page, limit from the query as we have other function for them
        delete copyBigQ['search'];
        delete copyBigQ['limit'];
        delete copyBigQ['page'];

        // convert the object type query into a string
        let stringCopyBigQ = JSON.stringify(copyBigQ);


        // putting sign '$' before aggregation words inside the query
        stringCopyBigQ = stringCopyBigQ.replace(
            // find following words inside the query
            //  \b => for boundaries so that only these words get replaced 
            // /g => for searching globally
            /\b(gte|lte|gt|lt)\b/g,
            // function to add '$' in the starting of all the words passing above condition
            m => `$${m}`
        )

        // convert the updated string again into an object
        const jsonCoypBigQ = JSON.parse(stringCopyBigQ);
        

        // update the base by finding data based on the above query
        this.base = this.base.find(jsonCoypBigQ);
        return this;

    }



    // for pagination feature
    // to show a fixed number of products on each page
    // showPerPage = number of products to show a single page
    pager(showPerPage){
        
        // value of current page
        // by default take it as 1st page
        let currentPage = 1;


        // if user is searching for page greater than 1 
        // update the value of current page using query
        if(this.bigQuery.page) {
            // value of current page
            currentPage = this.bigQuery.page;
        }


        // number of product to skip from beginning on each page
        const skipProduct = showPerPage * ( currentPage -1 );

        // getting new base value after the pagination
        this.base = this.base
                    // to show a only a fix number of products
                    .limit(showPerPage)
                    // how many products needs to be skipped
                    .skip(skipProduct)


        // return both base and query
        return this;
            
    }
}


module.exports = WhereClause;
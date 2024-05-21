const app = new Vue({

    el:"#app",

    data:{
        goods:[],
        basket:[],
        counter:0,
        showBasket:false
    },

    methods:{

        async addList(){
          const URL="https://api.npoint.io/a821f52125d01929c394"

          const responce=await fetch(URL);

          const item = await responce.json()
          this.goods = item;
        },


        addToBasket(e){
            this.counter+=1;
            const itemId = e.target.getAttribute('itemId');
            const item = this.goods.find((i)=>i.title===itemId);
            this.basket.push(item);

            this.showBasket=false;

        },

        show(){
            this.showBasket=true;
        },

        notshow(){
            this.showBasket=false;

        },

        deleteItem(de){
            console.log(de)
            this.basket.splice(de,1);
            this.counter-=1;
           
        },
        cleanBasket(){
            this.basket=[];
            this.counter=0;
        }


    },

    async mounted(){
        await this.addList()
    }



})
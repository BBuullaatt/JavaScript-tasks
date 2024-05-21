const app = new Vue({

    el:"#app",

    data:{
        goods:[],
        goodsMoto:[],
        basket:[],
        counter:0,
        showBasket:false
    },

    methods:{

        async addList(){
          const URL="https://api.npoint.io/a821f52125d01929c394"

          const responce=await fetch(URL);

          const item = await responce.json()

          if (item.length==0) return;

          this.goods = item;

          
        },

        async addMotoList(){
            const URL="https://api.npoint.io/3ea1f7d49492a8fd6392"
  
            const responce=await fetch(URL);
  
            const item = await responce.json()
            
            if (item.length==0) return;

            this.goodsMoto = item;
            
          },

        addToBasket(e){
            let item;
            const itemId = e.target.getAttribute('itemId');
            const arrGoods = e.target.getAttribute('arrGoods');

            if(arrGoods==0){
            item = this.goods.find((i)=>i.title===itemId);
            }else{
            item = this.goodsMoto.find((i)=>i.title===itemId); 
            }
            
            this.basket.push(item);

            this.counter=this.basket.length;

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
            this.counter=this.basket.length;
           
        },
        cleanBasket(){
            this.basket=[];
            this.counter=0;
        }


    },

    async mounted(){
        await this.addList();
        await this.addMotoList();
    }



})
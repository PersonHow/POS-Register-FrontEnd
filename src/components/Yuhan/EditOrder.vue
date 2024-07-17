<script>
import axios from 'axios'
export default {
    data() {
        return{
            mealDetail:{},
            optionList:[], //該餐點所有的客製選項 如:[ [ "加蔥+5", "不加蔥+0" ] ,["加蛋+15"]]
            selectOptions:[], //裝選取的選項
            otherReq:"", //其他備註
            quantity:null, //數量
            price:null
        }
    },
    props:['meal_detail','meal_price'],
    emits: ['update_meal_detail','cancel_edting','option_needing'],
    created(){
        this.getCustomOption()
        this.quantity = this.meal_detail.quantities
        if(this.meal_detail.custom_option != null){
            this.selectOptions = this.meal_detail.custom_option
        }
        this.price = this.meal_price
    },
    methods:{
        getCustomOption(){
            let mealId=[this.meal_detail.meal_id]
            axios.post("http://localhost:8080/custom/by_meal_id",mealId)
            .then(data => {
                console.log(data.data)
                //取得的資料為陣列 先判斷裡面有內容再遍歷裝進optionList
                if(data.data.length != 0){
                    this.optionList = data.data.map(item => {
                    //判斷選項是否需要分割
                    let options = item.option.includes(';') ? item.option.split(';') : [item.option]
                    return {
                        options: options,
                        ismustfill: item.ismustfill,
                        other: item.other,
                    }
                })
                }
            })
        },
        //將加價後的金額、數量、選項、備註傳回父層
        editedItems(){
            this.meal_detail.price = this.addition
            this.meal_detail.quantities = this.quantity
            this.meal_detail.custom_option = this.selectOptions
            this.meal_detail.otherReq = this.otherReq
            this.$emit('update_meal_detail', this.meal_detail)
        },
        //加數量
        addQuantiy(){
            this.quantity += 1
        },
        //減數量
        reducedQuantity(){
            if(this.quantity > 1){
                this.quantity -= 1
            }
        },
        //檢查必選中是否有選項被選中
        isOptionSelected(options) {
            //檢查是否有必選選項
            if (!options) {
            return false
            }
            const isSelected = options.some(option => this.selectOptions.includes(option))

            // 如果沒有任一選項被選中 發出一個事件開啟editMeal視窗
            if (!isSelected) {
                this.$emit('option_needing')
            }

            return isSelected;
        },
    },
    watch:{
        meal_detail: {
            immediate: true,
            handler(newValue) {
                if (newValue.custom_option != null) {
                this.selectOptions = newValue.custom_option;
                }
            },
            deep:true
        },
    },
    computed:{
        //把加購的選項金額加總
        addition(){
            let additionPrice = this.price + this.selectOptions.map(item => parseInt(item.split('+')[1])).reduce((a, b) => a + b, 0)
            return additionPrice
        },
        
    }
}
</script>

<template>
    <div class="card">
        <div class="x">
            <button @click="$emit('cancel_edting')">
                <font-awesome-icon icon="fa-regular fa-circle-xmark" class="fa-2x"/>
            </button>
        </div>
        <div class="row">
            <div class="colume">
                <h3>{{meal_detail.meal_name}}</h3>
                {{meal_detail.description}}
                <p class="price">NT. {{addition}}</p>
            </div>
        </div>
        <div v-for="(item, index) in optionList" :key="item" 
        :class="{ 'warn': item.ismustfill && !isOptionSelected(item.options) }" class="colume">
            餐點選項{{index+1}} : <span v-if="item.ismustfill">(必填)</span>
        <div class="d-flex flex-wrap">
                <div v-for="option in item.options" :key="option" class="wrap mx-2">
                    <input type="checkbox" v-model="selectOptions" :id="option" :value="option"
                    :required="item.ismustfill">
                    <label :for="option" >{{option}}</label>
                </div>
            </div>
            <div class="other">*{{item.other}}</div>
        </div>
        <p class="mt-3">其他需求:</p>
        <div class="form-floating">
        <textarea class="form-control" placeholder="其他需求" id="floatingTextarea"></textarea>
        <label for="floatingTextarea">請填寫</label>
        </div>
        <div class="quantity">
            <button @click="reducedQuantity()" >
                <font-awesome-icon icon="fa-solid fa-circle-minus" :class="{disable : quantity < 2}" class="fa-3x" />
            </button>
            <span>{{quantity}}</span>
            <button @click="addQuantiy()">
                <font-awesome-icon icon="fa-solid fa-circle-plus" class="fa-3x" />
            </button>
        </div>
        <div class="submit">
            <button @click="$emit('cancel_edting')" class="btn">取消</button>
            <button @click="editedItems()" class="btn primary">完成</button>
        </div>
    </div>
    <div class="bg"></div>
</template>

<style scoped lang="scss">

.card{
    max-height: 75vh;
    width: 35vw;
    overflow-y: auto;
    padding: 5%;
    margin: auto;
    box-shadow: 1px 0 5px rgba(128, 128, 128, 0.4);
    position: relative;
    background: #fff;
    z-index: 5;
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #888;
    }
}
.img{
    width: 60%;
    height: 30%;
    img{
        width: 100%;
    }
}
.row{
    display: flex;
}
.x{
    width: 100%;
    display: flex;
    justify-content: end;
    margin-bottom: 2%;
    button{
        background: transparent;
        border:0;
    }
    cursor: pointer;
}
.colume{
    margin: 2%;
    line-height: 2;
    transition: 0.3s;
    input{
        display: none;
        &:checked {
            + label {
                
                background: black;
                color: #fff;
                &::before {
                    content: "✔ ";
                }
            }
        }
    }
    label{
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid gray;
        background: #fff;
        border-radius: 10px;
        cursor: pointer;
    }
}

.wrap{
    flex-wrap: wrap;
}
.price{
    font-size: 30px;
}
.other{
    font-size: 14px;
    color: rgb(140, 140, 140);
}
.textarea{
    width: 100%;
    resize: none;
}
.disable{
    color: gray;
}
.quantity{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 5%;
    span{
        display: inline-block;
        margin: 5px 50px;
        font-size: 24px;
    }
    button{
        background: transparent;
        border:0;
        &:hover{
            cursor: pointer;
        }
        &:active{
            font-size: small;
        }
    }
}
.submit{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 10%;
    .btn{
        width: 40%;
        height: 40px;
        border-radius: 5px;
        border: 0;
        box-shadow: 0 1px 2px rgba(128, 128, 128, 0.4);
    }
    .primary{
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: #fff;
    }
}
.bg{
    position: absolute;
    top: 0;
    height: 100%;
    width: 45vw;
    backdrop-filter:brightness(90%);
}

.warn{
    background: #ffb8a99a;
    border-radius: 10px;
    span{
        color: #f96c45;
    }
    .other{
        color: #ffffff;
    }
}
</style>
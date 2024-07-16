// 定義defineStore
import {defineStore} from 'pinia'
import Swal from 'sweetalert2'
// 建立store
export const useMenuStore = defineStore("menuStore",{
    state(){
        return{
            menu:[], //DB裡的菜單
            custom_options:[], //DB裡的客製選項
            types:[], //菜單裡的所有種類
            working_areas:["煎台","油炸台","煮制台","飲料台","烤爐台","冷盤台"],
            toggleEdit: false,
            meal:{
                // meal_id:null,
                // type:"",
                // name:"",
                // description:"",
                // price:0,
                // img:"",
                // staff_id:null,
                // working_area:"",
            },
            //正在編輯的客製化選項
            updateOptions:{
                    "custom_id":9,
                    "options":"蘑菇醬+0;黑胡椒醬+0;紅酒醬+10",
                    "meal_id":";1;3;5;",
                    "ismustfill":true,
                    "other":"紅酒醬僅周末提供",
                    "staff_id":1
                }
            
        }
    },
    getters:{
        getItemsByType: (state) => (type) => {
            if(type === 'all'){
                return state.menu
            }
            return state.menu.filter(item => item.type === type || item.working_area === type);
        },
        getOptionsByMealId: (state) => (meal_id) => {
            let options = [];
            state.custom_options.forEach(custom_option => {
                if (custom_option.meal_id.includes(";"+meal_id+";")) {
                    options.push({ name: custom_option.options, id: custom_option.custom_id })
                }
            });
            return options
        },
    },
    actions:{
        //取得菜單內餐點
        getMenu(){
            fetch("http://localhost:8080/menu",{
                method:'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.menu = data
                //將所有餐點類別取出 並過濾重複的種類
                let set = new Set(data.map(item => item.type))
                this.types = Array.from(set)
            })
        },
        //取得客製化選項
        getCustomOption(){
            fetch("http://localhost:8080/custom",{
                method:'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.custom_options = data.map(item => {
                    return {
                        custom_id: item.custom_id,
                        options: item.option,
                        meal_id: ";"+item.meal_id+";",
                        ismustfill: item.ismustfill,
                        other: item.other,
                        staff_id: item.staff_id,
                    }
                })
            })
        },
        confirmModal(){
            Swal.fire({
                title: '確定要刪除?',
                text: '此動作無法復原',
                icon: 'warning',
                confirmButtonColor: '#00c1ca',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                }
            });
        },
        // 先用meal_id來判斷餐點是否存在，存在就執行更新 或無則新增餐點
        setNewMenu(meal){
            let index = this.menu.findIndex(m => m.meal_id === meal.meal_id)
            // 客製化選項轉回一般陣列形式
            if(meal.options){
                let optionsArray = meal.options.map(option => option.name)
            }
            
            let updateMenu  = {
                meal_id:meal.meal_id,
                type:meal.type,
                name:meal.name,
                description:meal.description,
                price:meal.price,
                img:meal.img,
                staff_id:1,
                working_area:meal.working_area,
            }
            if (index == -1) {
                fetch("http://localhost:8080/menu",{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(updateMenu)
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    Swal.fire({
                        title: '新增成功',
                        icon: 'success',
                        confirmButtonColor: '#00c1ca',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });

                })
            }else{
                fetch(`http://localhost:8080/menu/${meal.meal_id}`,{
                    method:'PUT',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(updateMenu)
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                    Swal.fire({
                        title: '修改成功',
                        icon: 'success',
                        confirmButtonColor: '#00c1ca',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    })
                })
            }
        },
        //新增客製選項
        setNewOption(options){
            this.custom_options.push(options)
        },
        //編輯該編號之餐點
        editing(meal_id){
            this.meal = {...this.menu.find(meal => meal.meal_id === meal_id)}
            this.meal.options = this.getOptionsByMealId(meal_id)
            this.toggleEdit = true
            return this.meal
        },
        cancelEditing(){
            this.toggleEdit = false
        },
        clearMeal(){
            this.meal = {}
        },
        //刪除餐點 
        deleteMeal(meal_id){
            Swal.fire({
                title: '確定要刪除?',
                text: '此動作無法復原',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00c1ca',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:8080/menu/${meal_id}`,{
                        method:'DELETE',
                    })
                    .then(res => res.text())
                    .then(data => {
                        console.log(data)
                        Swal.fire({
                            title: '已刪除',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#00c1ca',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    })
                }
            });
            
        }

    }
})